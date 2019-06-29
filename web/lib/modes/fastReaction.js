const tensionAndRandomEcho = (sticks, sensors) => {
    const superBrightColor = {
        r: 255,
        g: 0,
        b: 0
    }

    return sensors.map(sensor => {
        const stick = sticks.find(stick => stick.name === sensor.stick)
        if (!stick) return
        const tension = sensor.tension
        const numberOfLEDs = stick.numberOfLEDs || 40

        const leds = []

        if (!sensor.isSlowSensor && sensor.stick === stick.name && tension >= 10) {
            [...Array(numberOfLEDs)].map((el, key) => leds.push({
                number: key,
                color: superBrightColor
            }))

        }

        return [{
            key: stick.name,
            leds
        }]
    })
}

export default tensionAndRandomEcho
