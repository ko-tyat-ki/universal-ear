/* global console */

import serialport from 'serialport'
import modes from './lib/visualisations'
import {
	putLedsInBufferArray,
	regroupConfig,
	getInfoFromSensors
} from './lib/helpers/dataHelpers'
import { connectToArduinos } from './lib/helpers/connectToArduinos'
import { spinServer } from './lib/helpers/spinServer'
import { NUMBER_OF_LEDS } from './lib/configuration/constants'
import earConfig from './lib/helpers/config'
import { hasArduino, addArduino, arduinosConfig } from './lib/configuration/arduinosConfig.js'

//////////////////// TODO move to some initial config file
const realSticks = [
	{
			name: '1',
			init: {
					x: 597,
					y: -180,
					z: 0
			}
	},
	{
			name: '2',
			init: {
					x: 597 * Math.cos(2 * Math.PI * 1 / 11),
					y: -180,
					z: 597 * Math.sin(2 * Math.PI * 1 / 11)
			}
	},
	{
			name: '3',
			init: {
					x: 597 * Math.cos(2 * Math.PI * 2 / 11),
					y: -180,
					z: 597 * Math.sin(2 * Math.PI * 2 / 11)
			}
	},
	{
			name: '4',
			init: {
					x: 597 * Math.cos(2 * Math.PI * 3 / 11),
					y: -180,
					z: 597 * Math.sin(2 * Math.PI * 3 / 11)
			}
	},
	{
			name: '5',
			init: {
					x: 597 * Math.cos(2 * Math.PI * 4 / 11),
					y: -180,
					z: 597 * Math.sin(2 * Math.PI * 4 / 11)
			}
	},
	{
			name: '6',
			init: {
					x: 597 * Math.cos(2 * Math.PI * 5 / 11),
					y: -180,
					z: 597 * Math.sin(2 * Math.PI * 5 / 11)
			}
	},
	{
			name: '7',
			init: {
					x: 597 * Math.cos(2 * Math.PI * 6 / 11),
					y: -180,
					z: 597 * Math.sin(2 * Math.PI * 6 / 11)
			}
	},
	{
			name: '8',
			init: {
					x: 597 * Math.cos(2 * Math.PI * 7 / 11),
					y: -180,
					z: 597 * Math.sin(2 * Math.PI * 7 / 11)
			}
	},
	{
			name: '9',
			init: {
					x: 597 * Math.cos(2 * Math.PI * 8 / 11),
					y: -180,
					z: 597 * Math.sin(2 * Math.PI * 8 / 11)
			}
	},
	{
			name: '10',
			init: {
					x: 597 * Math.cos(2 * Math.PI * 9 / 11),
					y: -180,
					z: 597 * Math.sin(2 * Math.PI * 9 / 11)
			}
	},
	{
			name: '11',
			init: {
					x: 597 * Math.cos(2 * Math.PI * 10 / 11),
					y: -180,
					z: 597 * Math.sin(2 * Math.PI * 10 / 11)
			}
	}
]
//////////////////// TODO move to some config

const connectedSockets = {}
let ledsConfig = [] // Needs to be initially an empty array to trigger communication with the arduino
let writeLogsForAndrey = false;
let currentMode = modes.basic
let lastLogSent = (new Date()).getTime()
let clientSensors
let realSensorsData


const clientConfigurations = earConfig.read()
let assignConfiguration = function (configuration, socketId) {
	if (!clientConfigurations[socketId]) {
		clientConfigurations[socketId] = configuration
	} else {
		clientConfigurations[socketId] = Object.assign({}, clientConfigurations[socketId], configuration)
	}
};

let realSensors = connectToArduinos()

