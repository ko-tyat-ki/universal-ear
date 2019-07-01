import { basicWithRainbow } from '../../../modes_config.json'
import { rainbowColors } from "../helpers/rainbowColors";
import { NUMBER_OF_LEDS } from '../configuration/constants.js';

// Function of STICKS (initial properties of the sticks, i.e. position, names, etc.) and SENSORS (sensor data, the sticks they are connected etc.)
// Returns a large array of all LED colours of all the STICKS

// This particular function linearly depends on the tension of the sensor, i.e. the number of LEDs that will be turned ON linearly depends on the tension
const basic_with_rainbow = (sticks, sensors) => {

	// Cycle through array of sensors from each stick:
	return sensors.map(sensor => {
		// Find a Stick that corresponds to current Sensor
		const stick = sticks.find(stick => stick.name === sensor.stick)
		if (!stick) return

		// Get tension of current sensor
		const tension = sensor.tension

		const leds = [] // Will be an array of leds (key, colours)

		// Cycle through the keys up to the tension value
		for (let key = 0; key < tension; key++) {

			const rainbowColor = rainbowColors(basicWithRainbow.rainbowLength * basicWithRainbow.rainbowTime) // rainbow phase in min
			// LEDs start "running" from a particular point on the led-strip (a "sensorPosition") in both directions.
			// Add the lit LEDs to the array "leds":
			leds.push({
				number: Math.max(sensor.sensorPosition - key, 0),
				color: rainbowColor
			})

			leds.push({
				number: Math.min(sensor.sensorPosition + key, NUMBER_OF_LEDS - 1),
				color: rainbowColor
			})
		}

		// Return leds array of a particular stick:
		return [{
			key: stick.name,
			leds
		}]
	})
}

export default basic_with_rainbow
