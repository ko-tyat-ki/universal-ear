const flicker = (measurements, columns, arduinos) => {
  const brightColor = '#88b'

  return measurements.map((measurement) => {
    const key = measurement.name

    let column = columns[key]

    const tension = measurement.tension
    const numberOfLEDs = column.numberOfLEDs

    const leds = []

    for (let key = 0; key < numberOfLEDs; key++) {
      const ledColor = tension / numberOfLEDs > Math.random()
        ? brightColor
        : '#222'

      leds.push({
        number: key,
        color: ledColor,
      })
    }
    return {
      "name": key,
      "leds": leds,
    }
  })
}

export default { flicker }
