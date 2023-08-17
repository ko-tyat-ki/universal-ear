#  Copyright (c) 2023 Matthew Lai (Kinki Yokai project)
#  Copyright (c) 2020 Raspberry Pi (Trading) Ltd.
#
#  This is the Kinki Yokai controller firmware. It reads WS2812B LED values
#  from USB, and re-shapes them as necessary to send out using PIO.
#
#  BSD 3-clause
#
#  Redistribution and use in source and binary forms, with or without
#  modification, are permitted provided that the following conditions are met:
#
#  1. Redistributions of source code must retain the above copyright notice,
#     this list of conditions and the following disclaimer.
#  2. Redistributions in binary form must reproduce the above copyright
#     notice, this list of conditions and the following disclaimer in the
#     documentation and/or other materials provided with the distribution.
#  3. Neither the name of mosquitto nor the names of its
#     contributors may be used to endorse or promote products derived from
#     this software without specific prior written permission.
# 
#  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
#  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
#  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
#  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
#  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
#  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
#  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
#  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
#  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
#  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
#  POSSIBILITY OF SUCH DAMAGE.

import io
import serial
import sys
import time

from datetime import datetime

# From device
DEBUG_MESSAGE_TYPE = b'\x01'
PULL_SENSOR_MESSAGE_TYPE = b'\x02'
READY_MESSAGE_TYPE = b'\x08'

# To device
LED_DATA_MESSAGE_TYPE = b'\x01'
LED_FIRE_MESSAGE_TYPE = b'\x02'
LED_SWAP_MESSAGE_TYPE = b'\x10'

NUM_LEDS_PER_CHANNEL = 512

START_SEQ = [ b'\xe5', b'\x6b', b'\x03', b'\x1d' ]

MOONS = {
  # Pull sensor -> LED channel.
  0: 0
}

def wait_until_start_seq(s):
  current_position = 0
  while current_position < 4:
    c = s.read()
    if c == START_SEQ[current_position]:
      current_position += 1
    else:
      current_position = 0

def read_u16(s):
  return int.from_bytes(s.read(2), 'little', signed=False)

def read_s16(s):
  return int.from_bytes(s.read(2), 'little', signed=True)

def as_u16(slice):
  assert len(slice) == 2
  return int.from_bytes(slice, 'little', signed=False)

def as_s16(slice):
  assert len(slice) == 2
  return int.from_bytes(slice, 'little', signed=True)

# Returns (type, message)
def read_message(s):
  wait_until_start_seq(s)
  msg_type = s.read()
  msg_len = read_u16(s)
  content = s.read(msg_len)
  return msg_type, content

def make_message(message_type, message):
  pkt = bytearray(b''.join(START_SEQ))
  pkt.extend(message_type)
  pkt.extend(len(message).to_bytes(2, byteorder='little'))
  pkt.extend(message)
  return pkt

def make_led_data_message(channel):
  message = []
  message.append(channel)
  num_leds_bytes = NUM_LEDS_PER_CHANNEL.to_bytes(2, byteorder='little')
  message.append(num_leds_bytes[0])
  message.append(num_leds_bytes[1])
  for _ in range(NUM_LEDS_PER_CHANNEL):
    message.append(64)
    message.append(64)
    message.append(64)
  return make_message(LED_DATA_MESSAGE_TYPE, message)

def make_swap_message():
  return make_message(LED_SWAP_MESSAGE_TYPE, bytearray())

def make_fire_message(channel, brightness):
  message = []
  message.append(channel)
  message.append(brightness)
  return make_message(LED_FIRE_MESSAGE_TYPE, message)

def main():
  if len(sys.argv) < 2:
    print(f'Usage: {sys.argv[0]} <serial port>')
    exit(1)
  port = sys.argv[1]
  s = None
  print(f'Trying to connect to {port}')
  last_frame_time = datetime.now().timestamp()
  last_framerate_print_time = last_frame_time
  sensor_last_pull_times = [last_frame_time] * 5
  while True:
    try:
      with serial.Serial(port) as s:
        print(f'Connected to {port}')
        while True:
          msg_type, msg_content = read_message(s)
          if msg_type == DEBUG_MESSAGE_TYPE:
            print(f'Debug mesage:')
            print(msg_content.decode('utf-8'))
          if msg_type == READY_MESSAGE_TYPE:
            now = datetime.now().timestamp()
            frame_delay = now - last_frame_time
            last_frame_time = now
            if frame_delay < 1e-5:
              frame_delay = 1e-5
            messages = bytearray()
            for ch in range(16):
              if ch not in MOONS.values():
                messages.extend(make_led_data_message(ch))
            messages.extend(make_swap_message())
            s.write(messages)
            if (now - last_framerate_print_time) > 1.0:
              print(f'{(1 / frame_delay):.1f} fps')
              last_framerate_print_time = now
          if msg_type == PULL_SENSOR_MESSAGE_TYPE:
            num_sensors = as_u16(msg_content[0:2])
            now = datetime.now().timestamp()
            messages = bytearray()
            for sensor in range(5):
              base = 6 * sensor + 2
              raw = as_s16(msg_content[base:(base + 2)])
              diff_fast = as_s16(msg_content[(base + 2):(base + 4)])
              diff_slow = as_s16(msg_content[(base + 4):(base + 6)])
              since_last_pull = now - sensor_last_pull_times[sensor]
              if diff_fast > 30 and since_last_pull > 5.0:
                print(f'Sensor {sensor} pulled ({diff_fast})')
                sensor_last_pull_times[sensor] = now
              if sensor in MOONS:
                ch = MOONS[sensor]
                messages = bytearray()
                # print(f'Sensor {sensor}: {raw} {diff_fast} {diff_slow}')
                messages.extend(make_fire_message(ch, min(3 * abs(diff_slow), 255)))
            s.write(messages)


    except serial.serialutil.SerialException:
      if s is not None:
        # We successfully connected then lost connection, so give the user some feedback.
        print(f'Connection lost, retrying')
    time.sleep(1)
main()