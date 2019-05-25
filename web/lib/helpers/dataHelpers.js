/* global Math */
/* global ArrayBuffer */
/* global Uint8Array */

const putLedsInBufferArray = (columnLedsConfig, numberOfLeds) => {
    const bufferArray = new ArrayBuffer(numberOfLeds * 3 + 3)
    const ledsBufferArray = new Uint8Array(bufferArray)
    const startByte = 0x10
    const sizeByte = 0x11
    const checkSum = 0x12

    ledsBufferArray[0] = startByte
    ledsBufferArray[1] = sizeByte
    columnLedsConfig.slice(0, numberOfLeds).forEach(led => {
        const rgb = transformHexToRgb(led.color)
        ledsBufferArray[led.number * 3 + 2] = rgb.r
        ledsBufferArray[led.number * 3 + 3] = rgb.g
        ledsBufferArray[led.number * 3 + 4] = rgb.b
    })
    ledsBufferArray[numberOfLeds * 3 + 2] = checkSum
    return ledsBufferArray
}

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


    ledsConfig.filter(Boolean).forEach(ledConfig => {
        ledConfig.filter(Boolean).forEach(stickConfig => {
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
    putLedsInBufferArray,
    eliminateLEDsConfigRepetition
}