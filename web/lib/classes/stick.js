const INIT_STICK_COLOR = 0x222244

export class Stick {
	constructor(numberOfLEDs, StickLEDs, name) {
		this.numberOfLEDs = numberOfLEDs
		this.StickLEDs = StickLEDs
		this.name = name
	}

	colorLeds(leds) {
		this.cleanLeds()

		leds.forEach(led => {
			this.StickLEDs[led.number].material.color.setHex(led.color)
		})
	}

	cleanLeds() {
		this.StickLEDs.map(led => {
			led.material.color.setHex(INIT_STICK_COLOR)
		})
	}
}
