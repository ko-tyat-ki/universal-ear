/* global console */

import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

const baudRate = 9600

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
    this.devices.forEach((deviceName) => {
      inputs.push(...Object.keys(this.deviceData[deviceName] || {}))
    })
    return inputs
  }

  listenForInput(name) {
    this.devices.push(name)

    // TODO: looks ugly
    this.ports[name] = new SerialPort('/dev/tty'+name, {baudRate: baudRate})
    this.parsers[name] = this.ports[name].pipe(new Readline({ delimiter: '\n' }))

    // port failures
    this.ports[name].on("error", (err) => {
      // TODO: logging
      console.log("Port failure, removing device.", err)
      this.removeInput()
    })

    // port failures
    this.ports[name].on("close", (err) => {
      // TODO: logging
      console.log("Port failure, removing device.", err)
      this.removeInput(name)
    })

    // TODO: probably should be started elsewhere.
    this.startListening(name)
  }

  startListening(name) {
    let _self = this
    this.parsers[name].on("data", function (data) {
      // TODO: rewrite arduino code

      // NOTE: temporary for test
      let newData = {
        "arduino": 0
      }

      // TODO: uncomment convert arduino output to dictionary of {<sensorname>: <value>}
      // let nameValueTuple = data.split(';')
      // let newData = {}
      // newData[nameValueTuple[0]] = nameValueTuple[1]
      _self.deviceData[name] = Object.assign({}, _self.deviceData[name], newData)
    })
  }

  getCurrentMeasurements() {
    return this.deviceData
  }
}

export default HardwareMeasurementsProvider
