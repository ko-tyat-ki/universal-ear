/* global console */

import modes from './lib/visualisations'
import {
	putLedsInBufferArray,
	regroupConfig
} from './lib/helpers/dataHelpers'
import { connectToArduinos } from './lib/helpers/connectToArduinos.js'
import { spinServer } from './lib/helpers/spinServer.js'
import { NUMBER_OF_LEDS } from './lib/configuration/constants.js'

const connectedSockets = {}
const clientConfigurations = {}
let ledsConfig
let currentMode = modes.basic
let areWeWriting = true

const io = spinServer()
const realSensors = connectToArduinos()

const calculateDataForRealLeds = (data, sensor) => { // TO BE CHANGED WHEN HAVE ACCESS TO HARDWARE
	const sensorData = data.split('\t')[0].split('! ')[1]
	sensor.update(sensorData - 80) // HOW CAN WE BETTER DEAL WITH THIS

	let config = clientConfigurations[socket.id]
	if (!config) {
		return
	}

	const sticks = config.sticks
	if (!sticks) {
		return
	}
	const realSensors = [{
		key: 'real',
		column: '1',
		sensorPosition: 20
	}]
	const ledsConfigFromClient = currentMode(sticks, realSensors).filter(Boolean)
	console.log('LEDS', ledsConfigFromClient[0][0].leds)
	ledsConfig = regroupConfig(ledsConfigFromClient)

	return putLedsInBufferArray(ledsConfig[0].leds, NUMBER_OF_LEDS)
}

if (realSensors && realSensors.length > 0) {
	realSensors.map(sensor => {
		const port = sensor.port
		const parser = sensor.parser

		parser.on('data', data => {
			if (areWeWriting && ledsConfig) {
				console.log('DATA IN', data)


				port.write(calculateDataForRealLeds(data, sensor))
				areWeWriting = false
			} else {
				console.log('Data IN, listen', data)
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

		currentMode = modes[config.mode]
		if (!currentMode) {
			return
		}

		const ledsConfigFromClient = currentMode(sticks, sensors).filter(Boolean)
		ledsConfig = regroupConfig(ledsConfigFromClient)
		socket.emit('ledsChanged', ledsConfig)
		// ledsConfigFromClient.map(ledConfig => socket.emit('ledsChanged', ledConfig)) // keep for now for development processes
	})

	socket.on('configure', configuration => {
		clientConfigurations[socket.id] = configuration
	})

	socket.on('disconnect', () => {
		delete connectedSockets[socket.id]
		delete clientConfigurations[socket.id]
	})
})
