/* global console */

import prodModes from './lib/visualisations'
import {
	putLedsInBufferArray,
	regroupConfig,
	getInfoFromSensors
} from './lib/helpers/dataHelpers'
import { connectToArduinos } from './lib/helpers/connectToArduinos'
import { spinServer } from './lib/helpers/spinServer'
import { NUMBER_OF_LEDS } from './lib/configuration/constants'
import { writeToPython } from './lib/helpers/communicateWithPython'
import { realSticks } from './lib/configuration/realSticksConfig'
import { easterEgg, isEasterTriggered, easterEggDuration } from './lib/modes/easterEgg'
import { onChangeSpeed, onChange } from './lib/modes/onChange'
import sleep from './lib/modes/sleep'
import {
	wasStretchedHardEnoughToWakeUp
} from './lib/helpers/sleepTracker'

import { serverConfig } from '../modes_config.json'
console.log(serverConfig)

// Get from config
let {
	modeAutoChangeInterval, // 1000 seconds
	goToSleepAfter // 20 minutes
} = serverConfig

let { useOnChange, useEasterEgg, useSleepMode, isAutoChangingModeEnabled } = serverConfig

const modes = Object.assign({}, prodModes)
modes.sleep = sleep
modes.easterEgg = easterEgg
modes.onChange = onChange

let currentMode
let previousModeKey
let currentModeKey
const prodModesKeys = Object.keys(prodModes)
const modesKeys = Object.keys(modes)
let clientSensors = []
let realSensorsData = []
const connectedSockets = {}
const clientConfigurations = {}
let ledsConfig = [] // Needs to be initially an empty array to trigger communication with the arduino

const selectRandomModeKey = (modesKeys) => modesKeys[Math.floor(Math.random() * (modesKeys.length - 1))]
const selectAnotherRandomModeKey = (modesKeys) => modesKeys.filter(modeKey => modeKey !== currentModeKey)[Math.floor(Math.random() * (modesKeys.length - 1))]

//  Assign base data
let isSleeping = false
let noActionsSince = Date.now()
let lastTimeChangedMode = Date.now()
let onChangeStarted
let easterEggTriggeredAt
let isEaster = false
let isOnChange = false

const onChangeDuration = onChangeSpeed * 14 // This magic number comed from the nature of onChange

const changeMode = (modeKey) => {
	noActionsSince = Date.now()
	lastTimeChangedMode = Date.now()
	console.log(`Mode was changed ${currentModeKey ? `from ${currentModeKey} ` : ''}to ${modeKey}`)
	if (modesKeys.includes(currentModeKey)) currentMode = modes[modeKey]
	else {
		throw new Error(`We can't change mode to ${modeKey}`)
	}
	previousModeKey = currentModeKey
	currentModeKey = modeKey

	Object.keys(connectedSockets).map(socketId => {
		if (prodModesKeys.includes(modeKey)) connectedSockets[socketId].emit('modeChanged', modeKey)
	})
}

// Initialise modes
(() => {
	currentModeKey = selectRandomModeKey(prodModesKeys)
	currentMode = modes[currentModeKey]
	changeMode(currentModeKey)
})()

