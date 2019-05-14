/* global console */

class WebMeasurementsProvider {
  constructor() {
    this.sockets = []
    this.devices = []
    this.deviceData = {}
  }

  removeInput(socket) {
    let id = socket.id
    delete this.deviceData[id]

    let indexToDelete = this.sockets.indexOf(socket.id)
    if (indexToDelete >= 0) {
      this.sockets.splice(indexToDelete)
    }
  }

  getInputs() {
    let inputs = []

    this.devices.sort((a, b)  => {
      return a.order - b.order
    }).forEach((device) => {
      inputs.push(device.name)
    })
    return inputs
  }

  listenForInput(socket) {
    let socketId = socket.id
    this.sockets.push(socketId)

    socket.on("disconnect", (err) => {
      // TODO: logging
      console.log("Input disconnected. Removing handlers", err)
      this.removeInput(socketId)
    })

    // TODO: probably should be started elsewhere.
    this.startListening(socket)
  }

  startListening(socket) {
    socket.on("data", (measurements) => {
      // TODO: logging
      if (!measurements) return

      // TODO: log measurements into file (+ rotate log and remove zero values)

      let deviceData = {}

      measurements.sort((a, b) => a.order - b.order).forEach(measurement => {
        deviceData[measurement["name"]] = measurement["value"]
      })

      this.deviceData[socket.id] = deviceData
    })
  }

  sendOutput(device, data) {
    this.sockets[device].write(data)
  }

  getCurrentMeasurements() {
    return this.deviceData
  }
}

export default WebMeasurementsProvider
