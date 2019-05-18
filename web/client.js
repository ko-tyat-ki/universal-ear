/* global document */
/* global console */

/* global io */
/* global requestAnimationFrame */

import { sleep } from './lib/helpers/sleep.js'
import { drawEar } from './lib/helpers/drawEar.js'
import { init, animate } from './lib/helpers/setUpWorld.js'

let socket = io()

let columns
let columnsIdx = {}
let arduinos
let columnKeys

let scene

const buildColumns = async (configuration, regime) => {
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

const cleanScreen = columnKeys => {
	if (!columnKeys) return

	columnKeys.forEach(columnKey => {
		const columnEl = document.getElementById(`column-${columnKey}`)
		document.getElementById('container').removeChild(columnEl)
	})
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

let onConfigure = async () => {
	const configuration = document.getElementById('select-configuration')
	const regime = document.getElementById('select-regime')

	cleanScreen(columnKeys)
	const update = await buildColumns(configuration, regime)
	columns = update.columns
	arduinos = update.arduinos
	columnKeys = update.columnKeys

	columnsIdx = {}
	for (const column of columns) {
		columnsIdx[column.columnName] = column
	}
}

(async () => {
	init()
	scene = animate()
	await onConfigure()

	const regime = document.getElementById('select-regime')
	const configuration = document.getElementById('select-configuration')
	configuration.addEventListener('change', async () => await onConfigure())
	regime.addEventListener('change', async () => await onConfigure())

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
