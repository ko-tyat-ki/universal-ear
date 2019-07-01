import { simpleRainbow } from "../helpers/rainbowColors";
import { NUMBER_OF_LEDS } from "../configuration/constants";

const start = Date.now()
const speed = 150

const onChange = (sticks, sensors) => {
    return sticks.map((stick, key) => {
        // const leds = []
        // const litFactor = Math.floor((Date.now() - start) / speed) % NUMBER_OF_LEDS

        // {
        //     [...Array(numberOfLeds)].map((el, key) => leds.push({
        //         number: key,
        //         color: simpleRainbow(key)
        //     }))
        // }
        // return [
        //     {
        //         key: stick.name,
        //         leds
        //     }
        // ]
    })
}

export default onChange