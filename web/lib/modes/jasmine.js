import { jasmineConfig } from '../../../modes_config.json'
import { getDistance } from '../helpers/getDistance.js'
import { NUMBER_OF_LEDS } from '../configuration/constants.js'

const communistColor = {
    r: 255,
    g: 20,
    b: 20
}

const numberOfRandomness = 100

const randomGenerator = [...Array(numberOfRandomness)].map(row => (
    [...Array(NUMBER_OF_LEDS)].map(color => (
        {
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 150),
            b: Math.floor(Math.random() * 100)
        }
    ))
))

let count = 0

console.log(randomGenerator)

const jasmine = (sticks, sensors) => {
    return sensors.map(sensor => {
        const tension = sensor.tension

        return sticks.map(stick => {
            const leds = []
            // if (tension >= 0) {
            const distance = getDistance({
                sensor,
                stick,
                allSticks: sticks
            })

            if (distance === 0) {
                if (!sensor.isSlowSensor && sensor.stick === stick.name && tension >= jasmineConfig.tensionTrigger) {
                    [...Array(NUMBER_OF_LEDS)].map((el, key) => leds.push({
                        number: key,
                        color: communistColor
                    }))
                }
            } else {
                if (tension) {
                    {
                        [...Array(NUMBER_OF_LEDS)].map((el, key) => {
                            const randomWarmColor = {
                                r: randomGenerator[count][key].r,
                                g: randomGenerator[count][key].g,
                                b: randomGenerator[count][key].b
                            }
                            count++
                            if (count === numberOfRandomness - 1) count = 0
                            if (randomWarmColor.r + randomWarmColor.g + randomWarmColor.b > 450) {
                                leds.push({
                                    number: key,
                                    color: randomWarmColor
                                })
                            }
                        })
                    }
                }
            }
            // }

            return {
                key: stick.name,
                leds: leds
            }
        })
    })
}

export default jasmine