const basic = (measurements, sticks, sensors) => {
	const brightColor = 0x55ffff

	return measurements.map((measurement) => {
		const name = measurement.name

		const sensor = sensors.find(sensor => sensor.key === name)
		const stick = sticks.find(stick => stick.name === sensor.column)

		const tension = measurement.tension
		const numberOfLEDs = stick.numberOfLEDs || 40

		const leds = []

		for (let key = 0; key < tension; key++) {
			leds.push({
				number: Math.max(sensor.sensorPosition - key, 0),
				color: brightColor
			})

			leds.push({
				number: Math.min(sensor.sensorPosition + key, numberOfLEDs - 1),
				color: brightColor
			})
		}

		return [{
			key: stick.name,
			leds
		}]
	})
}

export default basic
