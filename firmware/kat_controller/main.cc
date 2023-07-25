/**
 * Copyright (c) 2023 Matthew Lai (Kinki Yokai project)
 * Copyright (c) 2020 Raspberry Pi (Trading) Ltd.
 *
 * This is the Kinki Yokai controller firmware. It reads WS2812B LED values
 * from USB, and re-shapes them as necessary to send out using PIO.
 *
 * BSD 3-clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of mosquitto nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

#include <cmath>
#include <cstdint>
#include <cstring>
#include <cstdio>
#include "hardware/adc.h"
#include "hardware/dma.h"
#include "hardware/structs/bus_ctrl.h"
#include "pico/sem.h"
#include "pico/stdio/driver.h"
#include "pico/stdio_usb.h"
#include "pico/stdlib.h"
#include "pico/time.h"

#include "ws2812parallel16b.pio.h"

// LEDs.
constexpr int kNumStrips = 16;
constexpr int kMaxStripLength = 1024;
constexpr int kLedPinBase = 0;
constexpr int kTestModeTimeoutUs = 1000000; // If we don't get an update for this long, go into test mode.

// Switched 12V outputs.
constexpr int kSwitchedOutputsPins[] = { 17, 18, 19, 20 };

// Analog multiplexer.
constexpr int kAMuxControlPins[] = { 23, 24, 25 };
constexpr int kAMuxAnalogInPin = 26; // ADCIn0
constexpr int kAMuxPropagationDelayUs = 1; // Datasheet specifies max 720ns.

// Pull sensors.
constexpr int kNumPullSensors = 5;
constexpr int kPullSensorAnalogMuxPins[kNumPullSensors] = { 3, 0, 1, 2, 5 };
constexpr int kPullSensorFixedResistance = 1500; // 3V3 -> 1.5k -> test -> gnd.
constexpr int kPullSensorNumReads = 16; // Average multiple readings.

// Test button / LED.
constexpr int kTestButtonPin = 27;
constexpr int kTestLEDPin = 16;

// If raw reading is above this, assume we don't have a sensor attached.
constexpr int kPullSensorRawReadingThreshold = 3500;  // 3500 = ~9kOhms

// For testing USB CDC interface.
constexpr int kDebugPrintTimingIntervalUs = 1000000;

constexpr uint8_t kStartSeq[4] = { 0xe5, 0x6b, 0x03, 0x1d };
constexpr uint16_t kMaxPacketLen = 4096;

// Message types to host.
constexpr uint8_t kDebugInfoPacketType = 0x1;
constexpr uint8_t kReadyPacketType = 0x8;

// Message types from host.
constexpr uint8_t kLEDDataUpdateMessageType = 0x1;
constexpr uint8_t kLEDSwapMessageType = 0x10;

// In test mode we need to pre-compute an approximate sinusoidal function.
// This is the resolution for that function.
constexpr int kSinusoidalLutResolution = 4096;

constexpr int kTestLedPeriod = 10;
constexpr int kTestBrightness = 192;

// This is the RGB data stored per strip. Each LED at each
// strip has 3 bytes - green, red, blue.
uint8_t g_pixel_data_buffer[kNumStrips][kMaxStripLength * 3];

// Each 32-bit word is divided into two 16-bit words. Each 16-bit
// word is a bit for all 16 strips.
// This is stored in DMA order into PIO, and PIO is set up to
// do right shifts. That means the 32-bit words are sent in address
// order, but within each 32-bit word, the lower 16-bit half is
// transmitted first. So the transmission order is:
// [1, 0], [3, 2], [5, 4]...
// Double buffered.
constexpr int kMaxNumBitsPerStrip = 24 * kMaxStripLength;
uint32_t g_transposed_output_buffer[2][kMaxNumBitsPerStrip / 2];

// Test mode waveforms. This really should be a power of 2. Makes a huge difference
// in refresh rate because we do a lot of divisions using this as the divider.
constexpr int kTestColourPeriodUSeconds = 1 << 20;

constexpr uint32_t kMainDmaChannel = 0;

// Semaphore posted when it's safe to send next set of values;
static struct semaphore g_reset_delay_complete_sem;

// Alarm handle for handling delay.
alarm_id_t g_reset_delay_alarm_id;

// This function updates g_transposed_output_buffer from g_pixel_data_buffer.
void UpdateTransposedBuffer(uint8_t current_buffer) {
  std::size_t next_output_idx = 0;
  for (uint32_t byte_num = 0; byte_num < kMaxStripLength * 3; ++byte_num) {
    uint8_t next_bytes_per_strip[kNumStrips];
    for (uint32_t i = 0; i < kNumStrips; ++i) {
      next_bytes_per_strip[i] = g_pixel_data_buffer[i][byte_num];
    }
    // Each group of 2 bits per strip makes the next transposed 32-bit word.
    for (uint32_t bit_group = 0; bit_group < 4; ++bit_group) {
      uint32_t out = 0;
      uint8_t bit0_shift = ((4 - bit_group) * 2 - 1);
      uint8_t bit1_shift = ((4 - bit_group) * 2 - 2);
      uint8_t bit0_mask = 0x1 << bit0_shift;
      uint8_t bit1_mask = 0x1 << bit1_shift;
      for (uint32_t strip = 0; strip < kNumStrips; ++strip) {
        uint32_t bit0 = (next_bytes_per_strip[strip] & bit0_mask) >> bit0_shift;
        uint32_t bit1 = (next_bytes_per_strip[strip] & bit1_mask) >> bit1_shift;
        out |= bit0 << strip;
        out |= bit1 << (strip + 16);
      }
      g_transposed_output_buffer[current_buffer][next_output_idx++] = out;
    }
  }
}

template <typename T>
T min(T a, T b) {
  return a < b ? a : b;
}

int64_t reset_delay_complete(alarm_id_t id, void *user_data) {
  g_reset_delay_alarm_id = 0;
  sem_release(&g_reset_delay_complete_sem);
  return 0;  // Do not reschedule.
}

void __isr dma_complete_handler() {
  uint32_t dma_channel_mask = (1 << kMainDmaChannel);
  if (dma_hw->ints0 & dma_channel_mask) {
    // Clear IRQ.
    dma_hw->ints0 = dma_channel_mask;
    // When the dma is complete we start the reset delay timer.
    if (g_reset_delay_alarm_id) {
      cancel_alarm(g_reset_delay_alarm_id);
    }
    g_reset_delay_alarm_id = add_alarm_in_us(/*us=*/400, reset_delay_complete,
                                             /*user_data=*/NULL, /*fire_if_past=*/true);
  }
}

