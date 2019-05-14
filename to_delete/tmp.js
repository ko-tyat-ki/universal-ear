import visualisations from "../web/lib/visualisations"
import DeviceReader from "../web/lib/classes/HardwareMeasurementsProvider"

class MeasurementProcessor {

  constructor() {
    this.handlers = {}
  }

  registerHandler(name, handler) {
    this.handlers[name] = handler
  }

  processMeasurements(collector, config) {
    let measurements = collector.getMeasurements()

    const currentMode = visualisations[config.visualisation]
    if (!currentMode) {
      return
    } // TODO: logging

    const columns = config.columns
    if (!columns) {
      return
    } // TODO: logging

    const ledsConfig = currentMode(measurements, config.columns, config.arduinos)

    Object.entries(this.handlers).map((name, handler) => {
      handler(ledsConfig)
    })
  }

}

// const ledsConfig = currentMode(measurements, columns, config.arduinos)
// TODO: change real arduino
// socket.emit("ledsChanged", ledsConfig)


let collector = new MeasurementsCollector()
let processor = new MeasurementProcessor()
let deviceReader = new DeviceReader()


// Loop that reads measurements, stores them in collector
// sends them to python and processor
(async () => {
  let stop = false
  let currentTime = Date.now()

  while (!stop) {

    let deviceMeasurements = deviceReader.readMeasurements()
    collector.collectMeasurements(deviceMeasurements)

  //   const delta = Date.now() - currentTime
  //
  //   if (!arduinos) continue
  //
  //   arduinos.forEach((arduino) => {
  //     arduino.update(delta)
  //   })
  //
  //   const measurements = arduinos.map(a => {
  //     return {
  //       name: a.key,
  //       tension: a.tension
  //     }
  //   })
  //
  //   socket.emit('measurements', measurements)
  //   currentTime = Date.now()
  //   await sleep(10)
  }
})()


