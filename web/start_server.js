/* global console */
/* global setInterval */
/* global Buffer */

import HardwareMeasurementsProvider from "./lib/classes/HardwareMeasurementsProvider"
import MeasurementsCollector from "./lib/classes/MeasurementsCollector"
import getConfig from "./config"
import { server, clientMeasurementsProvider } from "./webserver"
import net from "net"

// Configuration
let config = getConfig()

// TODO: figure out device order

// Initialize reading data from ports
let hardwareMeasurementsProvider = new HardwareMeasurementsProvider()
hardwareMeasurementsProvider.listenForInput(".usbmodem14201")
// hardwareMeasurementsProvider.listenForInput("USB0")

// Register
let collector = new MeasurementsCollector()
collector.registerProvider(hardwareMeasurementsProvider)
collector.registerProvider(clientMeasurementsProvider)

// Measurements processing loop

const pythonServerClient = net.createConnection({ port: 8124 }).on('error', () => {
  console.log('disconnected from server')
})

setInterval(() => {
  collector.collectMeasurements()
  let measurements = collector.getMeasurements()
  let inputs = collector.getInputs()

  console.log("inputs", inputs)
  console.log("measurements", measurements)

  let data = JSON.stringify({
    "inputs": inputs,
    "measurements": measurements,
  })

  pythonServerClient.write(Buffer.from(data))

  // TODO: Send measurements to python

  let visualization = config.getVisualizationHandler()

  // console.log(measurements, inputs)

  // let leds = visualization(measurements, inputs)
  // console.log(measurements)
  // console.log(devices)

  // let ledOutput = visualization(measurements, devices)
  // Led output is matrix where columns represent device and rows represent led colors attached to a device


  // Send led output to client and device sockets

}, 40)

// Starting web server
server.listen(3000, () => {
  console.log('I am listenning on 3000')
})


