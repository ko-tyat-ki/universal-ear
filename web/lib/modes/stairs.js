import { NUMBER_OF_LEDS } from "../configuration/constants";
import { stairs } from '../../../modes_config.json'

const start = Date.now();

const speed = stairs.speed // in change per milisecond, default 500
const numberOfLedsOf16 = stairs.numberOfLedsOf16 // default 32

const numberOfRandomness = 1000

const randomGenerator = [...Array(numberOfRandomness)].map(row => (
    [...Array(NUMBER_OF_LEDS)].map(color => (
        {
            r: Math.floor(60 + Math.random() * 100),
            g: Math.floor(60 + Math.random() * 255),
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

const superBrightColor = (key) => {
    return getRandom(key)
}

const ledsCalculation = ({ numberOfParts, timeImput, raiseFactor, tension }) => {
    const fakeNumberOfLeds = (numberOfParts === 2) ? NUMBER_OF_LEDS : numberOfLedsOf16
    const fakeFactor = (numberOfParts === 2) ? 0 : 4
    return [...Array(fakeNumberOfLeds / numberOfParts)].map((el, key) => {
        let number
        if (tension > 10) {
            const liftFactor = (timeImput + raiseFactor) % numberOfParts
            const lift = fakeNumberOfLeds / numberOfParts / numberOfParts * liftFactor
            const additionalLiftFactor = Math.floor(key / (fakeNumberOfLeds / numberOfParts / numberOfParts))
            const additionalLift = (fakeNumberOfLeds / numberOfParts * (1 - 1 / numberOfParts)) * additionalLiftFactor
            number = key + additionalLift + lift + fakeFactor
        } else {
            const liftFactor = (timeImput + raiseFactor) % numberOfParts
            const lift = NUMBER_OF_LEDS / numberOfParts * liftFactor
            number = key + lift
        }
        if (number < 0 || number > NUMBER_OF_LEDS - 1) return
        return {
            number,
            color: superBrightColor(key)
        }
    }).filter(Boolean)
}

const risingStairs = (sticks, sensors) => {
    // sum all sensors on one column to one
    const prodSensors = sensors.filter(sensor => sensor.key.length > 5)
    let sensorsToUse
    if (prodSensors.length > 0) {
        sensorsToUse = prodSensors
    } else {
        sensorsToUse = sensors
    }
    return sensorsToUse.map(sensor => {
        return sticks.map(stick => {
            if (stick.name === sensor.stick) {
                const tension = sensor.tension
                if (sticks.length === 2) {
                    const timeImput = Math.floor((Date.now() - start) / speed)
                    const raiseFactor = (stick.name === '1') ? 0 : 1
                    return {
                        key: stick.name,
                        leds: ledsCalculation({ numberOfParts: 2, timeImput, raiseFactor, tension })
                    };
                } else {
                    const timeImput = Math.floor((Date.now() - start) / speed)
                    let raiseFactor
                    if (['3', '7'].indexOf(stick.name) > -1) raiseFactor = 0
                    if (['1', '4', '8', '11'].indexOf(stick.name) > -1) raiseFactor = 1
                    if (['2', '5', '9', '12'].indexOf(stick.name) > -1) raiseFactor = 2
                    if (['6', '10'].indexOf(stick.name) > -1) raiseFactor = 3
                    return {
                        key: stick.name,
                        leds: ledsCalculation({ numberOfParts: 4, timeImput, raiseFactor, tension })
                    };
                }
            }
        });
    });
};

export default risingStairs;