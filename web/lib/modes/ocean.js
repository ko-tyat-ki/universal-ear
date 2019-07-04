import { oceanConfig } from '../../../modes_config.json'
import { getDistance } from '../helpers/getDistance.js'
import { NUMBER_OF_LEDS } from '../configuration/constants.js';

const { tensionTrigger, speed, distanceBetweenSticks } = oceanConfig

const sensorStarted = []

const ocean = (sticks, sensors) => {
    return sensors.map((sensor, key) => {
        const tension = sensor.tension

        if (tension > tensionTrigger && tension < sensor.oldTension[0]) sensorStarted[key] = Date.now()

        return sticks.map(stick => {
            const leds = []
            const distance = getDistance({
                sensor,
                stick,
                allSticks: sticks
            })
            const radius = (Date.now() - sensorStarted[key]) / speed
            const ledDistance = distance / distanceBetweenSticks * NUMBER_OF_LEDS
            const howFar = Math.floor(Math.sqrt(radius * radius - ledDistance * ledDistance))

            if (howFar && howFar + NUMBER_OF_LEDS / 2 < NUMBER_OF_LEDS) {
                leds.push({
                    number: Math.floor(NUMBER_OF_LEDS / 2) + howFar,
                    color: {
                        r: Math.floor(60 + Math.random() * 195),
                        g: Math.floor(60 + Math.random() * 195),
                        b: Math.floor(60 + Math.random() * 195)
                    }
                })
                leds.push({
                    number: Math.floor(NUMBER_OF_LEDS / 2) - howFar,
                    color: {
                        r: Math.floor(60 + Math.random() * 195),
                        g: Math.floor(60 + Math.random() * 195),
                        b: Math.floor(60 + Math.random() * 195)
                    }
                })
            }

            return {
                key: stick.name,
                leds
            }
        })
    })
}

export default ocean
