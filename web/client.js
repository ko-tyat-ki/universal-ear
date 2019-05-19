/* global document */
/* global setInterval */

/* global io */

import { drawEar } from './lib/helpers/drawEar.js'
import { init, animate } from './lib/helpers/setUpWorld.js'
import { calculateConfiguration } from './lib/helpers/configuration.js'

let socket = io()
let scene

const buildColumns = (structure, regime) => {
	const selectedStructure = structure.options[structure.options.selectedIndex].value
	const selectedRegime = regime.options[regime.options.selectedIndex].value

	const configuration = calculateConfiguration(selectedStructure)

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

	const update = buildColumns(structure, regime)
	sticks = update.sticks
	sensors = update.sensors

	socket.on('ledsChanged', (changes) => {
		if (!changes) return
		if (!sticks) return
		if (changes.length <= 0) return

		changes.map(change => {
			if (!change) return
			let stick = sticks.find(stick => stick.stickName === change.key)
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

	let currentTime = Date.now()

	setInterval(() => {
		const delta = Date.now() - currentTime

		if (!sensors) return

		sensors.forEach((sensor) => {
			sensor.update(delta)
		})

		const measurements = sensors.map(sensor => {
			return {
				name: sensor.key,
				tension: sensor.tension
			}
		})

		socket.emit('measurements', measurements)
		currentTime = Date.now()
	}, 10)
})()
