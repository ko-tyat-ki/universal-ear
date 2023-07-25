# Firmware Setup

The board is based on the Raspberry Pi RP2040 (microcontroller used in the Raspberry Pi Pico).

## Raspberry Pi Pico SDK Setup

1. Install dependencies (Linux and WSL on Windows) (TODO: figure out equivalent for Homebrew on MacOS)
```
sudo apt install cmake gcc-arm-none-eabi libnewlib-arm-none-eabi libstdc++-arm-none-eabi-newlib
```

2. Clone the SDK repo
```
mkdir ~/pico
cd ~/pico
git clone https://github.com/raspberrypi/pico-sdk.git --recurse-submodules
```

3. Set environmental variable so CMake can find the SDK.
```
export PICO_SDK_PATH=~/pico/pico-sdk
echo 'export PICO_SDK_PATH=~/pico/pico-sdk' >> ~/.bashrc
```

## Build

```
cd firmware/kat_controller
mkdir build
cd build
cmake ..
make -j8
```

## Deploy

1. Power up the board in bootloader mode (press and hold USB_BOOT, press and release RESET, release USB_BOOT).
2. The board should enumerate as a USB storage device.
3. Copy the kat_controller.uf2 file to the USB storage device. It will automatically reset and boot into new firmware.

Alternatively, if picotool is installed, it can be used for upload without having to press buttons:
```
picotool load -v kat_controller.uf2 -f && picotool reboot
```
