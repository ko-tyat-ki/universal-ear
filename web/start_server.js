/* global console */
/* global setInterval */
/* global Buffer */

import HardwareMeasurementsProvider from "./lib/classes/HardwareMeasurementsProvider"
import MeasurementsCollector from "./lib/classes/MeasurementsCollector"
import getConfig from "./config"
import {server, clientMeasurementsProvider} from "./webserver"
import net from "net"
import Objects from "./lib/helpers/Objects"
import async from "async"
// Configuration
let config = getConfig()

// TODO: figure out device order

// Initialize reading data from ports
let hardwareMeasurementsProvider = new HardwareMeasurementsProvider()
hardwareMeasurementsProvider.listenForInput(".usbmodem14101", 0)
// hardwareMeasurementsProvider.listenForInput(".usbmodem14102", 1)
// hardwareMeasurementsProvider.listenForInput("USB0")

// Register
let collector = new MeasurementsCollector()
collector.registerProvider(hardwareMeasurementsProvider)
collector.registerProvider(clientMeasurementsProvider)

// Measurements processing loop

const pythonServerClient = net.createConnection({port: 8124}).on('error', () => {
  console.log('disconnected from server')
})

const devices = hardwareMeasurementsProvider.getInputs()


const loop = () => {
  collector.collectMeasurements()
  let measurements = collector.getMeasurements()

  // TODO: uncomment to send to python
  // Sends measurements to python
  // let data = JSON.stringify({
  //   "devices": devices,
  //   "measurements": measurements,
  // })
  // pythonServerClient.write(Buffer.from(data))

  let visualization = config.getVisualizationHandler()

  if (!measurements || Objects.isEmpty(measurements)) {
    return
  }

  let leds = visualization(measurements, devices)

  // collector.sendOutput(".usbmodem14101", "c")

  collector.sendOutput(".usbmodem14101", "l0;0;0;0;1;0;0;0;2;0;0;0;3;0;0;0;4;0;0;0;5;0;0;0;6;0;0;0;7;0;0;0;8;0;0;0;9;0;0;0;10;0;0;0;11;0;0;0;12;0;0;0;13;0;0;0;14;0;0;0;15;0;0;0;16;0;0;0;")
  collector.sendOutput(".usbmodem14101", "l17;0;0;0;18;0;0;0;19;136;136;187;20;136;136;187;21;136;136;187;22;0;0;0;23;0;0;0;24;0;0;0;25;0;0;0;26;0;0;0;27;0;0;0;28;0;0;0;29;0;0;0;30;0;0;0;31;0;0;0;32;0;0;0;33;0;0;0;")
  collector.sendOutput(".usbmodem14101", "l34;0;0;0;35;0;0;0;36;0;0;0;37;0;0;0;38;0;0;0;39;0;0;0;")

  // TODO: Uncomment to send real measurements to arduino
  // Object.keys(leds).forEach(device => {
  //   leds[device].toArduinoStrings().forEach((line) => {
  //     setTimeout(()=>{
  //       collector.sendOutput(device, line)
  //     }, 10)
  //   })
  // })
}

server.listen(3000, () => {
  console.log('I am listenning on 3000')
})

async.forever(
  (next) => {
    loop()
    next()
  },
  (err) => {
    console.log("BOOM", err)
  }
)
