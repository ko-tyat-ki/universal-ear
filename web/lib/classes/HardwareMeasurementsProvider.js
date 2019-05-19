/* global console */

import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

const BAUD_RATE = 115200 // TODO pass as an argument

class HardwareMeasurementsProvider {
  constructor() {
    this.devices = []
    this.ports = {}
    this.parsers = {}
    this.deviceData = {}
    this.toWrite = {}
  }

  removeInput(name) {
    delete this.ports[name]
    delete this.parsers[name]
    delete this.deviceData[name]

    let indexToDelete = this.devices.indexOf(name)
    if (indexToDelete >= 0) {
      this.devices.splice(indexToDelete)
    }
  }

  getInputs() {
    let inputs = []

    this.devices.sort((a, b) => {
      return a.order - b.order
    }).forEach((device) => {
      inputs.push(device.name)
    })
    return inputs
  }

  listenForInput(name, order) {
    this.devices.push({
      name: name,
      order: order,
    })

    // TODO: looks ugly
    this.ports[name] = new SerialPort('/dev/tty' + name, { baudRate: BAUD_RATE })
    this.parsers[name] = this.ports[name].pipe(new Readline({ delimiter: '\n' }))

    // port failures
    this.ports[name].on('error', (err) => {
      // TODO: logging
      console.log('Port failure, removing device.', err)
      this.removeInput()
    })

    // port failures
    this.ports[name].on('close', (err) => {
      // TODO: logging
      console.log('Port was closed.', err)
      this.removeInput(name)
    })

    // TODO: probably should be started elsewhere.
    this.startListening(name)
  }

  setToWrite(name, ledsConfig) {
    this.toWrite[name] = ledsConfig
  }

  startListening(name) {
    let _self = this
    this.parsers[name].on('data', function (data) {
      // TODO: rewrite arduino code
      console.log(data)
      data = data.trim().split("\t")

      let ledCount = 40
      let sensor = "s1"
      let value = data[0]
      let diffFast = data[1]
      let diffSlow = data[2]
      let newData = {
        'value': value,
        'ledCount': ledCount,
        'sensor': sensor,
        'diffFast': diffFast,
        'diffSlow': diffSlow,
      }
      _self.deviceData[name] = Object.assign({}, _self.deviceData[name], newData)

      if (!_self.toWrite[name]) return

      _self.writeData(name, _self.toWrite[name].filter(c => c != null))

      // TODO: this is old format
      //
      // if (data[0] !== 'r') {
      //   // Sometimes parial data is being read from port, checking that string starts with right symbol
      //   return
      // }
      //
      // data = data.trimRight().split('|')
      //
      // let ledCount = data[1]
      // let sensor = data[2]
      // let value = data[3]
      // let diffFast = data[4]
      // let diffSlow = data[5]
      //
      // // NOTE: temporary for test
      // let newData = {
      //   'value': value,
      //   'ledCount': ledCount,
      //   'sensor': sensor,
      //   'diffFast': diffFast,
      //   'diffSlow': diffSlow,
      // }
      // _self.deviceData[name] = Object.assign({}, _self.deviceData[name], newData)

    })

  }

  writeData(device, data) {
    if (!data) return

    if (!data[0]) return

    let leds = data[0][0].leds

    let _self = this

    // _self.ports[device].write("<0>")

    for (let i = 0; i < leds.length; i++) {
      let num = leds[i].number + 1
      _self.ports[device].write(`<${num},255,0,0>\n`, () => {
        console.log(arguments)
      })
    }
  }

  getDeviceData(name) {

    let data = this.deviceData[name]

    if (!data) return []

    return [
      {
        name,
        tension: data.value,
      }
    ]
  }
}

export { HardwareMeasurementsProvider as default }
