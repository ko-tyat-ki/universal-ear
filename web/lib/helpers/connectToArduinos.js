/* global console */

import { arduinosConfig } from '../configuration/arduinosConfig.js'
import { RealSensor } from '../classes/realSensor.js';

export const connectToArduinos = (oldSensors) => {

    oldSensors = oldSensors || []

    return arduinosConfig.map(arduinoConfig => {
        let exists = oldSensors.find((sensor) => sensor.key === arduinoConfig.name)

        if (exists) {
            return exists
        }

        return new RealSensor(arduinoConfig)
    }).filter(Boolean)
}
