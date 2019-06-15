import { getDistance } from '../helpers/getDistance.js'

// Function that increases brigthness of a stick with tension and then some lights travel to other poles.
const randomEcho = (sticks, sensors) => {
	// Cycle through sensors:
	return sensors.map(sensor => {
		// Cycle through sticks:
		return sticks.map(stick => {
			if (!sensor || sensor.tension <= 0) return

			// Get the distance between the Sensor and each stick in the structure
			const distance = getDistance({
				sensor,
				stick,
				allSticks: sticks
			})

			const leds = []

			// The further the stick is from the structure, the less the intensity of the "echo"
			for (let key = 0; key < stick.numberOfLEDs; key++) {
				const colorIntensity = parseInt(255 * Math.random())
				leds.push({
					number: key,
					color: {
						r: Math.floor(15 / (distance / 244 + 1)),
						g: Math.floor(colorIntensity / (distance / 244 + 1)),
						b: Math.floor(200 / (distance / 244 + 1))
					}
				})
			}

			return {
				key: stick.name,
				leds
			}
		})
	})
}

export default randomEcho
