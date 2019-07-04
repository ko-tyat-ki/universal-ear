import { NUMBER_OF_LEDS } from "../configuration/constants"
import { flickerConfig } from '../../../modes_config.json'

const flicker = (sticks, sensors) => {
	const brightColor = {
		r: 0,
		g: 255,
		b: 255
	}

	const offColor = { // get from contants
		r: 34,
		g: 34,
		b: 68
	}

	return sensors.map(sensor => {
		const stick = sticks.find(stick => stick.name === sensor.stick)
		if (!stick) return

		const tension = sensor.tension

		const leds = []

		for (let key = 0; key < NUMBER_OF_LEDS; key++) {
			const ledColor = tension / NUMBER_OF_LEDS * flickerConfig.factor > Math.random()
				? brightColor
				: offColor
			if (ledColor != offColor) {
				leds.push({
					number: key,
					color: ledColor,
				})
			}
		}
		return [{
			key: stick.name,
			leds
		}]
	})
}

export default flicker
