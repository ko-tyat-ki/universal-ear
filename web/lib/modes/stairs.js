import { NUMBER_OF_LEDS } from "../configuration/constants";

const start = Date.now();

const speed = 500 // in change per milisecond

const superBrightColor = () => {
    return {
        r: Math.floor(Math.random() * 100),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 195)
    }
}

const ledsCalculation = ({ numberOfParts, timeImput, raiseFactor, tension }) => {
    const fakeNumberOfLeds = (numberOfParts === 2) ? NUMBER_OF_LEDS : 32
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
            color: superBrightColor()
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
                }
                if (sticks.length === 12) {
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