void dma_init(PIO pio, uint sm) {
  dma_channel_claim(kMainDmaChannel);

  // main DMA channel outputs 8 word fragments, and then chains back to the chain channel
  dma_channel_config channel_config = dma_channel_get_default_config(kMainDmaChannel);
  channel_config_set_transfer_data_size(&channel_config, DMA_SIZE_32);
  channel_config_set_dreq(&channel_config, pio_get_dreq(pio, sm, /*is_tx=*/true));
  channel_config_set_read_increment(&channel_config, /*incr=*/true);
  channel_config_set_write_increment(&channel_config, /*incr=*/false);
  dma_channel_configure(kMainDmaChannel,
                        &channel_config,
                        /*write_addr=*/&pio->txf[sm],
                        /*read_addr=*/NULL,  // Set by caller.
                        /*transfer_count=*/kMaxNumBitsPerStrip / 2,  // 16-bit words packed into 32-bit transfers.
                        /*trigger=*/false);

  irq_set_exclusive_handler(DMA_IRQ_0, dma_complete_handler);
  dma_channel_set_irq0_enabled(kMainDmaChannel, true);
  irq_set_enabled(DMA_IRQ_0, true);
}

void start_dma_output(uint8_t current_buffer) {
  dma_channel_set_read_addr(kMainDmaChannel, &g_transposed_output_buffer[current_buffer][0], /*trigger=*/true);
}

