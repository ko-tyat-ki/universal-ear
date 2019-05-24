import { getDistance } from '../helpers/getDistance.js'
import * as THREE from '../three/three.js'

const randomEcho = (measurements, sticks, sensors) => {
	return sensors.map((sensor, sensorNumber) => {
		const measurement = measurements.find(measurement => measurement.name === sensor.key)

		return sticks.map((stick, stickNumber) => {
			if (!measurement || measurement.tension <= 0) {
				return
			}

			const distance = getDistance({
				sensorNumber,
				stickNumber
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
				key: stick.name,
				leds
			}
		})
	})
}

export default { randomEcho }
