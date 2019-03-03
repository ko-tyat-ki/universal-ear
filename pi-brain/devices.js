
class ArduinoDevice{
    constructor(serialPortName) {
        this.deviceId = None
    }
    getLEDBar(){}
    getSensor1(){}
    getSensor2(){}
}


//return list of all active arduino devices
function getAllDevices() {
    return []
}


class ArduinoSensor{
    constructor(arduinoDevice) {
        this.arduinoDevice = arduinoDevice
        this.sensor
    }

    getLEDBar() {
        return this.arduinoDevice.getLEDBar()
    }

    getTension(){}

}

class ArduinoLEDBar{
    constructor(arduinoDevice) {
        this.arduinoDevice = arduinoDevice
        this.ledColors = Array(40).fill(Color(0, 0, 0))
    }

    setLEDColors(ledColors) {
        // ledColors is arrray of Color
        this.ledColors = ledColors
    }

}

class Color{
    constructor(r, g, b){
        this.r = r
        this.g = g
        this.b = b
    }

}