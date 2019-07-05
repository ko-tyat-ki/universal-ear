import { changingColors } from '../../../modes_config.json'
import { NUMBER_OF_LEDS } from "../configuration/constants";

// Function of STICKS (initial properties of the sticks, i.e. position, names, etc.) and SENSORS (sensor data, the sticks they are connected etc.)
// Returns a large array of all LED colours of all the STICKS

const startTime = Date.now()

// This particular function linearly depends on the tension of the sensor, i.e. the number of LEDs that will be turned ON linearly depends on the tension
const changing_colors = (sticks, sensors) => {

	// Cycle through array of sensors from each stick:
	return sensors.map(sensor => {

		// Find a Stick that corresponds to current Sensor
		const stick = sticks.find(stick => stick.name === sensor.stick)
		if (!stick) return

		// Get tension of current sensor
		const tension = sensor.tension
		const oldTension = sensor.oldTension

		let tension_parameter = oldTension.reduce((a, b) => a + b, 0) // summing up old tension
		tension_parameter = tension_parameter + tension * changingColors.colorChangingSpeed // adding current tension
		tension_parameter = tension_parameter / changingColors.maxTension // scaling down to the number between 0 and 1
		//console.log(tension_parameter)

		// Initialise array that will hold the order numbers of LEDs and their colours
		const leds = []

		// Cycle through the keys up to the tension value
		for (let key = 0; key < NUMBER_OF_LEDS; key++) {
			let ledColor

			ledColor = ReduceBrightnessFunction(tension_parameter)

			leds.push({
				number: key,
				//color: { r, g, b }
				color: ledColor
			})

		}

		//console.log(leds.color)

		// Return leds array of a particular stick:
		return [{
			key: stick.name,
			leds
		}]
	})
}

const ReduceBrightnessFunction = (tension_parameter) => {
	// adding shimmering - the default boundary gets unstable
	const offColor = { // get from contants
		r: changingColors.defaultColor[0] + (Math.random() - 0.5) * changingColors.defaultMult,
		g: changingColors.defaultColor[1] + (Math.random() - 0.5) * changingColors.defaultMult,
		b: changingColors.defaultColor[2] + (Math.random() - 0.5) * changingColors.defaultMult
	}

	// bad coding creating different colour fainting schemes :)
	let aa
	let bb
	let cc
	const colour_case = ((Date.now() - startTime) / changingColors.reduceBrightnessFunctionTime) % changingColors.colorChangingSpeed

	if (colour_case < changingColors.colorChangingSpeed % 3) {
		aa = 1
		bb = 0.6
		cc = 0.3
	}
	else if (colour_case < changingColors.colorChangingSpeed % (3/2)) {
		aa = 0.3
		bb = 0.6
		cc = 1
	}
	else {
		aa = 0.3
		bb = 1
		cc = 0.6
	}
	//console.log(colour_case)
	

	// tension parameter shall be calibrated to be a number between 0 and 1
	const a = Math.min(1, Math.max(0, tension_parameter - aa)) * 255
	const b = Math.min(1, Math.max(0, tension_parameter - bb)) * 255
	const c = Math.min(1, Math.max(0, tension_parameter - cc)) * 255

	let outRGB = { r: 0, g: 0, b: 0 }
	// minmax - boundaries for color change
	outRGB.r = Math.max(Math.min(a, 255), offColor.r)
	outRGB.g = Math.max(Math.min(b, 255), offColor.g)
	outRGB.b = Math.max(Math.min(c, 255), offColor.b)
	return outRGB
}

export default changing_colors
