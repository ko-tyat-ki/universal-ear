export const basic = ({
    arduinos,
    columns
}) => {
    const brightColor = '#88b'
    for (let columnName in columns) {
        let column = columns[columnName]
        let arduino = arduinos[columnName]

        const tension = arduino.read()
        const numberOfLEDs = 40

        const leds = []

        for (let key = 0; key < Math.min(tension, numberOfLEDs/2); key++) {
            leds.push({
                number: numberOfLEDs/2 - key,
                color: brightColor
            })
            leds.push({
                number: numberOfLEDs/2 + key,
                color: brightColor
            })
        }

        column.colorLeds(leds)
    }
}