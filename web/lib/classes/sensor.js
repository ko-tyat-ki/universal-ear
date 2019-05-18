/* global document */

export class Sensor {
	constructor(tension, sensor) {
		this.minimalTension = tension
		this.tension = tension
		this.isBeingPulled = false
		this.tensionSpeed = 0.05
		this.key = sensor.key
		this.sensorPosition = sensor.sensorPosition

		this.setKeyDownEventListener()
		this.setKeyUpEventListener()
	}

	setKeyDownEventListener() {
		document.addEventListener(
			"keydown",
			event => {
				if (event.key === this.key.toString()) {
					this.isBeingPulled = true
				}
			},
			false
		)
	}

	setKeyUpEventListener() {
		document.addEventListener(
			"keyup",
			event => {
				if (event.key === this.key.toString()) {
					this.isBeingPulled = false
				}
			},
			false
		)
	}

	read() {
		return this.tension
	}

	pull() {
		// TODO: pull speed
		this.tension += 1
	}

	update(delta) {
		let tension = this.tension

		if (this.isBeingPulled) {
			tension += this.tensionSpeed * delta
		} else {
			tension -= this.tensionSpeed * delta
		}

		this.tension = Math.max(this.minimalTension, tension)

		if (this.tension != this.minimalTension) {
			console.log("Sensor", this.key, this.tension, this.isBeingPulled)
		}
	}
}
