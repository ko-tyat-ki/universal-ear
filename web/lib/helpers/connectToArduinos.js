/* global console */

import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

import { arduinosConfig } from './configuration/arduinosConfig.js'

export const connectToArduinos = () => {
    return arduinosConfig.map(arduinoConfig => {
        const portName = arduinoConfig.name

        const port = new SerialPort(`${portName}`, {
            baudRate: arduinoConfig.baudRate
        })

        const parser = port.pipe(new Readline({ delimiter: '\n' }))

        port.on('error', (err) => {
            console.log(`Port failure, check the connection of the device, port: ${portName}`, err)
        })

        port.on('close', (err) => {
            console.log(`Port was closed., port: ${portName}`, err)
        })

        return {
            port,
            parser
        }
    }).filter(Boolean)
}