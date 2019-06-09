import { transformHexToRgb } from '../helpers/dataHelpers'

const rain = (sticks, sensors) => {
	const brightColor = {
		r: 200,
		g: 200,
		b: 255
	}

	const reduceBrightness = 50
	return sensors.map(sensor => {
		const stick = sticks.find(stick => stick.name === sensor.column)

		const tension = sensor.tension
		const oldTension = sensor.oldTension
		const numberOfLEDs = stick.numberOfLEDs

		const leds = []

		for (let key = 0; key < numberOfLEDs; key++) {
			let r1, r2, g1, g2, b1, b2
			if (key < tension) {
				r1 = brightColor.r
				g1 = brightColor.g
				b1 = brightColor.b
			}

			if (key < oldTension) {
				r2 = brightColor.r - reduceBrightness
				g2 = brightColor.g - reduceBrightness
				b2 = brightColor.b - reduceBrightness
			}

			leds.push({
				number: key,
				color: {
					r: Math.min(r1, r2),
					g: Math.min(g1, g2),
					b: Math.min(b1, b2)
				}
			})
		}
		return [{
			key: stick.name,
			leds
		}]
	})
}

export default rain
