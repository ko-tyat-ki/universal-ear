/* global console */
/* global __dirname */

import express from 'express'
import path from 'path'
import http from 'http'
import socketio from 'socket.io'
import modes from './lib/visualisations'
import { putLedsInBufferArray } from './lib/helpers/dataHelpers'

import 'babel-polyfill'

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

const BAUD_RATE = 115200
const NUMBER_OF_LEDS = 40

import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

const arduinoPort = '.usbmodem14201'

// const port = new SerialPort('COM14', {
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

let areWeWriting = true

parser.on('data', data => {
	if (areWeWriting && ledsConfig) {
		console.log('DATA IN', data)

		const ledsBufferArray = putLedsInBufferArray(ledsConfig[0][0].leds, NUMBER_OF_LEDS)
		port.write(ledsBufferArray)
		areWeWriting = false
	} else {
		console.log('Data IN, listen', data)
		if (data == 'eat me\r') {
			areWeWriting = true
		} else {
			console.log('SENSOR DATA', data.split('\t')[0])
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
		console.log(ledsConfig)

		ledsConfig.map(ledConfig => socket.emit('ledsChanged', ledConfig))
	})

	socket.on('configure', configuration => {
		clientConfigurations[socket.id] = configuration
	})

	socket.on('disconnect', () => {
		delete connectedSockets[socket.id]
		delete clientConfigurations[socket.id]
	})
})
