export const flicker = ({
	arduinos,
	columns
}) => {
	const brightColor = '#88b'
	for (let columnName in columns) {
		let column = columns[columnName]
		let arduino = arduinos[columnName]

		const tension = arduino.read()
		const numberOfLEDs = column.numberOfLEDs

		const leds = []
		
		for (let key = 0; key < numberOfLEDs; key++) {
			var _color
			if (tension / numberOfLEDs > Math.random()) {
				_color = brightColor
			} else {
				_color = '#222'
			}
			leds.push({
				number: key,
				color: _color
			})
		}
		column.colorLeds(leds)
	}
}