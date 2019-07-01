import { fastReaction } from '../../../modes_config.json'
import { NUMBER_OF_LEDS } from '../configuration/constants.js';

const tensionAndRandomEcho = (sticks, sensors) => {
    const superBrightColor = {
        r: 255,
        g: 0,
        b: 0
    }

    return sensors.map(sensor => {
        const stick = sticks.find(stick => stick.name === sensor.stick)
        if (!stick) return
        const tension = sensor.tension

        const leds = []

        if (!sensor.isSlowSensor && sensor.stick === stick.name && tension >= fastReaction.tensionTrigger) {
            [...Array(NUMBER_OF_LEDS)].map((el, key) => leds.push({
                number: key,
                color: superBrightColor
            }))
        }

        return [{
            key: stick.name,
            leds
        }]
    })
}

export default tensionAndRandomEcho
