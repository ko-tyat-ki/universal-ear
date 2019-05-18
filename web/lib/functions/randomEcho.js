import { getDistance } from '../helpers/getDistance.js'
import * as THREE from '../three/three.js'

const randomEcho = (measurements, sticks, sensors) => {
	const names = sensors.map(sensor => sensor.key)

	return sensors.map(sensor => {
		const name = sensor.key

		const measurement = measurements.find(measurement => measurement.name === name)

		return sticks.map((stick, key) => {
			if (!measurement || measurement.tension <= 0) {
				return
			}

			const distance = getDistance({
				sensor,
				stick,
				names
			})

			const leds = []

			for (let key = 0; key < stick.numberOfLEDs; key++) {
				const colorIntensity = parseInt(255 * Math.random())
				const rgbColor = `rgba(${Math.floor(15 / (distance + 1))}, ${Math.floor(colorIntensity / (distance + 1))}, ${Math.floor(200 / (distance + 1))})`
				const color = new THREE.Color(rgbColor)
				leds.push({
					number: key,
					color
				})
			}

			return {
				key: sensors.indexOf(sensors[key]),
				leds
			}
		})
	})
}

export default { randomEcho }
