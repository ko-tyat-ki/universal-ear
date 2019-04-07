import { getDistance } from '../helpers/getDistance.js'

const tensionAndRandomEcho = (measurements, columns, arduinos) => {
	const names = columns.map(c => c.columnName)

	const findMeasurement = (meas, key) => {
		for (let m in meas) {
			if (meas[m].name == key) return meas[m]
		}
	}
	return arduinos.map(arduino => {
		const name = arduino.key

		const measurement = findMeasurement(measurements, name)
		const tension = measurement.tension

		if (tension) {
			return columns.map(column => {
				if (!measurement || tension <= 0) {
					return
				}

				const numberOfLEDs = column.numberOfLEDs
				const distance = getDistance({
					arduino,
					column,
					names
				})

				const leds = []

				for (let key = 0; key <= tension; key++) {
					if (distance === 0) {
						leds.push({
							number: Math.max(arduino.sensorPosition - key, 0),
							color: `rgba(${60 + Math.random() * 195}, ${60 + Math.random() * 195}, ${60 + Math.random() * 195}, 1 )`
						})
						leds.push({
							number: Math.min(arduino.sensorPosition + key, numberOfLEDs - 1),
							color: `rgba(${60 + Math.random() * 195}, ${60 + Math.random() * 195}, ${60 + Math.random() * 195}, 1 )`
						})
					} else {
						if (tension > arduino.sensorPosition) {
							let dif = Math.min(Math.floor(tension - arduino.sensorPosition), numberOfLEDs - 1)
							leds.push({
								number: dif,
								color: `rgba(${60 + Math.random() * 195}, ${60 + Math.random() * 195}, ${60 + Math.random() * 195}, 1 )`
							})
						}
						if (tension > numberOfLEDs - arduino.sensorPosition) {
							let dif = Math.min(Math.floor(tension - numberOfLEDs + arduino.sensorPosition), numberOfLEDs - 1)
							leds.push({
								number: numberOfLEDs - 1 - dif,
								color: `rgba(${60 + Math.random() * 195}, ${60 + Math.random() * 195}, ${60 + Math.random() * 195}, 1 )`
							})
						}
					}
				}

				return {
					name: column.columnName,
					leds
				}
			})
		}
	})
}

export default { tensionAndRandomEcho }
