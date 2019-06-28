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
import { realSticks } from './lib/configuration/realSticksConfig';

const connectedSockets = {}
// const clientConfigurations = earConfig.read()
const clientConfigurations = {}
let ledsConfig = [] // Needs to be initially an empty array to trigger communication with the arduino
let currentModeKey = 'basic'
let currentMode = modes[currentModeKey]
let clientSensors = []
let realSensorsData = []

const modeHandler = (req, res) => {
	currentModeKey = req.body.mode
	currentMode = modes[currentModeKey]
	Object.keys(clientConfigurations).map(socketId => {
		connectedSockets[socketId].emit('modeChanged', req.body["mode"])
	})
	res.send('Done!')
};

const io = spinServer([
	{
		method: 'post',
		path: '/mode',
		callback: modeHandler
	}
])

const realSensors = connectToArduinos()

const calculateDataForRealLeds = (data, realSensor, column) => {
	const sensorData = getInfoFromSensors(data)
	realSensor.update(sensorData)

	realSensorsData = realSensors.map(sensor => ({
		tension: sensor.tension,
		oldTension: sensor.oldTension,
		sensorPosition: sensor.sensorPosition,
		column: sensor.column,
		slowSensorSpeed: sensor.slowSensorSpeed,
		fastSensorSpeed: sensor.fastSensorSpeed,
		key: sensor.key
	}))

	const combinedLedsConfig = currentMode(realSticks, [...clientSensors, ...realSensorsData]).filter(Boolean)
	ledsConfig = regroupConfig(combinedLedsConfig)

	const columnLeds = ledsConfig.find(config => config.key === column).leds
	return putLedsInBufferArray(columnLeds, NUMBER_OF_LEDS)
}

if (realSensors && realSensors.length > 0) {
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
}

setInterval(() => {
	const combinedSensors = [...clientSensors, ...realSensorsData]
	if (combinedSensors.length > 0) writeToPython(combinedSensors, currentModeKey)
}, 100)

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

		clientSensors = sensors
		const ledsConfigFromClient = currentMode(sticks, [...clientSensors, ...realSensorsData]).filter(Boolean)
		ledsConfig = regroupConfig(ledsConfigFromClient)
		socket.emit('ledsChanged', ledsConfig)
	})

	socket.on('configure', configuration => {
		currentModeKey = configuration.mode
		currentMode = modes[currentModeKey]
		clientConfigurations[socket.id] = configuration
		earConfig.save(clientConfigurations)
	})

	socket.on('disconnect', () => {
		delete connectedSockets[socket.id]
		delete clientConfigurations[socket.id]
	})
})

