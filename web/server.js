/* global console */
/* global __dirname */
/* global setInterval */

import express from 'express'
import path from 'path'
import http from 'http'
import socketio from 'socket.io'
import modes from './lib/visualisations'

import 'babel-polyfill'

const transformHexToRgb = (hex) => {
	const b = hex % 256
	const g = (hex - b) / 256 % 256
	const r = ((hex - b) / 256 - g) / 256
	return {
		r, g, b
	}
}

// Black magic
const app = express()
const server = new http.Server(app)
const io = socketio(server)

app.use('/', express.static(path.join(__dirname, '../static/')))
app.use('/static/', express.static(path.join(__dirname, '../static/')))
app.use('/web/client.js', express.static(path.join(__dirname, 'client.js')))
app.use('/web/lib/', express.static(path.join(__dirname, 'lib')))

server.listen(3000, () => {
	console.log('I am listenning on 3000')
})

// Client socket connection
const connectedSockets = {}
const clientConfigurations = {}
let ledsConfig

const BAUD_RATE = 9600

import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

const arduinoPort = '.usbmodem14201'

const port = new SerialPort(`/dev/tty${arduinoPort}`, {
	baudRate: BAUD_RATE
})

const parser = port.pipe(new Readline({ delimiter: '\n' }))

port.on('error', (err) => {
	console.log('Port failure, removing device.', err)
})

// port failures
port.on('close', (err) => {
	console.log('Port was closed.', err)
})

// parser.on('data', data => {
// const sensorValue = parseInt(data, 10)
// console.log(data)
// if (data && ledsConfig) {
// 	const cleanLedsConfig = ledsConfig.filter(Boolean)
// 	for (let i = 0; i < cleanLedsConfig.length; i++) {
// 		const leds = ledsConfig[i][0].leds

// 		leds.map(led => {
// 			// const rgb = transformHexToRgb(led.color)
// 			port.write(`${led.number}\n`)
// 			// port.write(`${rgb.r}\n`)
// 			// port.write(`${rgb.g}\n`)
// 			// port.write(`${rgb.b}\n`)
// 			// port.write(`${rgb.r + rgb.g + rgb.b + led.number}\n`)
// 		})
// 	}
// }
// })
// setInterval(() => {
// 	parser.write(`<10,255,0,0>\n`)
// }, 1000)

// const blablabla = async () => {

// }

let areWeWriting = true

// const readFromArduino = () => {
// 	const data = port.read().toString('utf8')
// 	console.log('DATA', data)
// 	return new Promise(resolves(port.read().toString('utf8')))
// }

parser.on('data', data => {
	if (areWeWriting && ledsConfig) {
		console.log('OTHER DATA', data)
		console.log('Sending', ledsConfig)
		let post
		if (ledsConfig[0][0].leds.length === 0) {
			post = '<0,n,n,n>\n'
			port.write(post)
		} else {
			// Non working case when we try to send several at a time one after another - doesn't work => we need 1 Array
			// 
			// ledsConfig[0][0].leds.forEach(led => {
			// 	// const led = ledsConfig[0][0].leds[0]
			// 	const rgb = transformHexToRgb(led.color)
			// 	post = `<${led.number},${rgb.r},${rgb.g},${rgb.b}>\n`
			// 	port.write(post)
			// })

			// This case is working, but it's only one
			// 
			const led = ledsConfig[0][0].leds[0]
			const rgb = transformHexToRgb(led.color)
			post = `<${led.number},${rgb.r},${rgb.g},${rgb.b}>\n`
			port.write(post)
		}
		areWeWriting = false
	} else {
		console.log('DATA', data)
		if (data === 'eat me\r') {
			areWeWriting = true
		}
	}
})

// setInterval(() => {
// 	talkToArduino()
// }, 1000)

// (() => {
// 	setInterval(() => {
// 		talkToArduino()
// 	}, 100)
// })()

io.on('connection', socket => {
	connectedSockets[socket.id] = socket

	socket.on('measurements', (measurements) => {
		if (!measurements) return
		// TODO: log measurements into file (+ rotate log and remove zero values)

		let config = clientConfigurations[socket.id]
		if (!config) {
			return
		} // TODO: logging

		const sticks = config.sticks
		if (!sticks) {
			return
		} // TODO: logging

		const currentMode = modes[config.mode]
		if (!currentMode) {
			return
		} // TODO: logging

		ledsConfig = currentMode(measurements, sticks, config.sensors).filter(Boolean)

		ledsConfig.map(ledConfig => socket.emit('ledsChanged', ledConfig))
	})

	socket.on('configure', function (configuration) {
		console.log('configuration', configuration)
		clientConfigurations[socket.id] = configuration
	})

	socket.on('disconnect', () => {
		delete connectedSockets[socket.id]
		delete clientConfigurations[socket.id]
	})
})
