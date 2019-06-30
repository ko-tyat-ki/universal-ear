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
		const numberOfLEDs = stick.numberOfLEDs

		const leds = []

		for (let key = 0; key < numberOfLEDs; key++) {
			const ledColor = tension / numberOfLEDs > Math.random()
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
