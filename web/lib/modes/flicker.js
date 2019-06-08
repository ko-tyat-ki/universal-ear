const flicker = (sticks, sensors) => {
	const brightColor = 0xffeeee

	return sensors.map(sensor => {
		const stick = sticks.find(stick => stick.name === sensor.column)

		const tension = sensor.tension
		const numberOfLEDs = stick.numberOfLEDs

		const leds = []

		for (let key = 0; key < numberOfLEDs; key++) {
			const ledColor = tension / numberOfLEDs > Math.random()
				? brightColor
				: 0x222244

			leds.push({
				number: key,
				color: ledColor,
			})
		}
		return [{
			key: stick.name,
			leds
		}]
	})
}

export default flicker
