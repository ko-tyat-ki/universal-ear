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
		name: '1'
	},
	{
		numberOfLEDs: 40,
		name: '2'
	},
]
//////////////////// TODO move to some config

const connectedSockets = {}
// const clientConfigurations = earConfig.read()
const clientConfigurations = {}
let ledsConfig = [] // Needs to be initially an empty array to trigger communication with the arduino
let currentMode = modes.basic
let areWeWriting = true
let clientSensors
let realSensorsData

const io = spinServer()
const realSensors = connectToArduinos()

const calculateDataForRealLeds = (data, realSensor) => { // TO BE CHANGED WHEN HAVE ACCESS TO HARDWARE
	const sensorData = getInfoFromSensors(data)
	realSensor.update(sensorData)
	if (sensorData) console.log("SENSOR ", sensorData)
	
	realSensorsData = realSensors.map(sensor => ({
		tension: sensor.tension,
		oldTension: sensor.oldTension,
		sensorPosition: sensor.sensorPosition,
		column: sensor.column,
	}))

	const sensorToPass = clientSensors && clientSensors.length > 0 ? [...clientSensors, ...realSensors] : realSensors
	const ledsConfigFromClient = currentMode(realSticks, sensorToPass).filter(Boolean)
	ledsConfig = regroupConfig(ledsConfigFromClient)

	writeToPython(combinedSensors, currentMode)
	return putLedsInBufferArray(ledsConfig[0].leds, NUMBER_OF_LEDS)
}

if (realSensors && realSensors.length > 0) {
	realSensors.map(realSensor => {
		const port = realSensor.port
		const parser = realSensor.parser

		parser.on('data', data => {
			if (areWeWriting && ledsConfig) {
				// console.log('DATA IN', data)
				port.write(calculateDataForRealLeds(data, realSensor))
				areWeWriting = false
			} else {
				//console.log('Data IN, listen', data)
				if (data === 'eat me\r') {
					areWeWriting = true
				}
			}
		})
	})
}

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

		currentMode = modes[config.mode || 'basic']
		if (!currentMode) {
			return
		}

		clientSensors = sensors
		const sensorsToPass = realSensorsData && realSensorsData.length > 0 ? [...clientSensors, ...realSensorsData] : clientSensors
		const ledsConfigFromClient = currentMode(sticks, sensorsToPass).filter(Boolean)
		ledsConfig = regroupConfig(ledsConfigFromClient)
		socket.emit('ledsChanged', ledsConfig)

		writeToPython(sensorsToPass, currentMode)
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
