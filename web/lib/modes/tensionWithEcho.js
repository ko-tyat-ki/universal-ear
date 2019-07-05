import { getDistance } from '../helpers/getDistance.js'
import { tensionWithEchoConfig } from '../../../modes_config.json'
import {NUMBER_OF_LEDS} from "../configuration/constants";

const numberOfRandomness = 1000

const randomGenerator = [...Array(numberOfRandomness)].map(row => (
    [...Array(NUMBER_OF_LEDS)].map(color => (
        {
            r: Math.floor(60 + Math.random() * 195),
            g: Math.floor(60 + Math.random() * 195),
            b: Math.floor(60 + Math.random() * 195)
        }
    ))
))

let count = 0

const getRandom = (key) => {
	count++

	if (count >= numberOfRandomness - 1) count = 0

	return randomGenerator[count][key]
}


const tensionWithEcho = (sticks, sensors) => {
	return sensors.map(sensor => {
		const tension = sensor.tension

		return sticks.map(stick => {
			const leds = []
			if (sensor && tension >= 0) {
				const numberOfLEDs = stick.numberOfLEDs
				const distance = getDistance({
					sensor,
					stick,
					allSticks: sticks
				})

				for (let key = 0; key < tension - tensionWithEchoConfig.tensionTreshold; key++) { // this magic number is from final tension > 1
					if (distance === 0) {

						leds.push({
							number: Math.max(sensor.sensorPosition - key, 0),
							color: getRandom(key),
						})
						leds.push({
							number: Math.min(sensor.sensorPosition + key, numberOfLEDs - 1),
							color: getRandom(key),
						})
					} else {
						if (tension > sensor.sensorPosition) {
							let dif = Math.min(Math.floor(tension - sensor.sensorPosition), numberOfLEDs - 1)
							leds.push({
								number: dif,
								color: getRandom(key),
							})
						}
						if (tension > numberOfLEDs - sensor.sensorPosition) {
							let dif = Math.min(Math.floor(tension - numberOfLEDs + sensor.sensorPosition), numberOfLEDs - 1)
							leds.push({
								number: numberOfLEDs - 1 - dif,
								color: getRandom(key),
							})
						}
					}
				}
			}

			return {
				key: stick.name,
				leds
			}
		})
	})
}

export default tensionWithEcho
