# Protocol Description

The board is based on the Raspberry Pi RP2040 (microcontroller used in the Raspberry Pi Pico.

## Transport Layer

* The control board enumerates as a CDC ACM class USB device, which is essentially a USB serial port.
Note that the device cannot be powered by USB. It must have external power before it will boot up
and connect to the host.
* Since the microcontroller supports USB natively, there is no USB-serial adaptor involved, and the
data is never translated into a real serial stream. Therefore, all serial port settings (baud rate,
stop bits, etc) are no-op (you don't have to set them). For compatibility you can set them to whatever
you want. The settings are ignored by the device.

## Protocol

#### Special Sequences
```
* START = 0xe5 0x6b 0x03 0x1d
```

### Host to Device

This is used to send LED data to the device. Communication format is binary. Each message starts
with the 4 bytes START sequence (so if the host and device loses sync, the device will look for the start
sequence and treat that as start of message). Next byte is the message type, and next 2 bytes (in little
endian) are the length of the rest of the message. Maximum message length (including header) is 4096 bytes.

```
[START (4)][MESSAGE_TYPE (1)][MESSAGE_LEN (2)][CONTENT (MESSAGE_LEN)]
```

#### LED data update (MESSAGE_TYPE=0x1)

LED data updates are done one channel at a time. The first byte of the message body specifies the channel.
The next 2 bytes (in little endian) specify number of LEDs, and following that is the LED data in GRB (one
byte for each channel of each LED).

```
CONTENT = [LED_OUTPUT_CHANNEL (1)][NUM_LEDS (2)][DATA (NUM_LEDS * 3)]
```
where
```
DATA = [LED0-G (1)][LED0-R (1)][LED0-B (1)][LED1-G (1)][LED1-R (1)][LED1-B (1)]...
```

#### LED fire mode (MESSAGE_TYPE=0x2)

Puts an LED channel in fire mode. Fire mode is cancelled if a data update is sent for this string. FIRE_BRIGHTNESS is diffslow in the original version.
CONTENT = [LED_OUTPUT_CHANNEL (1)][FIRE_BRIGHTNESS (1)]

#### LED swap/present (MESSAGE_TYPE=0x10)

This message signals the firmware to send the data out to the LEDs. We double-buffer the LED data so updates
do not cause artifacts in the display. This message tells the firmware to swap the buffers, and push the data
out to LEDs. This message has no content. After the buffer is swapped, the device will send a
Ready message (see below). This tells the host that it can start sending data for the next frame. Do not
send more data until Ready is received.

```
CONTENT = [] (empty)
```

### Device to Host

Messages from device to host follow the same general format.

```
[START (4)][MESSAGE_TYPE (1)][MESSAGE_LEN (2)][CONTENT (MESSAGE_LEN)]
```

#### Debug Info (MESSAGE_TYPE=0x1)

Human-readable debug data. Don't parse this!

```
CONTENT = [HUMAN_READABLE (N)]
```

#### Pull Sensor Updates (MESSAGE_TYPE=0x2)

Update from the pull sensors. Each sensor sends 3 values - a raw reading [0-1023], a difference between a fast
moving average to a slow moving average (DIFF_FAST), and a difference between a slow moving average to a very slow moving
average (DIFF_SLOW). Each of the values is a signed 16-bit number.

```
CONTENT = [NUM_SENSORS (1)][PULL0-RAW (2)][PULL0-DIFF_FAST (2)][PULL1-DIFF_SLOW (2)]...
```

#### Ready for LED Data (MESSAGE_TYPE=0x8)

This message is in response to "LED swap/present". It tells the host that the last frame has been sent to the LEDs (in practice,
this means the DMA transfer has been kicked off from RAM to PIO block, so CPU is no longer involved), and that the device is
ready for data for the next frame. This message has no content.

```
CONTENT = [] (empty)
```