void amux_init() {
  for (const auto& pin : kAMuxControlPins) {
    gpio_init(pin);
    gpio_set_dir(pin, /*out=*/true);
    gpio_put(pin, false);
  }
  adc_init();
  adc_gpio_init(kAMuxAnalogInPin);
  adc_select_input(0);
}

// [0, 4095] corresponding to 0-3.3V.
uint16_t read_amux_input(uint8_t amux_in) {
  gpio_put(kAMuxControlPins[0], amux_in & 0x1);
  gpio_put(kAMuxControlPins[1], amux_in & (0x1 << 1));
  gpio_put(kAMuxControlPins[2], amux_in & (0x1 << 2));
  adc_select_input(0);
  sleep_us(kAMuxPropagationDelayUs);
  return adc_read();
}

// Returns resistances for pull sensors in ohms. -1 for invalid.
void read_all_pull_sensors(int32_t* ret) {
  int32_t raw_sums[kNumPullSensors] = { 0 };

  for (int i = 0; i < kPullSensorNumReads; ++i) {
    for (int sensor = 0; sensor < kNumPullSensors; ++sensor) {
      raw_sums[sensor] += read_amux_input(kPullSensorAnalogMuxPins[sensor]);
    }
  }

  for (int sensor = 0; sensor < kNumPullSensors; ++sensor) {
    int32_t raw = raw_sums[sensor] / kPullSensorNumReads;
    // The test resistance (x) is in series with 1.5kOhms.
    // Vnorm = x / (x + 1500)
    // x = Vnorm * 1500 / (1 - Vnorm)
    // x = Vraw * 1500 / (4096 - Vraw)
    // If we are reading above 3500, assume we have an option circuit (to prevent overflow).
    if (raw > kPullSensorRawReadingThreshold) {
      ret[sensor] = -1;
    } else {
      ret[sensor] = raw * kPullSensorFixedResistance / (4096 - raw);
    }
  }
}

// Sinusoidal function with range [0, test_brightness].
uint8_t test_sinusoidal(int t, int period) {
  static uint8_t* lut = []{
    uint8_t* lut = new uint8_t[kSinusoidalLutResolution];
    float step = 2.0f * M_PI / kSinusoidalLutResolution;
    for (int i = 0; i < kSinusoidalLutResolution; ++i) {
      lut[i] = min(static_cast<int>(round(cos(i * step) * kTestBrightness / 2)) + kTestBrightness / 2, kTestBrightness);
    }
    return lut;
  }();
  // t from [0, period] to [0, kSinusoidalLutResolution]
  t = t % period;
  t = static_cast<int64_t>(t) * kSinusoidalLutResolution / period;
  return lut[t];
}

void set_test_leds_data(uint64_t now) {
  // Where are we in the time cycle? [0 - kTestColourPeriodUSeconds]. We do the modulus in int64 and cast to int32 now.
  int t = now % kTestColourPeriodUSeconds;

  // Compute colours for all LEDs.
  for (int strip = 0; strip < kNumStrips; ++strip) {
    for (int led = 0; led < kMaxStripLength; ++led) {
      // [-128 - 128] -> [0, 255]
      int led_offset = static_cast<int64_t>(led % kTestLedPeriod) * kTestColourPeriodUSeconds / kTestLedPeriod;
      g_pixel_data_buffer[strip][led * 3] = test_sinusoidal(t + led_offset, kTestColourPeriodUSeconds);
      g_pixel_data_buffer[strip][led * 3 + 1] = test_sinusoidal(t + kTestColourPeriodUSeconds / 3 + led_offset, kTestColourPeriodUSeconds);
      g_pixel_data_buffer[strip][led * 3 + 2] = test_sinusoidal(t + 2 * kTestColourPeriodUSeconds / 3 + led_offset, kTestColourPeriodUSeconds);
    }
  }
}

