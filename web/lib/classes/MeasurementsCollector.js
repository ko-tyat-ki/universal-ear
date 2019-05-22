// /* global console */

// class MeasurementsCollector {
//   constructor() {
//     // Current state of measurements
//     this.measurements = {}
//     this.providers = []
//   }

//   getMeasurements() {
//     return this.measurements
//   }

//   registerProvider(provider) {
//     this.providers.push(provider)
//   }

//   getInputs() {
//     let devices = []

//     this.providers.forEach(provider => {
//       devices.push(...provider.getInputs())
//     })

//     return devices
//   }

//   sendOutput(device, output) {
//     // console.log(device, output)
//     this.providers.filter(provider => {
//       let inputs = provider.getInputs()
//       return inputs.includes(device)
//     }).map(provider => {
//       provider.sendOutput(device, output)
//     })
//   }

//   collectMeasurements() {
//     let newMeasurements = {}

//     this.providers.forEach(provider => {
//       let devices = provider.getCurrentMeasurements()
//       newMeasurements = Object.assign(newMeasurements, devices)
//     })

//     this.measurements = newMeasurements
//   }

// }

// export default MeasurementsCollector
