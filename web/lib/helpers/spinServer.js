/* global console */
/* global __dirname */

import '@babel/polyfill'

import express from 'express'
import path from 'path'
import http from 'http'
import socketio from 'socket.io'

export const spinServer = () => {
    const app = express()
    const server = new http.Server(app)
    const io = socketio(server)

    app.use('/', express.static(path.join(__dirname, '../../../static/')))
    app.use('/static/', express.static(path.join(__dirname, '../../../static/')))
    app.use('/web/client.js', express.static(path.join(__dirname, '../../client.js')))
    app.use('/web/lib/', express.static(path.join(__dirname, '../../lib')))

    server.listen(3000, () => {
        // Load config from file


        console.log('I am listenning on 3000')
    })

    return io
}
