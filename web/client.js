/* global document */
/* global console */

/* global io */

import { sleep } from './lib/helpers/sleep.js'
import { drawEar } from './lib/helpers/drawEar.js'
import { init, animate } from './lib/helpers/setUpWorld.js'

let socket = io()
let scene

const buildColumns = (configuration, regime) => {
	const selectedConfiguration = configuration.options[configuration.options.selectedIndex].value
	const selectedRegime = regime.options[regime.options.selectedIndex].value

	let columns

	switch (selectedConfiguration) {
		case 'duet':
			columns = [
				{
					key: 'a',
					sensorPosition: 10
				},
				{
					key: 's',
					sensorPosition: 120
				}
			]
			break
		case 'circle':
			columns = [
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
			break
		default:
			console.log('You need to pick up configuration you would use')
			return
	}

	const ear = drawEar(columns, scene)

	socket.emit('configure', {
		'mode': selectedRegime,
		'columns': ear.columns,
		'arduinos': ear.arduinos,
	})

	return {
		...ear,
		columnKeys: columns.map(column => column.key)
	}
}

let arduinos

const onConfigure = () => {
	const configuration = document.getElementById('select-configuration')
	const regime = document.getElementById('select-regime')

	const update = buildColumns(configuration, regime)
	const columns = update.columns
	arduinos = update.arduinos

	// code for sockets, maybe will need to be reconfigured
	const columnsIdx = {}
	for (const column of columns) {
		columnsIdx[column.columnName] = column
	}

	socket.on('ledsChanged', (changes) => {
		if (!changes) return
		if (!columns) return
		if (changes.length <= 0) return

		for (let changeIdx in changes) {
			let change = changes[changeIdx]
			if (!change) continue
			let column = columnsIdx[change.name]
			column.colorLeds(change.leds)
		}
	})
}

(async () => {
	init()
	scene = animate()
	onConfigure()

	const regime = document.getElementById('select-regime')
	const configuration = document.getElementById('select-configuration')
	configuration.addEventListener('change', onConfigure)
	regime.addEventListener('change', onConfigure)

	let currentTime = Date.now()
	let stop = false

	while (!stop) {
		const delta = Date.now() - currentTime

		if (!arduinos) continue

		arduinos.forEach((arduino) => {
			arduino.update(delta)
		})

		const measurements = arduinos.map(a => {
			return {
				name: a.key,
				tension: a.tension
			}
		})

		socket.emit('measurements', measurements)
		currentTime = Date.now()
		await sleep(10)
	}
})()
