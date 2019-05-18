/* global document */

/* global io */

import { sleep } from './lib/helpers/sleep.js'
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

const onConfigure = () => {
	const structure = document.getElementById('select-structure')
	const regime = document.getElementById('select-regime')

	const update = buildColumns(structure, regime)
	const sticks = update.sticks
	sensors = update.sensors

	socket.on('ledsChanged', (changes) => {
		if (!changes) return
		if (!sticks) return
		if (changes.length <= 0) return

		changes.map(change => {
			if (!change) return
			let stick = sticks[change.key]
			stick.colorLeds(change.leds)
		})
	})
}

(async () => {
	init()
	scene = animate()
	onConfigure()

	const regime = document.getElementById('select-regime')
	const structure = document.getElementById('select-structure')
	structure.addEventListener('change', onConfigure)
	regime.addEventListener('change', onConfigure)

	let currentTime = Date.now()
	let stop = false

	while (!stop) {
		const delta = Date.now() - currentTime

		if (!sensors) continue

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
		await sleep(10)
	}
})()
