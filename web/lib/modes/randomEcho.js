import { getDistance } from '../helpers/getDistance.js'
import * as THREE from '../three/three.js'

const randomEcho = (sticks, sensors) => {
	return sensors.map(sensor => {
		return sticks.map(stick => {
			if (!sensor || sensor.tension <= 0) return

			const distance = getDistance({
				sensor,
				stick,
				allSticks: sticks
			})

			const leds = []

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
