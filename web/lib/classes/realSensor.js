export class RealSensor {
    constructor(tension) {
        this.tension = tension
        this.oldTension = [tension, tension, tension, tension]
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