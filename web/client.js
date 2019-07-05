/* global document */
/* global setInterval */
/* global io */

import { drawEar } from './lib/helpers/drawEar.js'
import { init, animate } from './lib/helpers/setUpClientWorld.js'
import { calculateFakeSensors } from './lib/configuration/fakeSensorsConfig.js'
import { calculateClientSticks } from './lib/configuration/clientSticksConfig.js'
import { calculateClientPoles } from './lib/configuration/clientPolesConfig.js'

let socket = io()
let scene

const buildEar = (structure, mode) => {
	const selectedStructure = structure.options[structure.options.selectedIndex].value
	// const selectedMode = mode.options[mode.options.selectedIndex].value

	const configuration = {
		fakeSensors: calculateFakeSensors(selectedStructure),
		sticks: calculateClientSticks(selectedStructure),
		poles: calculateClientPoles(selectedStructure)
	}

	return drawEar(configuration, scene)
}

let sensors
let sticks

const onConfigure = () => {
	init()
	scene = animate()
	const structure = document.getElementById('select-structure')
	const mode = document.getElementById('select-mode')

	const update = buildEar(structure, mode)
	sticks = update.sticks
	sensors = update.sensors

	socket.on('ledsChanged', changes => {
		if (!sticks) return

		changes.map(change => {
			if (change) {
				const stick = sticks.find(stick => stick.name === change.key)
				if (!stick) return
				stick.colorLeds(change.leds)
			}
		})
	})

	socket.on('modeChanged', newMode => {
		mode.value = newMode
	})
}

(() => {
	onConfigure()

	const getKeyboardEventEmitter = (keyCode) => {
		return () => {
			document.dispatchEvent(new KeyboardEvent('keydown', { 'key': keyCode }));
			setTimeout(() => {
				document.dispatchEvent(new KeyboardEvent('keyup', { 'key': keyCode }));
			}, 100)
		}
	}

	let buttons = {
		"button1": "1",
		"button2": "2",
		"button3": "3",
		"button4": "4",
		"button5": "5",
		"button6": "6",
		"button7": "7",
		"button8": "8",
		"button9": "9",
		"button10": "0",
		"button11": "-",
		"button12": "=",
	}

	for (let id of Object.keys(buttons)) {
		let element = document.getElementById(id)
		element.addEventListener('click', getKeyboardEventEmitter(buttons[id]))
	}

	const mode = document.getElementById('select-mode')
	const structure = document.getElementById('select-structure')
	structure.addEventListener('change', () => {
		while (scene.children.length > 0) {
			scene.remove(scene.children[0])
		}
		sticks = null
		sensors = null
		onConfigure()
	})

	mode.addEventListener('change', () => {
		socket.emit('clientChangedMode', {
			'mode': document.getElementById('select-mode').value
		})
	})

	setInterval(() => {
		if (!sensors) return

		sensors.forEach(sensor => {
			sensor.realisticSensorUpdate()
		})
		socket.emit('updatedSensors', sensors)
	}, 50)
})()
