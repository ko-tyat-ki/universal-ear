import { oceanConfig } from '../../../modes_config.json'
import { getDistance } from '../helpers/getDistance.js'
import { NUMBER_OF_LEDS } from '../configuration/constants.js'

const { tensionTrigger, speed, distanceBetweenSticks } = oceanConfig

const sensorStarted = []

const numberOfRandomness = 1000

const randomGenerator = [...Array(numberOfRandomness)].map(row => (
    [...Array(NUMBER_OF_LEDS)].map(color => (
        {
            r: Math.floor(60 + Math.random() * 195),
            g: Math.floor(60 + Math.random() * 195),
            b: Math.floor(60 + Math.random() * 195)
        }
    ))
))

let count = 0

const getRandom = (key) => {
	count++

	if (count >= numberOfRandomness - 1) count = 0

	return randomGenerator[count][key]
}

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
                    color: getRandom(key)
                })
                leds.push({
                    number: Math.floor(NUMBER_OF_LEDS / 2) - howFar,
                    color: getRandom(key)
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
