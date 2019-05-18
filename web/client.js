/* global document */
/* global console */

/* global io */

import { sleep } from './lib/helpers/sleep.js'
import { drawEar } from './lib/helpers/drawEar.js'
import { init, animate } from './lib/helpers/setUpWorld.js'

let socket = io()
let scene

const calculateConfiguration = (selectedStructure) => {
	switch (selectedStructure) {
		case 'duet':
			return {
				sticks: [
					{
						x: 122,
						y: -180,
						z: 0
					},
					{
						x: -122,
						y: -180,
						z: 0
					}
				],
				sensors: [
					{
						key: 'a',
						sensorPosition: 10
					},
					{
						key: 's',
						sensorPosition: 120
					}
				],
				poles: [
					{
						geoX: 5,
						geoY: 375,
						geoZ: 5,
						initX: 125,
						initY: -62,
						initZ: 0
					}, {
						geoX: 5,
						geoY: 375,
						geoZ: 5,
						initX: -125,
						initY: -62,
						initZ: 0
					}, {
						geoX: 255,
						geoY: 5,
						geoZ: 5,
						initX: 0,
						initY: 125,
						initZ: 0
					}
				]

			}
		case 'circle':
			return {
				columns: [
					{
						key: '0',
						sensorPosition: 20
					},
					{
						key: '1',
						sensorPosition: 20
					},
					{
						key: '2',
						sensorPosition: 20
					},
					{
						key: '3',
						sensorPosition: 20
					},
					{
						key: '4',
						sensorPosition: 20
					},
					{
						key: '5',
						sensorPosition: 20
					},
					{
						key: '6',
						sensorPosition: 20
					},
					{
						key: '7',
						sensorPosition: 20
					},
					{
						key: '8',
						sensorPosition: 20
					},
					{
						key: '9',
						sensorPosition: 20
					}
				]
			}
		default:
			console.log('You need to pick up structure you would use')
			return
	}
}

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

	// code for sockets, maybe will need to be reconfigured
	const sticksIdx = {}
	for (const stick of sticks) {
		sticksIdx[stick.stickName] = stick
	}

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
