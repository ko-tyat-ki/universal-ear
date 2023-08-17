cmake_minimum_required(VERSION 3.16)

set(PICO_BOARD_HEADER_DIRS ${CMAKE_SOURCE_DIR})
set(PICO_BOARD kat_controller_board)
include($ENV{PICO_SDK_PATH}/pico_sdk_init.cmake)

project(KatFirmware)

pico_sdk_init()

if (NOT TARGET tinyusb_device)
  message(ERROR "Cannot build kat_controller because TinyUSB submodule is not initialized in the SDK")
endif()

add_executable(kat_controller)

pico_generate_pio_header(kat_controller ${CMAKE_CURRENT_LIST_DIR}/ws2812parallel16b.pio)

target_sources(kat_controller PRIVATE main.cc)

# pull in common dependencies
target_link_libraries(kat_controller pico_stdlib hardware_adc hardware_pio hardware_pwm hardware_dma)

# enable usb output, disable uart output
pico_enable_stdio_usb(kat_controller 1)
pico_enable_stdio_uart(kat_controller 0)

# create map/bin/hex/uf2 file etc.
pico_add_extra_outputs(kat_controller)