// Using low level stdio_usb functions here:
// https://github.com/raspberrypi/pico-sdk/blob/master/src/rp2_common/pico_stdio_usb/stdio_usb.c
void write_packet(uint8_t type, const uint8_t* data, uint16_t len) {
  const int kHeaderSize = 7; // 4 start seq, 1 type, 2 len.
  uint8_t out_packet_buffer[kHeaderSize + len];
  for (int i = 0; i < 4; ++i) {
    out_packet_buffer[i] = kStartSeq[i];
  }
  out_packet_buffer[4] = type;
  out_packet_buffer[5] = len & 0xff;
  out_packet_buffer[6] = (len & 0xff00) >> 8;
  if ((kHeaderSize + len) > kMaxPacketLen) {
    len = kMaxPacketLen - kHeaderSize;
  }
  uint32_t packet_len = kHeaderSize + len;
  if (len > 0) {
    memcpy(out_packet_buffer + kHeaderSize, data, len);
  }
  stdio_usb.out_chars(reinterpret_cast<const char*>(out_packet_buffer), packet_len);
}

void send_debug_packet(const char* str) {
  write_packet(kDebugInfoPacketType, reinterpret_cast<const uint8_t*>(str), strlen(str));
}

void send_ready_packet() {
  write_packet(kReadyPacketType, nullptr, 0);
}

struct Packet {
  uint8_t type;
  uint8_t content[kMaxPacketLen];
};

bool have_new_packet() {
  static int current_sync_position = 0;
  char c;
  while (stdio_usb.in_chars(&c, 1) != PICO_ERROR_NO_DATA) {
    if (c == kStartSeq[current_sync_position]) {
      ++current_sync_position;
      if (current_sync_position == 4) {
        current_sync_position = 0;
        return true;
      }
    } else {
      current_sync_position = 0;
    }
  }
  return false;
}

// Try to read a packet (the packet is built potentially
// over several calls). Returns a non-null pointer when we
// have a whole packet.
Packet* read_packet() {
  static Packet packet;
  enum State {
    kWaitForStart, // Waiting for the start sequence.
    kReadHeader, // Waiting for header (excluding start seq).
    kReadContent, // Waiting for message content.
  };
  static State state = State::kWaitForStart;
  static uint8_t message_header[3];
  static uint8_t message_header_bytes_read = 0;
  static uint16_t content_len = 0;
  static uint16_t content_read = 0;
  if (state == State::kWaitForStart) {
    if (have_new_packet()) {
      state = State::kReadHeader;
    }
  }
  char c;
  if (state == State::kReadHeader) {
    while (stdio_usb.in_chars(&c, 1) != PICO_ERROR_NO_DATA) {
      message_header[message_header_bytes_read++] = c;
      if (message_header_bytes_read == 3) {
        state = State::kReadContent;
        packet.type = message_header[0];
        content_len = message_header[1] | static_cast<uint16_t>(message_header[2]) << 8;
        if (content_len > kMaxPacketLen) {
          content_len = kMaxPacketLen;
        }
        break;
      }
    }
  }
  if (state == State::kReadContent) {
    int ret = 0;
    if ((content_len - content_read) > 0) {
      ret = stdio_usb.in_chars(reinterpret_cast<char*>(packet.content) + content_read,
                               content_len - content_read);
    }
    if (ret == PICO_ERROR_NO_DATA) {
      return nullptr;
    } else {
      content_read += ret;
      if (content_read >= content_len) {
        state = State::kWaitForStart;
        message_header_bytes_read = 0;
        content_read = 0;
        return &packet;
      }
    }
  }
  return nullptr;
}

