// import { onChange } from "../helpers/rainbowColors";
import { onChangeConfig } from '../../../modes_config.json'
import { NUMBER_OF_LEDS } from "../configuration/constants";

let start
let isGoing = false

export const onChangeSpeed = onChangeConfig.speed

const whiteColor = {
    r: 255,
    g: 255,
    b: 255
}

export const onChange = (sticks, sensors) => {
    if (!isGoing) start = Date.now()
    isGoing = true
    return sticks.map((stick, key) => {
        const leds = []
        const timeImput = Math.floor((Date.now() - start) / onChangeSpeed)
        const timeFactor = timeImput % 15
        if (((['1'].indexOf(stick.name) > -1) && (timeFactor === 0)) ||
            ((['2'].indexOf(stick.name) > -1) && (timeFactor === 1)) ||
            ((['6'].indexOf(stick.name) > -1) && (timeFactor === 2)) ||
            ((['10'].indexOf(stick.name) > -1) && (timeFactor === 3)) ||
            ((['12'].indexOf(stick.name) > -1) && (timeFactor === 4)) ||
            ((['11'].indexOf(stick.name) > -1) && (timeFactor === 5)) ||
            ((['7'].indexOf(stick.name) > -1) && (timeFactor === 6)) ||
            ((['3'].indexOf(stick.name) > -1) && (timeFactor === 7)) ||
            ((['4'].indexOf(stick.name) > -1) && (timeFactor === 8)) ||
            ((['5'].indexOf(stick.name) > -1) && (timeFactor === 9)) ||
            ((['9'].indexOf(stick.name) > -1) && (timeFactor === 10)) ||
            ((['8'].indexOf(stick.name) > -1) && (timeFactor === 11)) ||
            ((['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].indexOf(stick.name) > -1) && (timeFactor === 12 || timeFactor === 13 || timeFactor === 14))) {
            {
                [...Array(NUMBER_OF_LEDS)].map((el, key) => leds.push({
                    number: key,
                    color: whiteColor
                }))
            }
        }

        if (timeFactor === 14) isGoing = false
        return [
            {
                key: stick.name,
                leds
            }
        ]
    })
}