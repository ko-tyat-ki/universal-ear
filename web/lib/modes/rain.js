import {transformHexToRgb} from '../helpers/dataHelpers'

const rain = (sticks, sensors) => {

	const brightColor = 0x55ffff
	const brightColorRGB = transformHexToRgb(brightColor)
	const reduceBrightness = 0
	return sensors.map(sensor => {
		const stick = sticks.find(stick => stick.name === sensor.column)
		console.log(stick.StickLEDs[0].material.color)

		const tension = sensor.tension
		const numberOfLEDs = stick.numberOfLEDs

		const leds = []
		

		for (let key = 0; key < numberOfLEDs; key++) {
			//const ledColor = tension / numberOfLEDs > Math.random()
			//	? brightColor
			//	: 0x222222
			let ledColor1
			const ledColorPrevious = stick.StickLEDs[key].materials[0].color
			let red, green, blue
			if (key < tension) {
				red = brightColorRGB.r
				green = brightColorRGB.g
				blue = brightColorRGB.b
			} else {
				const previousColor = transformHexToRgb(ledColorPrevious)
				red = previousColor.r - reduceBrightness
				green = previousColor.g - reduceBrightness
				blue = previousColor.b - reduceBrightness
				
			}

			ledColor1 = RGB2HTML(red, green, blue)

			leds.push({
				number: key,
				color: ledColor1
			})
		}
		//console.log(leds[0])
		return [{
			key: stick.name,
			leds
		}]
	})
}

function RGB2HTML(red, green, blue) {
	var decColor = 0x1000000 + blue + 0x100 * green + 0x10000 * red;
	return decColor;
}

export default rain
