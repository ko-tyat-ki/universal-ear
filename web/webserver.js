/* global __dirname */

import express from 'express'
import path from 'path'
import http from 'http'
import socketio from 'socket.io'
import WebMeasurementsProvider from "./lib/classes/WebMeasurementsProvider"

const app = express()
const server = new http.Server(app)
const io = socketio(server)

app.use('/', express.static(path.join(__dirname, '../static/')))
app.use('/web/client.js', express.static(path.join(__dirname, 'client.js')))
app.use('/web/lib/', express.static(path.join(__dirname, 'lib')))

let webMeasurementsProvider = new WebMeasurementsProvider()

// Socket connection from web interface
io.on('connection', function(socket) {
  webMeasurementsProvider.listenForInput(socket)
})

export {
  server,
  webMeasurementsProvider as clientMeasurementsProvider
}
