/* global console */

class MeasurementsCollector {
  constructor() {
    // Current state of measurements
    this.measurements = {}
    this.providers = []
  }

  getMeasurements() {
    return this.measurements
  }

  registerProvider(provider) {
    this.providers.push(provider)
  }

  getInputs() {
    let devices = []

    this.providers.forEach(provider => {
      devices.push(...provider.getInputs())
    })

    return devices
  }

  collectMeasurements() {
    let newMeasurements = {}

    this.providers.forEach(provider => {
      let devices = provider.getCurrentMeasurements()

      Object.entries(devices).forEach((deviceMeasurements) => {
        let measurements = deviceMeasurements[1]
        newMeasurements = Object.assign(newMeasurements, measurements)
      })
    })
    this.measurements = Object.assign({}, this.measurements, newMeasurements)
  }

}

export default MeasurementsCollector
