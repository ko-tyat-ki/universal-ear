/* global console */

let tensionKey = "tension"

class WebMeasurementsProvider {
  constructor() {
    this.socket = null
    this.devices = []
    this.deviceData = {}
  }

  getDeviceData() {
    if (!this.getSocket()) return []

    let data = this.deviceData[this.getSocket().id]

    if (!data) return []

    return Object
      .keys(data)
      .map(el => { return {name: el, tension: data[el]}})
  }

  removeInput(socket) {
    let id = socket.id
    delete this.deviceData[id]
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

  getSocket() {
    return this.socket
  }

  listenForInput(socket) {
    this.socket = socket

    socket.on('disconnect', (err) => {
      // TODO: logging
      console.log('Input disconnected. Removing handlers', err)
      this.removeInput(socket.id)
    })

    // TODO: probably should be started elsewhere.
    this.startListening(socket)
  }

  writeData(ledsConfig) {
    let socket = this.getSocket()
    ledsConfig.map(ledConfig => socket.emit('ledsChanged', ledConfig))
  }

  startListening(socket) {
    socket.on('measurements', (measurements) => {
      // console.log(measurements)

      // TODO: logging
      if (!measurements) return

      // TODO: log measurements into file (+ rotate log and remove zero values)

      let deviceData = {}

      measurements.sort((a, b) => a.order - b.order).forEach(measurement => {
        deviceData[measurement['name']] = measurement[tensionKey]
      })

      this.deviceData[socket.id] = deviceData
    })
  }

  sendOutput(device, data) {
    console.log("write", this.socket.id)
    this.socket.write(data)
  }

  getCurrentMeasurements() {
    return this.deviceData
  }
}

export default WebMeasurementsProvider
