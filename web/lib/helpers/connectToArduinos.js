/* global console */

import { arduinosConfig } from '../configuration/arduinosConfig.js'
import { RealSensor } from '../classes/realSensor.js'

export const connectToArduinos = () => {
    let res = []

    for (let arduinoConfig of arduinosConfig) {
      let sensor
      try {
        sensor = new RealSensor(arduinoConfig)
        console.log(sensor)
      } catch {
        console.log('Can\'t create sensor', sensor)
        continue
      }
      if (!sensor) continue
      res.push(sensor)

    }

    return res
}
