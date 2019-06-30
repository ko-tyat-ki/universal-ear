import { NUMBER_OF_LEDS } from "../configuration/constants";

const start = Date.now();

const superBrightColor = () => {
    return {
        r: Math.floor(Math.random() * 100),
        g: Math.floor(Math.random() * 195),
        b: Math.floor(Math.random() * 195)
    }
}

// const superBrightColor = () => {
//     return {
//         r: Math.floor(Math.random() * 1),
//         g: Math.floor(Math.random() * 20),
//         b: Math.floor(Math.random() * 20)
//     }
// }

const ledsCalculation = (numberOfParts, timeImput, raiseFactor) => {
    return [...Array(NUMBER_OF_LEDS / numberOfParts)].map((el, key) => {
        return {
            number: key + NUMBER_OF_LEDS / numberOfParts * ((timeImput + raiseFactor) % numberOfParts),
            color: superBrightColor()
        }
    })
}

const speed = 333 // in change per milisecond

const risingStairs = (sticks, sensors) => {
    return sensors.map(sensor => {
        const tension = sensor.tension;

        return sticks.map(stick => {
            if (sticks.length === 2) {
                const timeImput = Math.floor((Date.now() - start) / 1000)
                const raiseFactor = (stick.name === '1') ? 0 : 1
                return {
                    key: stick.name,
                    leds: ledsCalculation(2, timeImput, raiseFactor)
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
                    leds: ledsCalculation(4, timeImput, raiseFactor)
                };
            }
        });
    });
};

export default risingStairs;