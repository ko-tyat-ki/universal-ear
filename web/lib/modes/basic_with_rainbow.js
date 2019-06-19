// Function of STICKS (initial properties of the sticks, i.e. position, names, etc.) and SENSORS (sensor data, the sticks they are connected etc.)
// Returns a large array of all LED colours of all the STICKS

const brightColor = {r: 255, g: 255, b: 255}
const offColor = {r: 34, g: 34, b: 68}

// This particular function linearly depends on the tension of the sensor, i.e. the number of LEDs that will be turned ON linearly depends on the tension
const basic_with_rainbow = (sticks, sensors) => {

	// Cycle through array of sensors from each stick:
	return sensors.map(sensor => {
		// Find a Stick that corresponds to current Sensor
		const stick = sticks.find(stick => stick.name === sensor.column)

		// Get tension of current sensor
		const tension = sensor.tension
		const numberOfLEDs = stick.numberOfLEDs || 40 // at the moment we are using 40 LEDs

		const leds = [] // Will be an array of leds (key, colours)

		// Cycle through the keys up to the tension value
		for (let key = 0; key < tension; key++) {

			const rainbowColor = rainbowColors(parseInt(stick.name))
			// LEDs start "running" from a particular point on the led-strip (a "sensorPosition") in both directions.
			// Add the lit LEDs to the array "leds":
			leds.push({
				number: Math.max(sensor.sensorPosition - key, 0),
				color: rainbowColor
			})

			leds.push({
				number: Math.min(sensor.sensorPosition + key, numberOfLEDs - 1),
				color: rainbowColor
			})
		}

		// Return leds array of a particular stick:
		return [{
			key: stick.name,
			leds
		}]
	})
}

const rainbowColors = (stickFactor) => {

	const steps = 7 // number of steps in the rainbow logic
	const colorChangeSpeed = 1 / 5000
	// cycle length is steps / colorChangeSpeed * 1000
	// stickFactor is needed to put different sticks into different phases of Rainbow Cycle
	const timeParameter = (Date.now() * colorChangeSpeed + stickFactor) % steps
	let outRGB = { r: 0, g: 0, b: 0 }

	if (timeParameter < 1)
		outRGB.r = timeParameter * 246
	else if (timeParameter < 3) {
		outRGB.r = 246
		outRGB.g = (timeParameter - 1) * 240 / 2 // through 2 as this step is 2 times longer
	}
	else if (timeParameter < 4) {
		outRGB.r = 246 - (timeParameter - 3) * 166 // 166 = 246 - 80
		outRGB.g = 246
		outRGB.g = (timeParameter - 3) * 80
	}
	else if (timeParameter < 5) {
		outRGB.r = 80 - (timeParameter - 4) * 25 // 25 = 80 - 55
		outRGB.g = 246 - (timeParameter - 4) * 115 // 246 - 131
		outRGB.g = 80 + (timeParameter - 4) * 175 // 255 - 80
	}
	else if (timeParameter < 6) {
		outRGB.r = 70 - (timeParameter - 5) * 10 // 10 = 80 - 70
		outRGB.g = 115 - (timeParameter - 5) * 95 // 115 - 20
		outRGB.g = 170 - (timeParameter - 5) * 85 // 255 - 170
	}
	else { // if (timeParameter < 7) {
		outRGB.r = 70 - (timeParameter - 5) * 10 // 10 = 80 - 70
		outRGB.g = 115 - (timeParameter - 5) * 95 // 115 - 20
		outRGB.g = 170 - (timeParameter - 5) * 85 // 255 - 170
	}

	return outRGB
}

export default basic_with_rainbow
