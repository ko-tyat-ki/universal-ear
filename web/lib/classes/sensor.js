/* global document */

export class Sensor {
	constructor(tension, sensor) {
		this.minimalTension = tension
		this.tension = tension
		this.isBeingPulled = false
		this.tensionSpeed = 0.05
		this.key = sensor.key
		this.column = sensor.column
		this.sensorPosition = sensor.sensorPosition
		this.setKeyDownEventListener()
		this.setKeyUpEventListener()
		this.isSlowSensor = false
		//this.currentTime = Date.now()
		this.startCounting

		// Sensor simulation coefficients:
		this.fastSensorAmplitude = 0.5
		this.slowSensorAmplitude = 40
		this.slowSensorSpeed = 0.001
		this.fastSensorSpeed = 0.005
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

	read() { // DO WE USE IT???
		return this.tension
	}

	pull() { // DO WE USE IT??
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
	}

	//setCurrentTime(currentTime) {
	//	this.currentTime = currentTime
	//}

	realisticSensorUpdate() {
		const timePassed = Date.now() - this.startCounting
		const timeThreshold = 500 // in milliseconds
		if (this.isBeingPulled) {
			//console.log("pulled", timePassed)
			if (timePassed > timeThreshold) {
				this.isSlowSensor = true
				this.tension = this.slowUpTensionFormula(timePassed - timeThreshold)
			} else {
				this.isSlowSensor = false
			}
		} else {
			//console.log("not pulled", timePassed)
			if (this.isSlowSensor) {
				this.tension = this.slowDownTensionFormula(timePassed)
			} else {
				this.tension = this.fastTensionFormula(timePassed)
			}
		}
	}

	slowUpTensionFormula(timeValue) {
		console.log("SLOW UP", this.slowSensorAmplitude * (1 - Math.exp(-timeValue * this.slowSensorSpeed)))
		const output = this.slowSensorAmplitude * (1 - Math.exp(-timeValue * this.slowSensorSpeed))
		if (output < 1) {
			return 0
		} else {
			return output
		}
	}

	slowDownTensionFormula(timeValue) {
		console.log("SLOW DOWN", this.slowSensorAmplitude * Math.exp(-timeValue * this.slowSensorSpeed))
		const output = this.slowSensorAmplitude * Math.exp(-timeValue * this.slowSensorSpeed)
		if (output < 1) {
			return 0
		} else {
			return output
		}
	}

	fastTensionFormula(timeValue) {
		console.log("FAST", this.fastSensorAmplitude * timeValue * Math.exp(-timeValue * this.fastSensorSpeed))
		const output = this.fastSensorAmplitude * timeValue * Math.exp(-timeValue * this.fastSensorSpeed)
		if (output < 1) {
			return 0
		} else {
			return output
		}
	}



}
