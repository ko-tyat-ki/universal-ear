import tinycolor from "tinycolor2";

const kyctest = (sticks, sensors) => {
  return sensors.map(sensor => {
    const stick = sticks.find(stick => stick.name === sensor.stick)
    if (!stick) return
    const leds = []
    for (let i = 0; i < stick.numberOfLEDs; i++) {
      leds.push({
        number: i,
        color: tinycolor.random().toRgb()
      })
    }

    return [{
      key: stick.name,
      leds
    }]
  })
}

export default kyctest