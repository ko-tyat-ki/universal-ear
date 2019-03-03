import { getDistance } from '../helpers/getDistance.js'

export const randomEcho = ({
    arduinos,
    columns
}) => {
    const names = columns.map(column => column.columnName)
    arduinos.forEach( arduino => {
        const tension = arduino.read()

        if (tension) {
            columns.forEach(column => {
                const distance = getDistance({
                    arduino,
                    column,
                    names
                })
    
                const leds = []
    
                for (let key = 0; key < column.numberOfLEDs; key++) {
                    const colorIntensity = parseInt(255 * Math.random())
                    const color = `rgba(15, ${colorIntensity}, 200, ${1/(distance + 1)})`
                    leds.push({
                        number: key,
                        color: color
                    })
                }
    
                column.colorLeds(leds)
            })
        }
    })
}
