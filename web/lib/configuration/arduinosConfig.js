let arduinosConfig = [
]

function addArduino(arduino) {
	let existentConfig = arduinosConfig.find(element => element.name == arduino.name)
	console.log("existentConfig", existentConfig)

	if (existentConfig) {
		existentConfig.column = arduino.column
		return
	}
	arduinosConfig.push(arduino)
}

function hasArduino(arduinoName) {
	return arduinosConfig.some(element => element.name == arduinoName)
}

export {
	arduinosConfig,
	addArduino,
	hasArduino
}
