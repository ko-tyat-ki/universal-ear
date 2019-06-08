let ledsPersistent = []

const rain = (sticks, sensors) => {
	const brightColor = 0x55ffff

	return sensors.map(sensor => {
		const stick = sticks.find(stick => stick.name === sensor.column)

		const tension = sensor.tension
		const numberOfLEDs = stick.numberOfLEDs

		const leds = []

		for (let key = 0; key < numberOfLEDs; key++) {
			const ledColor = tension / numberOfLEDs > Math.random()
				? brightColor
				: 0x222222

			leds.push({
				number: key,
				color: ledColor
			})
		}
		return [{
			key: stick.name,
			leds
		}]
	})
}

export default rain
