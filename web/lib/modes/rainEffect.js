let timeIndex = 40

const rainEffect = (measurements, sticks, sensors) => {
	const brightColor = 0x55ffff
	// WHY DO WE HAVE MEASUREMENTS AND SENSORS? WHAT IS THE DIFFERENCE?
	
	return sensors.map(sensor => {
		const measurement = measurements.find(measurement => measurement.name === sensor.key)
		timeIndex -= measurement.tension / 20
		if (timeIndex < 0) timeIndex = 40
		return sticks.map(stick => {
			if (!measurement || measurement.tension <= 20) {
				return
			}

			const leds = []

			//for (let key = 0; key < stick.numberOfLEDs; key++) {
			//	const colorIntensity = parseInt(255 * Math.random())
			//	const rgbColor = `rgba(${Math.floor(15 / (distance / 244 + 1))}, ${Math.floor(colorIntensity / (distance / 244 + 1))}, ${Math.floor(200 / (distance / 244 + 1))})`
			//	const color = new THREE.Color(rgbColor)
			leds.push({
				number: timeIndex,
				color: brightColor
			})
			//}

			return {
				key: stick.name,
				leds
			}
		})
	})
}

export default { rainEffect }
