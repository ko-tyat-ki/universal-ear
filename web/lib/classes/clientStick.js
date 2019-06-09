import { transformRgbToHex } from "../helpers/colorHelpers";

const INIT_STICK_COLOR = 0x222244

export class ClientStick {
	constructor(numberOfLEDs, StickLEDs, name, init) {
		this.numberOfLEDs = numberOfLEDs
		this.StickLEDs = StickLEDs
		this.name = name
		this.init = init
	}

	colorLeds(leds) {
		this.cleanLeds()

		leds.forEach(led => {
			const hexColor = transformRgbToHex(led.color)
			this.StickLEDs[led.number].material.color.setHex(hexColor)
		})
	}

	cleanLeds() {
		this.StickLEDs.map(led => {
			led.material.color.setHex(INIT_STICK_COLOR)
		})
	}
}
