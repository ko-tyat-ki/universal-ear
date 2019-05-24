import { getDistance } from '../helpers/getDistance.js'
import * as THREE from '../three/three.js'

const tensionAndRandomEcho = (measurements, sticks, sensors) => {
	return sensors.map((sensor, sensorNumber) => {
		const name = sensor.key

		const measurement = measurements.find(measurement => measurement.name === name)
		const tension = measurement.tension

		if (tension) {
			return sticks.map((stick, stickNumber) => {
				if (!measurement || tension <= 0) {
					return
				}

				const numberOfLEDs = stick.numberOfLEDs
				const distance = getDistance({
					sensorNumber,
					stickNumber
				})

				const leds = []

				for (let key = 0; key <= tension; key++) {
					if (distance === 0) {
						leds.push({
							number: Math.max(sensor.sensorPosition - key, 0),
							color: new THREE.Color(`rgba(${Math.floor(60 + Math.random() * 195)}, ${Math.floor(60 + Math.random() * 195)}, ${Math.floor(60 + Math.random() * 195)})`)
						})
						leds.push({
							number: Math.min(sensor.sensorPosition + key, numberOfLEDs - 1),
							color: new THREE.Color(`rgba(${Math.floor(60 + Math.random() * 195)}, ${Math.floor(60 + Math.random() * 195)}, ${Math.floor(60 + Math.random() * 195)})`)
						})
					} else {
						if (tension > sensor.sensorPosition) {
							let dif = Math.min(Math.floor(tension - sensor.sensorPosition), numberOfLEDs - 1)
							leds.push({
								number: dif,
								color: new THREE.Color(`rgba(${Math.floor(60 + Math.random() * 195)}, ${Math.floor(60 + Math.random() * 195)}, ${Math.floor(60 + Math.random() * 195)})`)
							})
						}
						if (tension > numberOfLEDs - sensor.sensorPosition) {
							let dif = Math.min(Math.floor(tension - numberOfLEDs + sensor.sensorPosition), numberOfLEDs - 1)
							leds.push({
								number: numberOfLEDs - 1 - dif,
								color: new THREE.Color(`rgba(${Math.floor(60 + Math.random() * 195)}, ${Math.floor(60 + Math.random() * 195)}, ${Math.floor(60 + Math.random() * 195)})`)
							})
						}
					}
				}

				return {
					key: stick.name,
					leds
				}
			})
		}
	})
}

export default { tensionAndRandomEcho }
