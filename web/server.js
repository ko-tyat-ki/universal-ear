/* global console */

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
import { writeToPython } from './lib/helpers/communicateWithPython';

//////////////////// TODO move to some initial config file
const realSticks = [
	{
		numberOfLEDs: 40,
		name: '1',
		init: {
			x: 122,
			y: -180,
			z: 0
		}
	},
	{
		numberOfLEDs: 40,
		name: '2',
		init: {
			x: -122,
			y: -180,
			z: 0
		}
	},
	{
		numberOfLEDs: 40,
		name: '3',
		init: {
			x: 0,
			y: 0,
			z: 0
		}
	},
  {
		numberOfLEDs: 40,
		name: '4',
		init: {
			x: 122,
			y: -180,
			z: 0
		}
	},
	{
		numberOfLEDs: 40,
		name: '5',
		init: {
			x: -122,
			y: -180,
			z: 0
		}
	},
	{
		numberOfLEDs: 40,
		name: '6',
		init: {
			x: 0,
			y: 0,
			z: 0
		}
	},
  {
		numberOfLEDs: 40,
		name: '7',
		init: {
			x: 122,
			y: -180,
			z: 0
		}
	},
	{
		numberOfLEDs: 40,
		name: '8',
		init: {
			x: -122,
			y: -180,
			z: 0
		}
	},
	{
		numberOfLEDs: 40,
		name: '9',
		init: {
			x: 0,
			y: 0,
			z: 0
		}
	},
  {
		numberOfLEDs: 40,
		name: '10',
		init: {
			x: 122,
			y: -180,
			z: 0
		}
	},
	{
		numberOfLEDs: 40,
		name: '11',
		init: {
			x: -122,
			y: -180,
			z: 0
		}
	},
	{
		numberOfLEDs: 40,
		name: '12',
		init: {
			x: 0,
			y: 0,
			z: 0
		}
	},
]
//////////////////// TODO move to some config

const connectedSockets = {}
// const clientConfigurations = earConfig.read()
const clientConfigurations = {}
let ledsConfig = [] // Needs to be initially an empty array to trigger communication with the arduino
let currentMode = modes.basic
let clientSensors
let realSensorsData

const io = spinServer()
const realSensors = connectToArduinos()

const calculateDataForRealLeds = (data, realSensor, column) => { // TO BE CHANGED WHEN HAVE ACCESS TO HARDWARE
	const sensorData = getInfoFromSensors(data)
	realSensor.update(sensorData)
	//if (sensorData) console.log("SENSOR ", sensorData)

	realSensorsData = realSensors.map(sensor => ({
		tension: sensor.tension,
		oldTension: sensor.oldTension,
		sensorPosition: sensor.sensorPosition,
		column: sensor.column,
	}))

	const sensorToPass = clientSensors && clientSensors.length > 0 ? [...clientSensors, ...realSensors] : realSensors
	const ledsConfigFromClient = currentMode(realSticks, sensorToPass).filter(Boolean)
	ledsConfig = regroupConfig(ledsConfigFromClient)

	// writeToPython(sensorToPass, currentMode)

	const columnLeds = ledsConfig.find(config => config.key === column).leds
	return putLedsInBufferArray(columnLeds, NUMBER_OF_LEDS)

	// return putLedsInBufferArray(ledsConfig[column - 1].leds, NUMBER_OF_LEDS)
}

setTimeout(() => {
	if (realSensors && realSensors.length > 0) {
	// console.log(realSensors)

	realSensors.map(realSensor => {
		const port = realSensor.port
		const parser = realSensor.parser
		let areWeWriting = true

		parser.on('data', data => {
			if (areWeWriting && ledsConfig) {
				// console.log({ data, key: realSensor.key })
				port.write(calculateDataForRealLeds(data, realSensor, realSensor.column))
				areWeWriting = false
			} else {
				//console.log('Data IN, listen', data)
				if (data === 'eat me\r') {
					areWeWriting = true
				}
			}
		})
	})
}}, 3000)


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
		clientConfigurations[socket.id] = configuration
		earConfig.save()
	})

	socket.on('disconnect', () => {
		delete connectedSockets[socket.id]
		delete clientConfigurations[socket.id]
	})
})
