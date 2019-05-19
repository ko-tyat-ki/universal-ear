/* global console */

import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

const BAUD_RATE = 9600 // TODO pass as an argument

class HardwareMeasurementsProvider {
  constructor() {
    this.devices = []
    this.ports = {}
    this.parsers = {}
    this.deviceData = {}
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

  startListening(name) {
    let _self = this
    this.parsers[name].on('data', function (data) {
      // TODO: rewrite arduino code
      // console.log('data', data)

      if (data[0] !== 'r') {
        // Sometimes parial data is being read from port, checking that string starts with right symbol
        return
      }

      data = data.trimRight().split('|')

      let ledCount = data[1]
      let sensor = data[2]
      let value = data[3]
      let diffFast = data[4]
      let diffSlow = data[5]

      // NOTE: temporary for test
      let newData = {
        'value': value,
        'ledCount': ledCount,
        'sensor': sensor,
        'diffFast': diffFast,
        'diffSlow': diffSlow,
      }
      _self.deviceData[name] = Object.assign({}, _self.deviceData[name], newData)
    })
  }

  sendOutput(device, data) {
    // console.log(`Send value:`, data)

    this.ports[device].write(data, function (err) {
      if (err) {
        return console.log('Error on write: ', err.message)
      }
      // console.log('SENT!!!')
    })
  }

  getCurrentMeasurements() {
    return this.deviceData
  }
}

export { HardwareMeasurementsProvider as default }
