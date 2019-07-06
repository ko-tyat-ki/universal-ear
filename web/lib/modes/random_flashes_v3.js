import { rainbowColors } from "../helpers/rainbowColors";
import { randomFlashes } from '../../../modes_config.json'
import { NUMBER_OF_LEDS } from "../configuration/constants";

const sensitivity = randomFlashes.sensitivity // the higher - the more sensitive to sensors, 0.02 - balanced
const flashesFrequency_default = randomFlashes.flashesFrequency_default // 0/2000 - balanced
const proportionLEDSAlight_default = randomFlashes.proportionLEDSAlight_default // from 0 to 1, 0.1 - balanced
const flashesFactor = randomFlashes.flashesFactor
const timeParameterFactor = randomFlashes.timeParameterFactor

const random_flashes_v3 = (sticks, sensors) => {

	const sum_tensions = sensors.map(sensor => sensor.tension + sensor.oldTension.reduce((a, b) => a + b, 0)).reduce((a,b) => a + b, 0) / 60

	// Cycle through array of sensors from each stick:
	return sensors.map(sensor => {

		// how to have a sum over all sensors here?
		//const proportionLEDSAlight = Math.max(proportionLEDSAlight_default, sensor.oldTension.reduce((a, b) => a + b, 0) * sensitivity)
		const proportionLEDSAlight = Math.max(proportionLEDSAlight_default, (sensor.tension / 2 + sum_tensions) * sensitivity)
		const flashesFrequency = Math.max(flashesFrequency_default, sensitivity / flashesFactor * sensor.tension)

		// Find a Stick that corresponds to current Sensor
		const stick = sticks.find(stick => stick.name === sensor.stick)
		if (!stick) return

		// Initialise array that will hold the order numbers of LEDs and their colours
		const leds = []

		// Cycle through the keys up to the tension value
		for (let key = 0; key < NUMBER_OF_LEDS; key++) {
			if (Math.random() < proportionLEDSAlight) { // lighting up a stick with a certain probability
				const timeParameter = ((Date.now() * flashesFrequency) + parseInt(stick.name)) % timeParameterFactor

				if (timeParameter < 2) {
					const ledColor = stickLightning(timeParameter)
					//const ledColor = rainbowColors(30000)

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

const stickLightning = (timeParameter) => {
	return {
		r: Math.floor(Math.max(Math.min((2 - timeParameter) * 300 / 2, 255), 0) / 2),
		g: Math.floor(Math.max(Math.min((2 - timeParameter) * 300 / 2, 255), 0)),
		b: Math.floor(Math.max(Math.min((2 - timeParameter) * 300 / 2, 255), 0) / 1.5)
	}
}

export default random_flashes_v3
