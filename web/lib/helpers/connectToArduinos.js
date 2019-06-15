/* global console */

import { arduinosConfig } from '../configuration/arduinosConfig.js'
import { RealSensor } from '../classes/realSensor.js';

export const connectToArduinos = () => {
    return arduinosConfig.map(arduinoConfig => {
        return new RealSensor(arduinoConfig)
    }).filter(Boolean)
}