const io = spinServer([
	{
		method: 'post',
		path: '/mode',
		callback: (req, res) => {
		  currentMode = modes[req.body.mode]
			Object.keys(clientConfigurations).map(socketId => {
				assignConfiguration(req.body, socketId)
			})
			res.send('Done!')
		}
	},
	{
		method: 'post',
		path: '/stick',
		callback: (req, res) => {
			if (!req.body.name || !req.body.column) {
				res.send(JSON.stringify(arduinosConfig, null, 2))
				return
      }

			let obj = {
				name: req.body.name,
				column: req.body.column,
				baudRate: 115200,
				numberOfLEDs: 40,
				sensors: [
					{
						name: 'some',
						position: 10
					}
				],
				baseTension: 0
			}
			// TODO: remove arduino
			addArduino(obj)
			realSensors = connectToArduinos(realSensors)
			initSensors()
			res.send(JSON.stringify(arduinosConfig, null, 2))
		}
	},
	{
		method: 'post',
		path: '/ports',
		callback: (req, res) => {
			let ports = []
			serialport.list((_, devices) => {
				for (let i = 0; i < devices.length; i++) {
					let device = devices[i]

					if (!device.locationId || !device.vendorId || !device.productId) continue

					let arduino = arduinosConfig.find((arduino) => arduino.name === device.comName)

					ports.push({
						"comName": device.comName,
						"column": arduino && arduino.column,
						"isConfigured": !!arduino
					})
				}
				res.send(JSON.stringify(ports, null, 2))
			})
		}
	},
	{
		method: 'post',
		path: '/logs',
		callback: (req, res) => {
		  writeLogsForAndrey = !writeLogsForAndrey
			res.send('Current log status: ' + writeLogsForAndrey)
		}
	},
	{
		method: 'post',
		path: '/connect',
		callback: (req, res) => {
			realSensors = connectToArduinos(arduinosConfig)
			initSensors()
			res.send('Connected!')
		}
	}
])



const calculateDataForRealLeds = (data, realSensor, column) => { // TO BE CHANGED WHEN HAVE ACCESS TO HARDWARE
	const sensorData = getInfoFromSensors(data)
	realSensor.update(sensorData)

	realSensorsData = realSensors.map(sensor => ({
		tension: sensor.tension,
		oldTension: sensor.oldTension,
		sensorPosition: sensor.sensorPosition,
		column: sensor.column,
	}))

	const sensorToPass = clientSensors && clientSensors.length > 0 ? [...clientSensors, ...realSensors] : realSensors

	// for (let sensor in sensorToPass) {
	// 	console.log(sensor)
	// }

	const ledsConfigFromClient = currentMode(realSticks, sensorToPass).filter(Boolean)

	ledsConfig = regroupConfig(ledsConfigFromClient)

  let forAndrey = {
	  ts: 0 + new Date(),
	  sensors: sensorToPass,
    currentMode: currentMode,
  }

  let now = (new Date()).getTime();
  let logDelay = now - lastLogSent;
  if (writeLogsForAndrey && logDelay > 500) {
    // TODO: optimize speed
  	console.log(JSON.stringify(forAndrey))
    lastLogSent = now
  }

	const columnLeds = ledsConfig.find(config => config.key === column)

	if (!columnLeds) return

	return putLedsInBufferArray(columnLeds.leds, NUMBER_OF_LEDS)

	// return putLedsInBufferArray(ledsConfig[column - 1].leds, NUMBER_OF_LEDS)
}

let initSensors = function () {
	if (realSensors && realSensors.length > 0) {
    realSensors.map(realSensor => {
      const port = realSensor.port
      const parser = realSensor.parser
      let areWeWriting = true

      parser.on('data', data => {
        if (areWeWriting && ledsConfig) {
          port.write(calculateDataForRealLeds(data, realSensor, realSensor.column))
          areWeWriting = false
        } else {
          if (data === 'eat me\r') {
            areWeWriting = true
          }
        }
      })
    })
  }
};

io.on('connection', socket => {
	connectedSockets[socket.id] = socket

	socket.on('updatedSensors', sensors => {
		if (!sensors) return

		let config = clientConfigurations[socket.id]
		if (!config) {
			return
		}

		const sticks = config.sticks
		if (!sticks) {
			return
		}

		currentMode = modes[config.mode] || modes.basic
		if (!currentMode) {
			return
		}

		clientSensors = sensors
		const sensorsToPass = realSensorsData && realSensorsData.length > 0 ? [...clientSensors, ...realSensorsData] : clientSensors
		const ledsConfigFromClient = currentMode(sticks, sensorsToPass).filter(Boolean)
		ledsConfig = regroupConfig(ledsConfigFromClient)
		socket.emit('ledsChanged', ledsConfig)

		// writeToPython(sensorsToPass, currentMode)
		// ledsConfigFromClient.map(ledConfig => socket.emit('ledsChanged', ledConfig)) // keep for now for development processes
	})

	socket.on('configure', configuration => {
		assignConfiguration(configuration, socket.id);

		earConfig.save(clientConfigurations)
	})

	socket.on('disconnect', () => {
		delete connectedSockets[socket.id]
		delete clientConfigurations[socket.id]
	})
})
