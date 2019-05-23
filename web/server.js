/* global console */
/* global __dirname */
/* global Uint8Array */
/* global ArrayBuffer */

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

const port = new SerialPort('COM14', {
//const port = new SerialPort(`/dev/tty${arduinoPort}`, {
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

let areWeWriting = true

parser.on('data', data => {
	if (areWeWriting && ledsConfig) {
		console.log('DATA IN', data)

		const numberOfLeds = 30
		const bufferArray = new ArrayBuffer(numberOfLeds * 4 + 3)
		const dataForBuffer = new Uint8Array(bufferArray)
		const startByte = 0x10
		const sizeByte = 0x11
		const checkSum = 0x12

		dataForBuffer[0] = startByte
		dataForBuffer[1] = sizeByte
		ledsConfig[0][0].leds.slice(0, numberOfLeds).forEach((led, key) => {
			const rgb = transformHexToRgb(led.color)
			dataForBuffer[key * 4 + 2] = led.number
			dataForBuffer[key * 4 + 3] = rgb.r
			dataForBuffer[key * 4 + 4] = rgb.g
			dataForBuffer[key * 4 + 5] = rgb.b
		})
		dataForBuffer[numberOfLeds * 4 + 2] = checkSum
		port.write(dataForBuffer)
		areWeWriting = false
	} else {
		console.log('Data IN, listen', data)
		if (data == 'eat me\r') {
			areWeWriting = true
		}
	}
})

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
