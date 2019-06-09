import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

export class RealSensor {
    constructor(arduinoConfig) {
        this.tension = arduinoConfig.baseTension
        this.oldTension = [this.tension, this.tension, this.tension, this.tension]

        const portName = arduinoConfig.name

        this.port = new SerialPort(`${portName}`, {
            baudRate: arduinoConfig.baudRate
        })

        this.parser = this.port.pipe(new Readline({ delimiter: '\n' }))

        this.port.on('error', (error) => {
            console.log(`Warning: the port ${portName} failed to open, did you connect the device? If not - no worries, client side can work without it`, error)
        })

        this.port.on('close', (error) => {
            console.log(`Port was closed., port: ${portName}`, error)
        })
    }

    update(tension) {
        for (let key = 0; key < 4; key++) {
            this.oldTension[key] = (this.oldTension[key])
                ? this.lerp(this.oldTension[key], this.tension, 0.1 * (key + 1))
                : this.tension
        }
        this.tension = tension
    }
}