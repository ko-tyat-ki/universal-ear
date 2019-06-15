/* global document */

export class FakeSensor {
	constructor(tension, sensor) {
		this.minimalTension = tension
		this.tension = tension
		this.oldTension = [tension, tension, tension, tension]
		this.isBeingPulled = false
		this.key = sensor.key
		this.column = sensor.column
		this.sensorPosition = sensor.sensorPosition
		this.setKeyDownEventListener()
		this.setKeyUpEventListener()
		this.isSlowSensor = false
		this.startCounting
		this.slowAmplitude

		// Sensor simulation coefficients:
		this.sensorAmplitude = 40
		this.slowSensorSpeed = 0.01
		this.fastSensorSpeed = 0.1
		this.fastSensorSpeedDown = 0.05
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
		for (let key = 0; key < 4; key++) {
			this.oldTension[key] = (this.oldTension[key])
				? this.lerp(this.oldTension[key], this.tension, 0.05 * (key + 1))
				: this.tension
			this.oldTension[key] = (this.oldTension[key] < 1)
				? 0
				: this.oldTension[key]
		}
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
			this.slowAmplitude = output
			return output
		} else {
			this.slowAmplitude = this.sensorAmplitude
			return this.sensorAmplitude
		}
	}

	slowDownTensionFormula(timeValue) {
		const output = this.slowAmplitude - timeValue * this.slowSensorSpeed
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

	lerp(inValue, outValue, fraction) {
		return inValue + (outValue - inValue) * fraction
	}
}
