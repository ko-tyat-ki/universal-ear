/* global console */
/* global __dirname */

import express from 'express'
import path from 'path'
import http from 'http'
import socketio from 'socket.io'
import modes from './lib/visualisations'

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

io.on('connection', function (socket) {
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

		// console.log("AAZZAZA", measurements)

		const ledsConfig = currentMode(measurements, sticks, config.sensors)

		// TODO: change real arduino

		console.log('THIS IS OUR LED CONFIG', ledsConfig)

		ledsConfig.filter(c => c != null).map(ledConfig => socket.emit('ledsChanged', ledConfig))
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

/* global console */
/* global setInterval */

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

parser.on('data', data => {
	// const sensorValue = parseInt(data, 10)
	console.log(data)
})

setInterval(() => {
	parser.write(`<10,255,0,0>\n`)
}, 1000)

