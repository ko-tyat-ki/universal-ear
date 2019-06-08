/* global document */

export class FakeSensor {
	constructor(tension, sensor) {
		this.minimalTension = tension
		this.tension = tension
		this.isBeingPulled = false
		this.key = sensor.key
		this.column = sensor.column
		this.sensorPosition = sensor.sensorPosition
		this.setKeyDownEventListener()
		this.setKeyUpEventListener()
		this.isSlowSensor = false
		this.startCounting

		// Sensor simulation coefficients:
		this.sensorAmplitude = 40
		this.slowSensorSpeed = 0.01
		this.fastSensorSpeed = 0.3
		this.fastSensorSpeedDown = 0.005
		this.tensionSpeed = 1
	}

	setKeyDownEventListener() {
		document.addEventListener(
			"keydown",
			event => {
				if (event.key === this.key.toString()) {
					if (!this.isBeingPulled) {
						this.startCounting = Date.now()
						this.isSlowSensor = false
					}
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
					this.startCounting = Date.now()
				}
			},
			false
		)
	}

	realisticSensorUpdate() {
		const timePassed = Date.now() - this.startCounting
		const timeThreshold = 500 // in milliseconds
		if (this.isBeingPulled) {
			if (timePassed > timeThreshold) {
				this.isSlowSensor = true
				this.tension = this.slowUpTensionFormula(timePassed - timeThreshold)
			} else {
				this.isSlowSensor = false
			}
		} else {
			if (this.isSlowSensor) {
				this.tension = this.slowDownTensionFormula(timePassed)
			} else {
				this.tension = this.fastTensionFormula(timePassed)
			}
		}
	}

	slowUpTensionFormula(timeValue) {
		const output = timeValue * this.slowSensorSpeed
		if (output < this.sensorAmplitude) {
			return output
		} else {
			return this.sensorAmplitude
		}
	}

	slowDownTensionFormula(timeValue) {
		const output = this.sensorAmplitude - timeValue * this.slowSensorSpeed
		if (output < 0) {
			return 0
		} else {
			return output
		}
	}

	fastTensionFormula(timeValue) {
		let output = 0
		if (timeValue < this.sensorAmplitude / this.fastSensorSpeed) {
			output = timeValue * this.fastSensorSpeed
		} else {
			output = this.sensorAmplitude - timeValue * this.fastSensorSpeedDown
		}
		if (output < 1) {
			return 0
		} else {
			return output
		}
	}
}
