<<<<<<< HEAD
import { rainbowColors } from "../helpers/rainbowColors";
import { NUMBER_OF_LEDS } from '../configuration/constants.js';

const position = [0,0,0,0,0,0,0,0,0,0,0,0,0]
const length = 2 // length of the 'snake'
const sensitivity = 1 / 50
const default_speed = 0.05
const secondary_effect = 0.1 // proportion of energy going to other sticks
const rainbowLength = 1 // rainbow phase in min
=======
import { polzynkiConfig } from '../../../modes_config.json'
import { rainbowColors } from "../helpers/rainbowColors";
import { NUMBER_OF_LEDS } from '../configuration/constants.js';

const position = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const length = polzynkiConfig.length // length of the 'snake'
const sensitivity = polzynkiConfig.sensitivity
const default_speed = polzynkiConfig.default_speed
const secondary_effect = polzynkiConfig.secondary_effect // proportion of energy going to other sticks
const rainbowLength = polzynkiConfig.rainbowLength // rainbow phase in min
const positionFactor = polzynkiConfig.positionFactor
const positionStickAdjustmentFactor = polzynkiConfig.positionStickAdjustmentFactor
const timeFactor = polzynkiConfig.timeFactor
>>>>>>> master

// This particular function linearly depends on the tension of the sensor, i.e. the number of LEDs that will be turned ON linearly depends on the tension
const polzynki = (sticks, sensors) => {

	// Cycle through array of sensors from each stick:
	return sensors.map(sensor => {
		// Find a Stick that corresponds to current Sensor
		const stick = sticks.find(stick => stick.name === sensor.stick)
<<<<<<< HEAD
			if (!stick) return
=======
		if (!stick) return
>>>>>>> master

		// Get tension of current sensor
		const tension = sensor.tension

		const leds = [] // Will be an array of leds (key, colours)
<<<<<<< HEAD
		
		//information in 0 stores 'secondary' effects applied to all sticks
		position[0] = position[0] + tension * sensitivity * (secondary_effect / 15)
=======

		//information in 0 stores 'secondary' effects applied to all sticks
		position[0] = position[0] + tension * sensitivity * (secondary_effect / positionFactor)
>>>>>>> master

		//informatino of position per stick
		const st = parseInt(stick.name)
		position[st] = position[st] + default_speed + tension * sensitivity

<<<<<<< HEAD
		const position_stick_adj = (position[st] + position[0] + parseInt(stick.name) * 10) % NUMBER_OF_LEDS
=======
		const position_stick_adj = (position[st] + position[0] + parseInt(stick.name) * positionStickAdjustmentFactor) % NUMBER_OF_LEDS
>>>>>>> master

		// Cycle through the keys up to the tension value
		for (let key = 0; key < NUMBER_OF_LEDS; key++) {

			if (key < position_stick_adj || key > position_stick_adj + length)
				continue

<<<<<<< HEAD
			const ledColor = rainbowColors(rainbowLength * 60000)
=======
			const ledColor = rainbowColors(rainbowLength * timeFactor)
>>>>>>> master
			//const ledColor = stickColour()

			leds.push({
				number: key,
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

export default polzynki

const stickColour = () => {
	return {
		r: 70,//Math.floor(Math.max(Math.min((2 - timeParameter) * 255 / 2, 255), 0) / 2),
		g: 255, //Math.floor(Math.max(Math.min((2 - timeParameter) * 255 / 2, 255), 0)),
		b: 150//Math.floor(Math.max(Math.min((2 - timeParameter) * 255 / 2, 255), 0) / 2)
	}
}
