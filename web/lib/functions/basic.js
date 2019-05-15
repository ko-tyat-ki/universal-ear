import { Leds, Led } from "./../classes/Led"

const maxTension = 1000
const minTension = 0

const noColor = new Led(0, 0, 0)
const brightColor = new Led(136, 136, 187)

const basic = (measurements, devices) => {
  // measurement = { value: '321', sensor: '0', "ledCount": 40, diffFast: '3', diffSlow: '-2' } }

  // console.log(measurements, devices)

  let output = {}

  devices.forEach(device => {
    let measurement = measurements[device]

    if (!measurement) return

    let ledCount = parseInt(measurement.ledCount)
    let tension = parseFloat(measurement.value)

    let relativeTension = (tension / (maxTension - minTension))
    let ledsToLightUp = ledCount * relativeTension
    let middleLedIndex = Math.round(ledCount / 2)

    let leds = Leds.fill(ledCount, noColor)

    for (let i = 0; i < ledCount; i++) {
      if (Math.abs(i - middleLedIndex) < ledsToLightUp / 2) {
        leds.set(i, brightColor)
      }
    }

    output[devices] = leds
  })

  return output
}

export { basic as default }
