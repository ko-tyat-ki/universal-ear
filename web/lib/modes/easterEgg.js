import { simpleRainbow } from "../helpers/rainbowColors";
import { NUMBER_OF_LEDS } from "../configuration/constants";

const start = Date.now()
const speed = 150

// в это время играет музыка бенни хилла
const easterEgg = (sticks, sensors) => {
    return sticks.map((stick, key) => {
        const leds = []
        const numberOfLeds = Math.floor((Date.now() - start) / speed) % NUMBER_OF_LEDS

        {
            [...Array(numberOfLeds)].map((el, key) => leds.push({
                number: key,
                color: simpleRainbow(key)
            }))
        }
        return [
            {
                key: stick.name,
                leds
            }
        ]
    })
}

export default easterEgg