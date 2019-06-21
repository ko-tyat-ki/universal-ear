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
		method: 'get',
		path: '/logs',
		callback: (req, res) => {
		  writeLogsForAndrey = !writeLogsForAndrey
			res.send('Current log status: ' + writeLogsForAndrey)
		}
	}
])

const realSensors = connectToArduinos()

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

	const columnLeds = ledsConfig.find(config => config.key === column).leds
	return putLedsInBufferArray(columnLeds, NUMBER_OF_LEDS)

	// return putLedsInBufferArray(ledsConfig[column - 1].leds, NUMBER_OF_LEDS)
}

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
