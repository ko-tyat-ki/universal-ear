/* global Math */
/* global ArrayBuffer */
/* global Uint8Array */

// Takes leds data for one stick, puts it into Byte array to be sent to certain Arduino
const putLedsInBufferArray = (columnLedsConfig, numberOfLeds) => {
    const bufferArray = new ArrayBuffer(numberOfLeds * 3 + 3)
    const ledsBufferArray = new Uint8Array(bufferArray)
    const startByte = 0x10
    const sizeByte = 0x11
    const checkSum = 0x12

    ledsBufferArray[0] = startByte
    ledsBufferArray[1] = sizeByte
    columnLedsConfig.slice(0, numberOfLeds).forEach(led => {
        const rgb = led.color
        ledsBufferArray[led.number * 3 + 2] = rgb.r
        ledsBufferArray[led.number * 3 + 3] = rgb.g
        ledsBufferArray[led.number * 3 + 4] = rgb.b
    })
    ledsBufferArray[numberOfLeds * 3 + 2] = checkSum
    return ledsBufferArray
}

const addColor = (ledOne, ledTwo) => {
    return {
        r: Math.min(ledOne.r + ledTwo.r, 255),
        g: Math.min(ledOne.g + ledTwo.g, 255),
        b: Math.min(ledOne.b + ledTwo.b, 255)
    }
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
        const oldColor = foundLed.color
        const newColor = led.color
        const color = {
            r: Math.max(oldColor.r, newColor.r),
            g: Math.max(oldColor.g, newColor.g),
            b: Math.max(oldColor.b, newColor.b)
        }
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
                found.leds = combineLEDs([...found.leds], stickConfig.leds)
            }
        })
    })

    return regroupedConfig
}

const getInfoFromSensors = (data) => {
    const received = data.split('\t')

    if (received && received.length > 2) {
        return {
            fast: received[0].split('! ')[1] || received[0].split(', ')[1],
            slow: received[1]
        }
    }
}

export {
    addColor,
    combineLEDs,
    regroupConfig,
    putLedsInBufferArray,
    getInfoFromSensors,
    eliminateLEDsConfigRepetition
}