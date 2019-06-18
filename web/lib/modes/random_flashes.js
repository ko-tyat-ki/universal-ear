// Function of STICKS (initial properties of the sticks, i.e. position, names, etc.) and SENSORS (sensor data, the sticks they are connected etc.)
// Returns a large array of all LED colours of all the STICKS

const brightColor = {r: 255, g: 255, b: 255}
const offColor = {r: 34, g: 34, b: 68}

const numberOfLEDs = 40

const random_flashes = (sticks, sensors) => { 

	//const stickAlight = Math.floor((Math.random() * 10) % 10) //randomly choosing a stick to alight (multiple are possible at the same time)
	const stickAlight = Math.floor((Date.now() / 10000) % 10) //choosing one at a time

	// Cycle through array of sensors from each stick:
	return sensors.map(sensor => { 
		
		// Find a Stick that corresponds to current Sensor
		const stick = sticks.find(stick => stick.name === sensor.column)
		
		//only doing smth to stick to be alight
		if (!stick || parseInt(stick.name) != stickAlight) return

		// Initialise array that will hold the order numbers of LEDs and their colours
		const leds = []

		// Cycle through the keys up to the tension value
		for (let key = 0; key < numberOfLEDs; key++) {
			let ledColor

			if (stickLightning() != offColor) {
				ledColor = stickLightning()
			}

			leds.push({
				number: key,
				//color: { r, g, b }
				color: ledColor
			})
		}

		// Return leds array of a particular stick:
		return [{
			key: stick.name,
			leds
		}]
	})
}

const stickLightning = () => {

	let timeParameter = (Date.now() / 1000) % 10
	let outRGB = { r: 0, g: 0, b: 0 }

	if (timeParameter < 1) {
		outRGB.r = Math.max(Math.min((1-timeParameter)*255, brightColor.r), offColor.r)
		outRGB.g = Math.max(Math.min((1-timeParameter)*255, brightColor.g), offColor.g)
		outRGB.b = Math.max(Math.min((1-timeParameter)*255, brightColor.b), offColor.b)
	}
	else
	{
		outRGB.r = offColor.r
		outRGB.g = offColor.g
		outRGB.b = offColor.b
	}

	return outRGB
}

export default random_flashes
