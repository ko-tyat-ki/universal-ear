/* global Math */

const addColor = (ledOne, ledTwo) => {
    const ledOneRGB = transformHexToRgb(ledOne)
    const ledTwoRGB = transformHexToRgb(ledTwo)
    return Math.min(ledOneRGB.r + ledTwoRGB.r, 255) * 256 * 256
        + Math.min(ledOneRGB.g + ledTwoRGB.g, 255) * 256
        + Math.min(ledOneRGB.b + ledTwoRGB.b, 255)
}

const combineLEDs = (first, second) => {
    const outcome = []
    first.forEach(ledOne => {
        const thatSecond = second.find(ledTwo => ledTwo.number === ledOne.number)
        outcome.push({
            number: ledOne.number,
            color: thatSecond ? addColor(ledOne.color, thatSecond.color) : ledOne.color
        })
    })
    second.forEach(ledOne => {
        const notMissing = outcome.find(ledTwo => ledTwo.number === ledOne.number)
        if (!notMissing) {
            outcome.push(ledOne)
        }
    })

    return outcome
}

const eliminateLEDsConfigRepetition = (ledsConfig) => {
    const cleanedConfig = []
    ledsConfig.map(led => {
        const foundLed = cleanedConfig.find(cleanLed => cleanLed.number === led.number)
        if (!cleanedConfig.find(cleanLed => cleanLed.number === led.number)) {
            cleanedConfig.push(led)
            return
        }
        const oldColor = transformHexToRgb(foundLed.color)
        const newColor = transformHexToRgb(led.color)
        const color = Math.max(oldColor.r, newColor.r) * 256 * 256 + Math.max(oldColor.g, newColor.g) * 256 + Math.max(oldColor.b, newColor.b)
        cleanedConfig[cleanedConfig.indexOf(foundLed)] = {
            number: foundLed.number,
            color
        }

    })
    return cleanedConfig
}

const regroupConfig = (ledsConfig) => {
    const regroupedConfig = []

    ledsConfig.forEach(ledConfig => {
        ledConfig.forEach(stickConfig => {
            const found = regroupedConfig.find(el => el.key === stickConfig.key)
            if (!found) {
                regroupedConfig.push(stickConfig)
            } else {
                found.leds = combineLEDs(found.leds, stickConfig.leds)
            }
        })
    })

    return regroupedConfig
}

const transformHexToRgb = (hex) => {
    const b = hex % 256
    const g = (hex - b) / 256 % 256
    const r = ((hex - b) / 256 - g) / 256
    return {
        r, g, b
    }
}

export {
    addColor,
    combineLEDs,
    regroupConfig,
    transformHexToRgb,
    eliminateLEDsConfigRepetition
}