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
#include <stdio.h>
#include "hardware/dma.h"
#include "pico/sem.h"
#include "pico/stdlib.h"
#include "pico/time.h"

#include "ws2812parallel16b.pio.h"

constexpr int kNumStrips = 16;
constexpr int kMaxStripLength = 512;
constexpr int kLedPinBase = 0;

// For testing USB CDC interface.
constexpr int kPrintHelloWorldIntervalUs = 1000000;

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

// Test mode waveforms.
constexpr int kTestColourPeriodUSeconds = 1000000;
constexpr int kTestLengthPeriodLeds = 10;
constexpr int kTestStripPeriod = 10;

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
  dma_claim_mask(1 << kMainDmaChannel);

  // main DMA channel outputs 8 word fragments, and then chains back to the chain channel
  dma_channel_config channel_config = dma_channel_get_default_config(kMainDmaChannel);
  channel_config_set_transfer_data_size(&channel_config, DMA_SIZE_32);
  channel_config_set_dreq(&channel_config, pio_get_dreq(pio, sm, /*is_tx=*/true));
  channel_config_set_read_increment(&channel_config, /*incr=*/true);
  channel_config_set_write_increment(&channel_config, /*incr=*/false);
  dma_channel_configure(kMainDmaChannel,
                        &channel_config,
                        /*write_addr=*/&pio->txf[sm],
                        /*read_addr=*/NULL, // set by caller
                        /*transfer_count=*/8, // 8 words (16 bits per channel)
                        /*trigger=*/false);

  irq_set_exclusive_handler(DMA_IRQ_0, dma_complete_handler);
  dma_channel_set_irq0_enabled(kMainDmaChannel, true);
  irq_set_enabled(DMA_IRQ_0, true);
}

void start_dma_output(uint8_t current_buffer) {
  uint32_t trans_count = kMaxNumBitsPerStrip / 2;
  dma_channel_set_read_addr(kMainDmaChannel, &g_transposed_output_buffer[current_buffer][0], /*trigger=*/false);
  dma_channel_set_trans_count(kMainDmaChannel, trans_count, /*trigger=*/true);
}

int main() {
  stdio_init_all();

  PIO pio = pio0;
  int sm = 0;
  uint offset = pio_add_program(pio, &ws2812_parallel_16b_program);

  ws2812_parallel_16b_program_init(pio, sm, offset, kLedPinBase, kNumStrips, 800000);

  sem_init(&g_reset_delay_complete_sem, /*initial_permits=*/1, /*max_permits=*/1); // initially posted so we don't block first time
  dma_init(pio, sm);

  uint64_t iter = 0;
  absolute_time_t last_print_time = get_absolute_time();

  uint8_t current_buffer = 0;

  while (true) {
    auto now = get_absolute_time();

    // Where are we in the time cycle? [0 - 1]
    float t = static_cast<float>(now % kTestColourPeriodUSeconds) / kTestColourPeriodUSeconds;

    // Pre-compute LED offsets for each LED position.
    float led_offsets[kMaxStripLength];
    for (int led = 0; led < kMaxStripLength; ++led) {
      led_offsets[led] = static_cast<float>(led % kTestLengthPeriodLeds) / kTestLengthPeriodLeds;
    }

    // Compute colours for all LEDs.
    for (int strip = 0; strip < kNumStrips; ++strip) {
      float strip_offset = static_cast<float>(strip % kTestStripPeriod) / kTestStripPeriod;
      for (int led = 0; led < kMaxStripLength; ++led) {
        // RGB cycles are offset by 0, 1/3, 2/3 cycles.
        int r = round(sin((t + strip_offset + led_offsets[led]) * 2.0f * M_PI) * 128.0f); 
        int g = round(sin((t + 0.33f + strip_offset + led_offsets[led]) * 2.0f * M_PI) * 128.0f);
        int b = round(sin((t + 0.66f + strip_offset + led_offsets[led]) * 2.0f * M_PI) * 128.0f);

        // [-128 - 128] -> [0, 255]
        g_pixel_data_buffer[strip][led * 3] = min(g + 128, 255);
        g_pixel_data_buffer[strip][led * 3 + 1] = min(r + 128, 255);
        g_pixel_data_buffer[strip][led * 3 + 2] = min(b + 128, 255);
      }
    }

    UpdateTransposedBuffer(current_buffer);

    sem_acquire_blocking(&g_reset_delay_complete_sem);
    start_dma_output(current_buffer);

    if ((now - last_print_time) >= kPrintHelloWorldIntervalUs) {
      printf("Hello, world!\n");
      last_print_time = now;
    }
    ++iter;
    current_buffer ^= 0x1;
  }
  return 0;
}
