import { getDistance } from '../helpers/getDistance.js'
import * as THREE from '../three/three.js'

const tensionAndRandomEcho = (sticks, sensors) => {
	return sensors.map(sensor => {
		const tension = sensor.tension

		if (tension) {
			return sticks.map(stick => {
				const leds = []
				if (sensor && tension >= 0) {
					const numberOfLEDs = stick.numberOfLEDs
					const distance = getDistance({
						sensor,
						stick,
						allSticks: sticks
					})

					if (sensor.isSlowSensor) {
						for (let key = 0; key < tension - 1.5; key++) { // this magic number is from final tension > 1
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
					} else {
						if (sensor.column === stick.name && tension >= 10) {
							[...Array(stick.numberOfLEDs)].map((el, key) => leds.push({
								number: key,
								color: new THREE.Color(`rgba(255, 0, 0)`)
							}))
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

export default tensionAndRandomEcho
