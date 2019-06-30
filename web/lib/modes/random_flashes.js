// Function of STICKS (initial properties of the sticks, i.e. position, names, etc.) and SENSORS (sensor data, the sticks they are connected etc.)
// Returns a large array of all LED colours of all the STICKS

const brightColor = { r: 255, g: 255, b: 255 }
const offColor = { r: 34, g: 34, b: 68 }

const numberOfLEDs = 40

const random_flashes = (sticks, sensors) => {

	let flashesFrequency = 1 / 5000
	let proportionSticksAlight = 1 / 10 // from 0 to 1

	//const stickAlight = Math.floor((Math.random() * 10) % 10) //randomly choosing a stick to alight (multiple are possible at the same time)
	//const stickAlight = Math.floor((Date.now() * flashesFrequency) % (1/proportionSticksAlight)) + 1 //choosing one at a time

	// Cycle through array of sensors from each stick:
	return sensors.map(sensor => {

		proportionSticksAlight = Math.max(1 / 10, sensor.oldTension.reduce((a, b) => a + b, 0) / 50)
		flashesFrequency = Math.max(1 / 2000, 1 / 1000 * sensor.tension)

		// console.log(proportionSticksAlight, flashesFrequency)

		//const stickAlight = Math.floor((Math.random() * 10) % 10) //randomly choosing a stick to alight (multiple are possible at the same time)
		//const stickAlight = Math.floor((Date.now() * flashesFrequency) % (1/proportionSticksAlight)) + 1 //choosing one at a time

		// Find a Stick that corresponds to current Sensor
		const stick = sticks.find(stick => stick.name === sensor.stick)
		if (!stick) return

		//only doing smth to stick to be alight
		if (!stick) return

		// Initialise array that will hold the order numbers of LEDs and their colours
		const leds = []

		// Cycle through the keys up to the tension value
		for (let key = 0; key < numberOfLEDs; key++) {
			if (Math.random() < proportionSticksAlight) {
				const timeParameter = ((Date.now() * flashesFrequency) + parseInt(stick.name)) % 10
				if (timeParameter < 2) {
					const ledColor = stickLightning(timeParameter)

					leds.push({
						number: key,
						color: ledColor
					})
				}
			}
		}

		// Return leds array of a particular stick:
		return [{
			key: stick.name,
			leds
		}]
	})
}

const stickLightning = (timeParameter) => {
	return {
		r: Math.floor(Math.max(Math.min((2 - timeParameter) * 255 / 2, brightColor.r), offColor.r) / 2),
		g: Math.floor(Math.max(Math.min((2 - timeParameter) * 255 / 2, brightColor.g), offColor.g)),
		b: Math.floor(Math.max(Math.min((2 - timeParameter) * 255 / 2, brightColor.b), offColor.b) / 2)
	}
}

export default random_flashes
