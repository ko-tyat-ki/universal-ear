import { getDistance } from '../helpers/getDistance.js'

const randomEcho = (measurements, columns, arduinos) => {
	const names = columns.map(c => c.columnName)

	const findMeasurement = (meas, key) => {
		for (let m in meas) {
			if (meas[m].name == key) return meas[m]
		}
	}

	return arduinos.map(arduino => {
		const name = arduino.key

		const measurement = findMeasurement(measurements, name)

		return columns.map(column => {
			if (!measurement || measurement.tension <= 0) {
				return
			}

			const distance = getDistance({
				arduino,
				column,
				names
			})

			const leds = []

			for (let key = 0; key < column.numberOfLEDs; key++) {
				const colorIntensity = parseInt(255 * Math.random())
				const color = `rgba(15, ${colorIntensity}, 200, ${1 / (distance + 1)})`
				leds.push({
					number: key,
					color: color
				})
			}

			return {
				name: column.columnName,
				leds,
			}
		})
	})
}

export default { randomEcho }
