import { simpleRainbow } from "../helpers/rainbowColors";
import { NUMBER_OF_LEDS } from "../configuration/constants";
import { easterEggConfig } from '../../../modes_config.json'

let start
let isGoing = false

const {
	speed, // 150
	duration, // 10 seconds, 30 Seconds of fun! - needs to be 2 times melody
	tensionThreshold, // 10
	activationStickCount // 3
} = easterEggConfig

export const isEasterTriggered = (sensors) => {
	return sensors.filter(sensor => sensor.tension && sensor.tension > tensionThreshold).filter(Boolean).length >= activationStickCount
}

export const easterEggDuration = duration

// в это время играет музыка бенни хилла
export const easterEgg = (sticks, sensors) => {
	if (!isGoing) start = Date.now()
	isGoing = true

	return sticks.map((stick, key) => {
		const leds = []
		const numberOfLeds = Math.floor((Date.now() - start) / speed) % NUMBER_OF_LEDS

		{
			[...Array(numberOfLeds)].map((el, key) => leds.push({
				number: key,
				color: simpleRainbow(key)
			}))
		}

		if (numberOfLeds === NUMBER_OF_LEDS) isGoing = false
		return [
			{
				key: stick.name,
				leds
			}
		]
	})
}
