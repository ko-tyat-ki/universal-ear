import {getDistance} from '../helpers/getDistance.js'


const randomEcho = (measurements, columns, arduinos) => {
  const names = Object.keys(columns)
  const brightColor = '#88b'

  const findMeasurement = (meas, key) => {
    for (let m in meas) {
      if (meas[m].name == key) return m
    }
  }


  Object.values(arduinos).map(arduino => {
    let name = arduino.key

    const measurement = findMeasurement(measurements, name)

    if (!measurement) {
      return {
        "name": name,
        "leds": [],
      }
    }

    Object.values(columns).map(column => {
      const distance = getDistance({
        arduino,
        column,
        names
      })

      const leds = []

      for (let key = 0; key < column.numberOfLEDs; key++) {
        const colorIntensity = parseInt(255 * Math.random())
        const color = `rgba(15, ${colorIntensity}, 200, ${1/(distance + 1)})`
        leds.push({
          number: key,
          color: color
        })
      }

      column.colorLeds(leds)
    })
  })
}

export default {randomEcho}