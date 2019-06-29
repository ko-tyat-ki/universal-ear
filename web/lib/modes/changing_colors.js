// Function of STICKS (initial properties of the sticks, i.e. position, names, etc.) and SENSORS (sensor data, the sticks they are connected etc.)
// Returns a large array of all LED colours of all the STICKS

const brightColor = {
	r: 255,
	g: 255,
	b: 255
}

const startTime = Date.now()

// This particular function linearly depends on the tension of the sensor, i.e. the number of LEDs that will be turned ON linearly depends on the tension
const changing_colors = (sticks, sensors) => { 

	// Cycle through array of sensors from each stick:
	return sensors.map(sensor => { 
		
		// Find a Stick that corresponds to current Sensor
		const stick = sticks.find(stick => stick.name === sensor.stick)
		if (!stick) return

		// Get tension of current sensor
		const tension = sensor.tension
		const oldTension = sensor.oldTension
		const numberOfLEDs = stick.numberOfLEDs || 40 // at the moment we are using 40 LEDs

		///!?!?!?!?!?!?!  can we use smth like this   ??!?!?!?!?!?!?!?!
		//const timePassed = Date.now() - sensor.startCounting //time information

		const color_change_speed = 3 //gives priority to Tension over oldTension
		const maxTension = 50

		let tension_parameter = oldTension.reduce((a,b) => a+b, 0) // summing up old tension
		tension_parameter = tension_parameter + tension * color_change_speed // adding current tension
		tension_parameter = tension_parameter / maxTension // scaling down to the number between 0 and 1

		//console.log(tension_parameter)

		// Initialise array that will hold the order numbers of LEDs and their colours
		const leds = []

		// Cycle through the keys up to the tension value
		for (let key = 0; key < numberOfLEDs; key++) {
			let ledColor
			
			ledColor = ReduceBrightnessFunction(tension_parameter)

			leds.push({
				number: key,
				//color: { r, g, b }
				color: ledColor
			})

		}

		//console.log(leds.color)

		// Return leds array of a particular stick:
		return [{
			key: stick.name,
			leds
		}]
	})
}

const ReduceBrightnessFunction = (tension_parameter) => {

	// adding shimmering - the default boundary gets unstable
	const offColor = { // get from contants
		r: 0 + (Math.random() - 0.5) * 10,
		g: 0 + (Math.random() - 0.5) * 10,
		b: 0 + (Math.random() - 0.5) * 10
	}

// bad coding creating different colour fainting schemes :)
	let aa
	let bb
	let cc
	const colour_case = ((Date.now() - startTime) / 10000) % 3

	if (colour_case < 1) {
		aa = 1
		bb = 0.6
		cc = 0.3
	}
	else if (colour_case < 2) {
		aa = 0.3
		bb = 0.6
		cc = 1
	}
	else {
		aa = 0.3
		bb = 1
		cc = 0.6
	}
	//console.log(colour_case)
	//console.log(Date.now() - startTime)

	// tension parameter shall be calibrated to be a number between 0 and 1
	const a = Math.min(1, Math.max(0, tension_parameter - aa))  * 255
	const b = Math.min(1, Math.max(0, tension_parameter - bb)) * 255
	const c = Math.min(1, Math.max(0, tension_parameter - cc)) * 255

	let outRGB = { r: 0, g: 0, b: 0 }
	// minmax - boundaries for color change
	outRGB.r = Math.max(Math.min(a, brightColor.r), offColor.r)
	outRGB.g = Math.max(Math.min(b, brightColor.g), offColor.g)
	outRGB.b = Math.max(Math.min(c, brightColor.b), offColor.b)
	return outRGB
}

export default changing_colors