int main() {
  stdio_usb_init();

  amux_init();

  for (const auto& pin : kSwitchedOutputsPins) {
    gpio_init(pin);
    gpio_set_dir(pin, /*out=*/true);
    gpio_put(pin, false);
  }

  gpio_init(kTestButtonPin);
  gpio_set_dir(kTestButtonPin, /*out=*/false);
  gpio_set_pulls(kTestButtonPin, /*up=*/true, /*down=*/false);

  gpio_init(kTestLEDPin);
  gpio_set_dir(kTestLEDPin, /*out=*/true);
  gpio_put(kTestLEDPin, /*out=*/false);

  // Give the DMA controller bus priority so if we are doing something memory-intensive on the CPU, the PIO blocks
  // driving the LEDs don't get buffer underflow.
  bus_ctrl_hw->priority = BUSCTRL_BUS_PRIORITY_DMA_W_BITS | BUSCTRL_BUS_PRIORITY_DMA_R_BITS;

  PIO pio = pio0;
  int sm = 0;
  uint offset = pio_add_program(pio, &ws2812_parallel_16b_program);

  ws2812_parallel_16b_program_init(pio, sm, offset, kLedPinBase, kNumStrips, 800000);

  sem_init(&g_reset_delay_complete_sem, /*initial_permits=*/1, /*max_permits=*/1); // initially posted so we don't block first time
  dma_init(pio, sm);

  absolute_time_t start_time = get_absolute_time();
  absolute_time_t last_print_time = start_time;
  absolute_time_t last_update_time = start_time;

  uint8_t current_buffer = 0;

  char debug_info[1024];

  while (true) {
    auto now = get_absolute_time();

    bool make_debug_info = false;

    if ((now - last_print_time) >= kDebugPrintTimingIntervalUs) {
      last_print_time = now;
      make_debug_info = true;
      debug_info[0] = '\0';
    }

    bool swapping = false;

    Packet* maybe_packet = read_packet();
    if (maybe_packet) {
      switch (maybe_packet->type) {
      case kLEDDataUpdateMessageType:
      {
        uint8_t channel = maybe_packet->content[0];
        uint16_t num_leds = maybe_packet->content[1] | (static_cast<uint16_t>(maybe_packet->content[2]) << 8);
        if (num_leds > kMaxStripLength) {
          num_leds = kMaxStripLength;
        }
        uint8_t* buf = &g_pixel_data_buffer[channel][0];
        memcpy(buf, maybe_packet->content + 3, num_leds * 3);
        last_update_time = now;
      }
        break;
      case kLEDSwapMessageType:
        swapping = true;
        break;
      }
    }

    bool test_mode = false;
    if ((now - last_update_time) >= kTestModeTimeoutUs || gpio_get(kTestButtonPin) == false) {
      test_mode = true;
    }

    if (test_mode) {
      set_test_leds_data(now);
      if (make_debug_info) {
        sprintf(debug_info + strlen(debug_info),
          "Done computing test colours: %d\n", static_cast<int32_t>(absolute_time_diff_us(now, get_absolute_time())));
      }
      swapping = true;
    }

    if (swapping) {
      UpdateTransposedBuffer(current_buffer);

      if (make_debug_info) {
        sprintf(debug_info + strlen(debug_info),
          "Done updating transposed buffer: %d\n", static_cast<int32_t>(absolute_time_diff_us(now, get_absolute_time())));
      }

      sem_acquire_blocking(&g_reset_delay_complete_sem);

      if (make_debug_info) {
        sprintf(debug_info + strlen(debug_info),
          "Acquired semaphore: %d\n", static_cast<int32_t>(absolute_time_diff_us(now, get_absolute_time())));
      }

      start_dma_output(current_buffer);
      current_buffer ^= 0x1;

      send_ready_packet();
    }

    // Pull sensors.
    int32_t pull_sensor_raw_values[kNumPullSensors];
    read_all_pull_sensors(pull_sensor_raw_values);

    if (make_debug_info) {
      sprintf(debug_info + strlen(debug_info),
        "Pull raw: %d %d %d %d %d\n", pull_sensor_raw_values[0], pull_sensor_raw_values[1],
             pull_sensor_raw_values[2], pull_sensor_raw_values[3], pull_sensor_raw_values[4]);
    }

    if (make_debug_info) {
      send_debug_packet(debug_info);
    }
  }
  return 0;
}
