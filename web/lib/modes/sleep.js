import { randomFlashes2 } from '../../../modes_config.json'
import { rainbowColors } from "../helpers/rainbowColors";
import { NUMBER_OF_LEDS } from "../configuration/constants";

const rainbowLength = randomFlashes2.rainbowLength // rainbow phase in min
const sensitivity = randomFlashes2.sensitivity // the higher - the more sensitive to sensors, 0.02 - balanced
const flashesFrequency_default = randomFlashes2.flashesFrequency_default // 0/2000 - balanced
const proportionLEDSAlight_default = randomFlashes2.proportionLEDSAlight_default // from 0 to 1, 0.1 - balanced
const flashesFactor = randomFlashes2.flashesFactor
const timeParameterFactor = randomFlashes2.timeParameterFactor

const sleep = (sticks, sensors) => {

	// Cycle through array of sensors from each stick:
	return sensors.map(sensor => {

		// how to have a sum over all sensors here?
		const proportionLEDSAlight = Math.max(proportionLEDSAlight_default, sensor.oldTension.reduce((a, b) => a + b, 0) * sensitivity)
		const flashesFrequency = Math.max(flashesFrequency_default, sensitivity / flashesFactor * sensor.tension)

		// Find a Stick that corresponds to current Sensor
		const stick = sticks.find(stick => stick.name === sensor.stick)
		if (!stick) return

		// Initialise array that will hold the order numbers of LEDs and their colours
		const leds = []

		// Cycle through the keys up to the tension value
		if (Math.random() < proportionLEDSAlight) {
			for (let key = 0; key < NUMBER_OF_LEDS; key++) {
				//const timeParameter = ((Date.now() * flashesFrequency) + parseInt(stick.name)) % 10

				//this could be a screensaver!
				const timeParameter = ((Date.now() * flashesFrequency)) % timeParameterFactor
				if (timeParameter < 2) {
					//const ledColor = stickLightning(timeParameter)
					const ledColor = rainbowColors(rainbowLength)

					leds.push({
						number: key,
						color: ledColor
					})
				}
			}
		}

		// Return leds array of a particular stick:
		return [{
			key: stick.name,
			leds
		}]
	})
}

// const stickLightning = (timeParameter) => {
// 	return {
// 		r: Math.floor(Math.max(Math.min((2 - timeParameter) * 300 / 2, 255), 0) / 1.5),
// 		g: Math.floor(Math.max(Math.min((2 - timeParameter) * 300 / 2, 255), 0)),
// 		b: Math.floor(Math.max(Math.min((2 - timeParameter) * 300 / 2, 255), 0) / 3)
// 	}
// }

export default sleep
