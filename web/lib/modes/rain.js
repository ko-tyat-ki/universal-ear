import { transformHexToRgb } from '../helpers/dataHelpers'

const rain = (sticks, sensors) => {
	const brightColor = {
		r: 200,
		g: 200,
		b: 255
	}
	const rainColor = {
		r: 100,
		g: 100,
		b: 130
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
			//let ledColor = GrowGradually(key, tension, oldTension, brightColor, offColor, reduceBrightness)
			let timeValue = Date.now()
			let speed = 0.01
			let displace = tension * 0.5
			let ledColor = MoveWithTime(key, timeValue, displace, numberOfLEDs, rainColor, offColor, speed, tension)
			leds.push({
				number: key,
				color: ledColor
			})
		}
		return [{
			key: stick.name,
			leds
		}]
	})

}
const MoveWithTime = (key, timeValue, displace, num, bright, dark, speed, tension) => {
	let ledColor
	let pos = (num - speed * timeValue % num)// - displace)
	if (pos > num) pos -= num
	if (pos < 0) pos += num
	let ten = 0
	if (tension) ten = parseInt(tension) 
	const outColor = {
		r: dark.r + ten * 6 < 255
			? dark.r + ten * 6
			: 255,
		g: dark.g,
		b: dark.b
	}
	if (key < pos + 3 && key > pos - 3) {
		ledColor = bright
	} else if (key < pos + 6 && key > pos - 6) {
		ledColor = ReduceBrightnessFunction(bright, 30)
	} else
	{
		ledColor = outColor
	}
	return ledColor
}


const ReduceBrightnessFunction = (inRGB, reduction) => {
	let outRGB = { r: 0, g: 0, b: 0 }
	outRGB.r = inRGB.r - reduction
	outRGB.g = inRGB.g - reduction
	outRGB.b = inRGB.b - reduction
	return outRGB
}

const GrowGradually = (key, tension, oldTension, onCol, offCol, reduceBright) => {
	let ledColor
	if (key < tension) {
		ledColor = onCol
	} else if (key < oldTension[3]) {
		ledColor = ReduceBrightnessFunction(onCol, reduceBright)
	} else if (key < oldTension[2]) {
		ledColor = ReduceBrightnessFunction(onCol, reduceBright * 2)
	} else if (key < oldTension[1]) {
		ledColor = ReduceBrightnessFunction(onCol, reduceBright * 3)
	} else if (key < oldTension[0]) {
		ledColor = ReduceBrightnessFunction(onCol, reduceBright * 4)
	}
	else {
		ledColor = offCol
	}
	return ledColor
}

export default rain
