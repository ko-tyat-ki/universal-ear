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
	const selectedMode = mode.options[mode.options.selectedIndex].value

	const configuration = {
		fakeSensors: calculateFakeSensors(selectedStructure),
		sticks: calculateClientSticks(selectedStructure),
		poles: calculateClientPoles(selectedStructure)
	}

	const ear = drawEar(configuration, scene)

	socket.emit('configure', {
		'mode': selectedMode,
		'sticks': ear.sticks,
		'sensors': ear.sensors,
	})

	return ear
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
	mode.addEventListener('change', onConfigure)

	setInterval(() => {
		if (!sensors) return

		sensors.forEach(sensor => {
			sensor.realisticSensorUpdate()
		})
		socket.emit('updatedSensors', sensors)
	}, 50)
})()
