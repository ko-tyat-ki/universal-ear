/* global console */

import { arduinosConfig } from '../configuration/arduinosConfig.js'
import { RealSensor } from '../classes/realSensor.js';

export const connectToArduinos = () => {
    let res = []

    arduinosConfig.forEach(arduinoConfig => {
        res.push(new RealSensor(arduinoConfig))
    })

    return res.filter(Boolean)
}
