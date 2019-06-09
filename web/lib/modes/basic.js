const basic = (sticks, sensors) => {
	const brightColor = {
		r: 200,
		g: 200,
		b: 255
	}

	return sensors.map(sensor => {
		const stick = sticks.find(stick => stick.name === sensor.column)

		const tension = sensor.tension
		const numberOfLEDs = stick.numberOfLEDs || 40

		const leds = [] // Will be an array of leds (key, colours)

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
