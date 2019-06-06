export class SensorInterface {

    constructor(port) {
        this.minimalTension = 0
        this.tension = 0
        this.isBeingPulled = false
        this.tensionSpeed = 0.05
        this.port = port
        this.callback = null

        this.setKeyDownEventListener()
        this.setKeyUpEventListener()
    }

    // callback = function(sensor_id, sensor_value: , data: dict)
    setCallback(callback) {
        this.callback = callback
    }

}
