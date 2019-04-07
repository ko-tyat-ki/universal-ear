/* global console */
/* global __dirname */

import express from 'express'
import path from 'path'
import http from 'http'
import socketio from 'socket.io'
import modes from './lib/modes'

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

	socket.on('measurements', function (measurements) {
		if (!measurements) return
		// TODO: log measurements into file (+ rotate log and remove zero values)

		let config = clientConfigurations[socket.id]
		if (!config) {
			return
		} // TODO: logging

		const columns = config.columns
		if (!columns) {
			return
		} // TODO: logging

		const currentMode = modes[config.mode]
		if (!currentMode) {
			return
		} // TODO: logging

		const ledsConfig = currentMode(measurements, columns, config.arduinos)

		// TODO: change real arduino

		ledsConfig.filter(c => c != null).map(ledConfig => socket.emit("ledsChanged", ledConfig))
	})

	socket.on('configure', function (configuration) {
		console.log("configuration", configuration)
		clientConfigurations[socket.id] = configuration
	})

	socket.on('disconnect', () => {
		delete connectedSockets[socket.id]
		delete clientConfigurations[socket.id]
	})
})

