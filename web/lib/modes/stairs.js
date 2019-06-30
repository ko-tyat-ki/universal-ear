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

const speed = 333 // in change per milisecond

const risingStairs = (sticks, sensors) => {
    return sensors.map(sensor => {
        // const tension = sensor.tension;

        return sticks.map(stick => {
            const leds = []
            if (sticks.length === 2) {
                const timeImput = Math.floor((Date.now() - start) / 1000) % 2
                if ((stick.name === '1' && timeImput === 0) || (stick.name === '2' && timeImput === 1)) {
                    [...Array(NUMBER_OF_LEDS / 2)].map((el, key) => leds.push({
                        number: key,
                        color: superBrightColor()
                    }))
                } else {
                    [...Array(NUMBER_OF_LEDS / 2)].map((el, key) => leds.push({
                        number: key + NUMBER_OF_LEDS / 2,
                        color: superBrightColor()
                    }))
                }
            }
            if (sticks.length === 12) {
                const timeImput = Math.floor((Date.now() - start) / speed)
                let raiseFactor
                if (['3', '7'].indexOf(stick.name) > -1) { raiseFactor = 0 }
                if (['1', '4', '8', '11'].indexOf(stick.name) > -1) { raiseFactor = 1 }
                if (['2', '5', '9', '12'].indexOf(stick.name) > -1) { raiseFactor = 2 }
                if (['6', '10'].indexOf(stick.name) > -1) { raiseFactor = 3 }
                [...Array(NUMBER_OF_LEDS / 4)].map((el, key) => leds.push({
                    number: key + NUMBER_OF_LEDS / 4 * ((timeImput + raiseFactor) % 4),
                    color: superBrightColor()
                }))
            }
            return {
                key: stick.name,
                leds
            };
        });
    });
};

export default risingStairs;