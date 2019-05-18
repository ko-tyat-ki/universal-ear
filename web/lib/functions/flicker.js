const flicker = (measurements, sticks, sensors) => {
	const brightColor = 0x55ffff

	return measurements.map((measurement) => {
		const key = measurement.name

		let sensor = sensors.find(sensor => sensor.key === key)

		const stickKey = sensors.indexOf(sensor)
		const stick = sticks[stickKey]

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
			key: stickKey,
			leds
		}]
	})
}

export default { flicker }
