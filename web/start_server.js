/* global console */
/* global setInterval */

const BAUD_RATE = 9600

import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

const arduinoPort = '.usbmodem14201'

const port = new SerialPort(`/dev/tty${arduinoPort}`, {
  baudRate: BAUD_RATE
})

const parser = port.pipe(new Readline({ delimiter: '\n' }))

port.on('error', (err) => {
  console.log('Port failure, removing device.', err)
})

// port failures
port.on('close', (err) => {
  console.log('Port was closed.', err)
})

parser.on('data', data => {
  // const sensorValue = parseInt(data, 10)
  console.log(data)
})

setInterval(() => {
  parser.write(`<10,255,0,0>\n`)
}, 100)



// import HardwareMeasurementsProvider from './lib/classes/HardwareMeasurementsProvider'
// import { server, clientMeasurementsProvider, clientConfiguration } from './webserver'
// import modes from "./lib/visualisations"

// let ledsConfig = {}

// setInterval(() => {
//   let measurements = clientMeasurementsProvider.getDeviceData()

//   if (!measurements) return
//   // TODO: log measurements into file (+ rotate log and remove zero values)

//   let config = clientConfiguration
//   if (!config) {
//     return
//   } // TODO: logging

//   const sticks = config.sticks
//   if (!sticks) {
//     return
//   } // TODO: logging

//   const currentMode = modes[config.mode]
//   if (!currentMode) {
//     return
//   } // TODO: logging

//   const ledsConfig = currentMode(measurements, sticks, config.sensors)

//   // TODO: change real arduino

//   // clientMeasurementsProvider.writeData(ledsConfig.filter(c => c != null))
// }, 1000 / 25)



// let hardwareMeasurementsProvider = new HardwareMeasurementsProvider()
// hardwareMeasurementsProvider.listenForInput(arduinoPort, 0)

// setInterval(() => {
//   let measurements = hardwareMeasurementsProvider.getDeviceData(arduinoPort)

//   if (!measurements) return
//   // TODO: log measurements into file (+ rotate log and remove zero values)

//   let config = clientConfiguration

//   // console.log(config)

//   if (!config) {
//     return

//   } // TODO: logging
//   const sticks = config.sticks
//   if (!sticks) {
//     return

//   } // TODO: logging

//   const currentMode = modes[config.mode || 'basic']
//   if (!currentMode) {
//     return
//   } // TODO: logging

//   ledsConfig = currentMode(measurements, sticks, config.sensors)

//   hardwareMeasurementsProvider.setToWrite(arduinoPort, ledsConfig)
//   // console.log(JSON.stringify(ledsConfig))
// }, 1000 / 5)



// let collector = new MeasurementsCollector()
// collector.registerProvider(hardwareMeasurementsProvider)
// collector.registerProvider(clientMeasurementsProvider)

// server.listen(3000, () => {
//   console.log('I am listenning on 3000')



  // io.on('connection', (socket) => {
  //   parser.on('data', (data) => {
  //     const clientData = clientMeasurementsProvider.getDeviceData()
  //     const realData = data.split('\t')[0] * .1
  //
  //     const shrineInformation = Object.values(clientData)
  //     const shrineInformationEssence = shrineInformation[0]
  //     if (shrineInformationEssence) {
  //       shrineInformationEssence[Object.keys(shrineInformationEssence)[0]] += realData
  //     }
  //
  //     if (shrineInformationEssence) {
  //       console.log(shrineInformationEssence)
  //       // socket.emit('toClient', shrineInformationEssence)
  //       // --- this is overloading server => not working, we need to think about alternative way of sending info to the client
  //     }
  //   })
  // })
// })


// import HardwareMeasurementsProvider from './lib/classes/HardwareMeasurementsProvider'
// import MeasurementsCollector from './lib/classes/MeasurementsCollector'
// import { server, clientMeasurementsProvider } from './webserver'
// // import net from 'net'
// // import Objects from './lib/helpers/Objects'
// import async from 'async'
// import visualisations from './lib/visualisations'
// // Configuration
// // let config = getConfig()

// // TODO: figure out device order

// // Initialize reading data from ports

// // let hardwareMeasurementsProvider = new HardwareMeasurementsProvider()
// // try {
// //   hardwareMeasurementsProvider.listenForInput('.usbmodem14201', 0)
// // } catch (error) {
// //   console.log(error)
// // }
// // hardwareMeasurementsProvider.listenForInput('.usbmodem14102', 1)
// // hardwareMeasurementsProvider.listenForInput('USB0')

// // Register
// let collector = new MeasurementsCollector()
// collector.registerProvider(hardwareMeasurementsProvider)
// collector.registerProvider(clientMeasurementsProvider)

// // Measurements processing loop

// // const pythonServerClient = net.createConnection({ port: 8124 }).on('error', () => {
// //   console.log('disconnected from server')
// // })

// const devices = hardwareMeasurementsProvider.getInputs()

// const isEmpty = (object) => {
//   return Object.keys(object).length === 0 && object.constructor === Object
// }

// const loop = () => {
//   collector.collectMeasurements()
//   let measurements = collector.getMeasurements()

//   // TODO: uncomment to send to python
//   // Sends measurements to python
//   // let data = JSON.stringify({
//   //   'devices': devices,
//   //   'measurements': measurements,
//   // })
//   // pythonServerClient.write(Buffer.from(data))

//   let visualization = visualisations['basic']

//   if (!measurements || isEmpty(measurements)) {
//     return
//   }

//   let leds = visualization(measurements, devices)

//   // collector.sendOutput('.usbmodem14101', 'c')

//   collector.sendOutput('.usbmodem14101', 'l0;0;0;0;1;0;0;0;2;0;0;0;3;0;0;0;4;0;0;0;5;0;0;0;6;0;0;0;7;0;0;0;8;0;0;0;9;0;0;0;10;0;0;0;11;0;0;0;12;0;0;0;13;0;0;0;14;0;0;0;15;0;0;0;16;0;0;0;')
//   collector.sendOutput('.usbmodem14101', 'l17;0;0;0;18;0;0;0;19;136;136;187;20;136;136;187;21;136;136;187;22;0;0;0;23;0;0;0;24;0;0;0;25;0;0;0;26;0;0;0;27;0;0;0;28;0;0;0;29;0;0;0;30;0;0;0;31;0;0;0;32;0;0;0;33;0;0;0;')
//   collector.sendOutput('.usbmodem14101', 'l34;0;0;0;35;0;0;0;36;0;0;0;37;0;0;0;38;0;0;0;39;0;0;0;')

//   // TODO: Uncomment to send real measurements to arduino
//   // Object.keys(leds).forEach(device => {
//   //   leds[device].toArduinoStrings().forEach((line) => {
//   //     setTimeout(()=>{
//   //       collector.sendOutput(device, line)
//   //     }, 10)
//   //   })
//   // })
// }

// server.listen(3000, () => {
//   console.log('I am listenning on 3000')
// })

// async.forever(
//   (next) => {
//     loop()
//     next()
//   },
//   (err) => {
//     console.log('BOOM', err)
//   }
// )
