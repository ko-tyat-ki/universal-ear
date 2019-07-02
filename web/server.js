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
import arrays from './lib/helpers/arrays'
import { writeToPython } from './lib/helpers/communicateWithPython';
import { realSticks } from './lib/configuration/realSticksConfig';

const connectedSockets = {}
// const clientConfigurations = earConfig.read()
const clientConfigurations = {}
let ledsConfig = [] // Needs to be initially an empty array to trigger communication with the arduino
let isAutoChangingModeEnabled = false
let modeAutoChangeTimeout = 3 * 60 * 1000 // 3 minutes
let modeStack = []

let currentModeKey = 'jasmine'
let currentMode = modes[currentModeKey]
let clientSensors = []
let realSensorsData = []

const modeHandler = (req, res) => {
	currentModeKey = req.query.name
	currentMode = modes[currentModeKey]
	Object.keys(clientConfigurations).map(socketId => {
		connectedSockets[socketId].emit('modeChanged', currentModeKey)
	})
	res.send('Done!')
};

const arduinosStatusHandler = (req, res) => {
	const activeArduinos = realSensors.filter(sensor => sensor.active).map(sensor => ({
		name: sensor.key,
		stick: sensor.stick
	}))
	const arduinosThatDidNotOpen = realSensors.filter(sensor => !sensor.active).map(sensor => ({
		name: sensor.key,
		stick: sensor.stick
	}))
	res.json({
		activeArduinos,
		arduinosThatDidNotOpen
	})
};

const changeModeLoop = () => {
	if (!isAutoChangingModeEnabled) {
		// NOTE: if it's disabled we want to check more often to be able react on turning on within 2 seconds
		setTimeout(changeModeLoop, 2000)
		return
	}

	// NOTE: guarantees that each mode will be called equal times and
	// equally distributed in time
	if (modeStack.length === 0) {
		modeStack = arrays.shuffle(Object.keys(modes))
	}

	changeMode(modeStack.pop())
	setTimeout(changeModeLoop, modeAutoChangeTimeout)
};
changeModeLoop()

const changeMode = (modeKey) => {
	currentMode = modes[modeKey]
	Object.keys(clientConfigurations).map(socketId => {
		connectedSockets[socketId].emit('modeChanged', modeKey)
	})
}

const switchAutomaticModeHandler = (req, res) => {
	isAutoChangingModeEnabled = !isAutoChangingModeEnabled
	const timeout = req.query.timeout
	if (timeout) {
		modeAutoChangeTimeout = timeout
	}
	res.send('Done! Autoswitching enabled ' + isAutoChangingModeEnabled + '. Change once in ' + modeAutoChangeTimeout / 1000 / 60 + ' minutes')
}

const io = spinServer([
	{
		method: 'get',
		path: '/mode',
		callback: modeHandler
	},
	{
		method: 'get',
		path: '/mode/automatic',
		callback: switchAutomaticModeHandler
	},
	{
		method: 'get',
		path: '/arduinosStatus',
		callback: arduinosStatusHandler
	}
])

const realSensors = connectToArduinos()

const calculateDataForRealLeds = (sensorData, realSensor, stick) => {
	realSensor.update(sensorData)

	realSensorsData = realSensors.map(sensor => ({
		tension: sensor.tension,
		oldTension: sensor.oldTension,
		sensorPosition: sensor.sensorPosition,
		stick: sensor.stick,
		slowSensorValue: sensor.slowSensorValue,
		fastSensorValue: sensor.fastSensorValue,
		key: sensor.key
	}))

	const combinedLedsConfig = currentMode(realSticks, [...clientSensors, ...realSensorsData]).filter(Boolean)
	ledsConfig = regroupConfig(combinedLedsConfig)

	const stickLeds = ledsConfig.find(config => config.key === stick).leds
	return putLedsInBufferArray(stickLeds, NUMBER_OF_LEDS)
}

if (realSensors && realSensors.length > 0) {
	realSensors.map(realSensor => {
		const port = realSensor.port
		const parser = realSensor.parser
		let areWeWriting = true

		parser.on('data', data => {
			if (areWeWriting && ledsConfig && ledsConfig.length > 0) {
				// console.log({ data, key: realSensor.key })
				port.write(calculateDataForRealLeds(getInfoFromSensors(data), realSensor, realSensor.stick))
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

