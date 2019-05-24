const basic = (measurements, sticks, sensors) => {
	const brightColor = 0x55ffff

	return measurements.map((measurement) => {
		const key = measurement.name

		const sensor = sensors.find(sensor => sensor.key === key)

		const stickKey = sensors.indexOf(sensor)
		const stick = sticks[stickKey]

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
			key: stickKey,
			leds
		}]
	})
}

export default { basic }
