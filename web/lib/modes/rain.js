import { transformHexToRgb } from '../helpers/dataHelpers'

const rain = (sticks, sensors) => {
	const brightColor = {
		r: 200,
		g: 200,
		b: 255
	}
	const offColor = { // get from contants
		r: 34,
		g: 34,
		b: 68
	}

	const reduceBrightness = 25
	return sensors.map(sensor => {
		const stick = sticks.find(stick => stick.name === sensor.column)

		const tension = sensor.tension
		const oldTension = sensor.oldTension
		const numberOfLEDs = stick.numberOfLEDs

		const leds = []

		for (let key = 0; key < numberOfLEDs; key++) {
			let ledColor
			if (key < tension) {
				ledColor = brightColor
			} else if (key < oldTension[3]) {
				ledColor = ReduceBrightnessFunction(brightColor, reduceBrightness)
			} else if (key < oldTension[2]) {
				ledColor = ReduceBrightnessFunction(brightColor, reduceBrightness * 2)
			} else if (key < oldTension[1]) {
				ledColor = ReduceBrightnessFunction(brightColor, reduceBrightness * 3)
			} else if (key < oldTension[0]) {
				ledColor = ReduceBrightnessFunction(brightColor, reduceBrightness * 4)
			}
			else {
				ledColor = offColor
			}

			leds.push({
				number: key,
				//color: { r, g, b }
				color: ledColor
			})
		}
		return [{
			key: stick.name,
			leds
		}]
	})

}

const ReduceBrightnessFunction = (inRGB, reduction) => {
	let outRGB = { r: 0, g: 0, b: 0 }
	outRGB.r = inRGB.r - reduction
	outRGB.g = inRGB.g - reduction
	outRGB.b = inRGB.b - reduction
	return outRGB
}

export default rain
