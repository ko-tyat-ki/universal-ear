const flicker = (measurements, sticks, sensors) => {
	const brightColor = 0x55ffff

	return measurements.map((measurement) => {
		const name = measurement.name

		const sensor = sensors.find(sensor => sensor.key === name)
		const stick = sticks.find(stick => stick.name === sensor.column)

		const tension = measurement.tension
		const numberOfLEDs = stick.numberOfLEDs

		const leds = []

		for (let key = 0; key < numberOfLEDs; key++) {
			const ledColor = tension / numberOfLEDs > Math.random()
				? brightColor
				: 0x222222

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
