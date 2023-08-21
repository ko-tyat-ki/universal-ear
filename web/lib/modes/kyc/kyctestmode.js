import chroma from "chroma-js"

const kyctest = (sticks, sensors) => {
  return sensors.map(sensor => {
    const stick = sticks.find(stick => stick.name === sensor.stick)
    if (!stick) return
    const leds = []
    for (let i = 0; i < stick.numberOfLEDs; i++) {
      let chromRGB = chroma.random().rgb();
      leds.push({
        number: i,
        color: {r: chromRGB[0], g: chromRGB[1], b: chromRGB[2] }
      })
    }

    return [{
      key: stick.name,
      leds
    }]
  })
}

export default kyctest