
const find = (stack, needle, key = "key") => {
  for (let idx in stack) {
    let item = stack[idx]
    if (item[key] == needle) {
      return item
    }
  }
}

const flicker = (measurements, columns, arduinos) => {
  const brightColor = '#88b'

  return measurements.map((measurement) => {
    const key = measurement.name

    let column = find(columns, key, 'columnName')

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
    return [{
      "name": key,
      "leds": leds,
    }]
  })
}

export default { flicker }
