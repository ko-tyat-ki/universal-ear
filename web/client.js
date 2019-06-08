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

const buildEar = (structure, regime) => {
	const selectedStructure = structure.options[structure.options.selectedIndex].value
	const selectedRegime = regime.options[regime.options.selectedIndex].value

	const configuration = {
		fakeSensors: calculateFakeSensors(selectedStructure),
		sticks: calculateClientSticks(selectedStructure),
		poles: calculateClientPoles(selectedStructure)
	}

	const ear = drawEar(configuration, scene)

	socket.emit('configure', {
		'mode': selectedRegime,
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
	const regime = document.getElementById('select-regime')

	const update = buildEar(structure, regime)
	sticks = update.sticks
	sensors = update.sensors

	socket.on('ledsChanged', changes => {
		if (!changes) return
		if (!sticks) return
		if (changes.length <= 0) return

		changes.map(change => {
			const stick = sticks.find(stick => stick.name === change.key)
			stick.colorLeds(change.leds)
		})
	})
}

(() => {
	onConfigure()

	const regime = document.getElementById('select-regime')
	const structure = document.getElementById('select-structure')
	structure.addEventListener('change', () => {
		while (scene.children.length > 0) {
			scene.remove(scene.children[0])
		}
		sticks = null
		sensors = null
		onConfigure()
	})
	regime.addEventListener('change', onConfigure)

	setInterval(() => {
		if (!sensors) return

		sensors.forEach(sensor => {
			sensor.realisticSensorUpdate()
			//sensor.update(2)
		})
		socket.emit('updatedSensors', sensors)
	}, 100)
})()
