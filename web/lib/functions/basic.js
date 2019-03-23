const basic = (measurements, columns, arduinos) => {
  const brightColor = "#88b"

  return measurements.map((measurement) => {
    const key = measurement.name

    let column = columns[key]
    let arduino = arduinos[key]

    const tension = measurement.tension
    const numberOfLEDs = column.numberOfLEDs

    const leds = []

    for (let key = 0; key < Math.min(tension, numberOfLEDs / 2); key++) {
      leds.push({
        number: Math.max(arduino.sensorPosition - key, 0),
        color: brightColor
      })

      leds.push({
        number: Math.min(arduino.sensorPosition + key, numberOfLEDs - 1),
        color: brightColor
      })
    }

    // if (leds.length == 0) {
    //   return
    // }

    return {
      "name": key,
      "leds": leds,
    }
  })
}

export default {basic}