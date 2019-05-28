/* global console */
/* global __dirname */

import express from 'express'
import path from 'path'
import http from 'http'
import socketio from 'socket.io'
import modes from './lib/visualisations'
import {
	putLedsInBufferArray,
	regroupConfig
} from './lib/helpers/dataHelpers'

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
let currentMode = modes.basic

const BAUD_RATE = 115200
const NUMBER_OF_LEDS = 40

import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

const arduinoPort = '.usbmodem14201'

// port1 = {
// 	name: '',
// 	column: '',
// 	sensors: [
// 		{
// 			name: '',
// 			postion: ''
// 		}
// 	]
// }

// const ports = [port1, port2]

// ports.map(port => {
// 	createPort(port.name, BAUD_RATE)

// 	const parser = serverPort()

// 	parser.on('data', () => {

// 	})
// })

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

		const sensorData = data.split('\t')[0].split('! ')[1]
		const realMeasurements = [{ name: 'real', tension: sensorData - 80 }]
		// socket.emit('measurements', realMeasurements)
		const sticks = [
			{ numberOfLEDs: NUMBER_OF_LEDS, name: '1' },
			{ numberOfLEDs: NUMBER_OF_LEDS, name: '2' }
		]
		const realSensors = [{
			key: 'real',
			column: '1',
			sensorPosition: 20
		}]
		const ledsConfigFromClient = currentMode(realMeasurements, sticks, realSensors).filter(Boolean)
		console.log('LEDS', ledsConfigFromClient[0][0].leds)
		ledsConfig = regroupConfig(ledsConfigFromClient)

		const ledsBufferArray = putLedsInBufferArray(ledsConfig[0].leds, NUMBER_OF_LEDS)
		port.write(ledsBufferArray)
		areWeWriting = false
	} else {
		console.log('Data IN, listen', data)
		if (data === 'eat me\r') {
			areWeWriting = true
		}
	}
})

io.on('connection', socket => {
	connectedSockets[socket.id] = socket

	socket.on('measurements', clientMeasurements => {
		if (!clientMeasurements) return
		// TODO: log measurements into file (+ rotate log and remove zero values)

		let config = clientConfigurations[socket.id]
		if (!config) {
			return
		} // TODO: logging

		const sticks = config.sticks
		if (!sticks) {
			return
		} // TODO: logging

		currentMode = modes[config.mode]
		if (!currentMode) {
			return
		} // TODO: logging

		const ledsConfigFromClient = currentMode(clientMeasurements, sticks, config.sensors).filter(Boolean)
		ledsConfig = regroupConfig(ledsConfigFromClient)
		socket.emit('ledsChanged', ledsConfig)
		// ledsConfigFromClient.map(ledConfig => socket.emit('ledsChanged', ledConfig)) // keep for now for development processes
	})

	socket.on('configure', configuration => {
		clientConfigurations[socket.id] = configuration
	})

	socket.on('disconnect', () => {
		delete connectedSockets[socket.id]
		delete clientConfigurations[socket.id]
	})
})