// Select visualisation modes
setInterval(() => {
	const combinedSensors = [...clientSensors, ...realSensorsData]
	if (useEasterEgg) {
		if (!isEaster && isEasterTriggered(combinedSensors)) {
			changeMode('easterEgg')
			easterEggTriggeredAt = Date.now()
			isEaster = true
			return
		}

		if (isEaster && Date.now() - easterEggTriggeredAt > easterEggDuration) {
			changeMode(previousModeKey)
			isEaster = false
			return
		}
	}

	if (!isOnChange && !isSleeping && isAutoChangingModeEnabled && Date.now() - lastTimeChangedMode > modeAutoChangeInterval) {
		if (useOnChange) {
			console.log('... starting onChange ...')
			onChangeStarted = Date.now()
			currentModeKey = selectAnotherRandomModeKey(prodModesKeys)
			currentMode = onChange
			isOnChange = true
		} else changeMode(nextRandomKey)
		return
	}

	if (isOnChange && !isSleeping && Date.now() - onChangeStarted > onChangeDuration) {
		isOnChange = false
		console.log('... finished onChange ...')
		changeMode(currentModeKey)
		return
	}

	if (useSleepMode) {
		if (wasStretchedHardEnoughToWakeUp(combinedSensors)) {
			if (isSleeping) {
				changeMode(previousModeKey)
				console.log('good morning!')
			}
			noActionsSince = Date.now()
			isSleeping = false
			return
		}

		if (Date.now() - noActionsSince > goToSleepAfter) {
			if (!isSleeping) {
				changeMode('sleep')
				isSleeping = true
			}
			// console.log(`zzzzzzzzzz already for ${Math.floor((Date.now() - noActionsSince) / (1000))} seconds`)
			return
		}
	}
}, 500)

// Talk to arduinos
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

	const combinedLedsConfig = currentMode(realSticks, [...clientSensors, ...realSensorsData])

	ledsConfig = regroupConfig(combinedLedsConfig.filter(Boolean))

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

// Talk to python
setInterval(() => {
	const combinedSensors = [...clientSensors, ...realSensorsData]
	if (combinedSensors.length > 0) writeToPython(combinedSensors, currentModeKey)
}, 100)

// Special requests handlers
// Are here to talk to global variables as it is a bit cheaper
const modeHandler = (req, res) => {
	try {
		const modeName = req.query.name
		if (!modesKeys.includes(modeName)) throw new Error('This mode name does not exist')
		changeMode(modeName)
		if (modeName === 'easterEgg' && useEasterEgg) {
			easterEggTriggeredAt = Date.now()
			isEaster = true
		} else if (modeName === 'sleep' && useSleepMode) {
			isSleeping = true
		} else if (modeName === 'onChange' && useOnChange) {
			isOnChange = true
		}
		res.send('Done!')
	} catch (error) {
		res.send(`Sorry the mode couldn't change, reason: ${error}`)
	}
};

const switchAutomaticModeHandler = (req, res) => {
	isAutoChangingModeEnabled = !isAutoChangingModeEnabled
	const timeout = req.query.timeout
	if (timeout) {
		modeAutoChangeInterval = timeout
	}
	res.send('Done! Autoswitching enabled ' + isAutoChangingModeEnabled + '. Change once in ' + modeAutoChangeInterval / 1000 / 60 + ' minutes')
}

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

const changeConfig = (req, res) => {
	if (req.query.useOnChange === 'no') useOnChange = false
	if (req.query.useOnChange === 'yes') useOnChange = true

	if (req.query.useEasterEgg === 'no') useEasterEgg = false
	if (req.query.useEasterEgg === 'yes') useEasterEgg = true

	if (req.query.useSleepMode === 'no') useSleepMode = false
	if (req.query.useSleepMode === 'yes') useSleepMode = true

	res.send('Hooray! Done!')
}

// Talk to client
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
	},
	{
		method: 'get',
		path: '/modesNames',
		callback: (req, res) => (res.json(modesKeys))
	},
	{
		method: 'get',
		path: '/changeConfig',
		callback: changeConfig
	}
])

io.on('connection', socket => {
	connectedSockets[socket.id] = socket

	socket.emit('modeChanged', currentModeKey)

	socket.on('updatedSensors', sensors => {
		if (!sensors) return

		clientSensors = sensors
		const combinedLedsConfig = currentMode(realSticks, [...clientSensors, ...realSensorsData])

		ledsConfig = regroupConfig(combinedLedsConfig.filter(Boolean))
		socket.emit('ledsChanged', ledsConfig)
	})

	socket.on('clientChangedMode', newConfig => {
		const newMode = newConfig.mode
		changeMode(newMode)
		isSleeping = false
	})

	socket.on('disconnect', () => {
		delete connectedSockets[socket.id]
		delete clientConfigurations[socket.id]
	})
})

