let noColor = {r: 0, g: 0, b: 0};

const sleep = (sticks, sensors) => {

  return sensors.map(sensor => {
    const stick = sticks.find(stick => stick.name === sensor.stick)
    if (!stick) return

    const numberOfLEDs = stick.numberOfLEDs || 40
    const leds = []

    for (let key = 0; key < numberOfLEDs; key++) {
      leds.push({
        number: key,
        color: noColor
      })
    }

    return [{
      key: stick.name,
      leds
    }]
  })
}

export default sleep
