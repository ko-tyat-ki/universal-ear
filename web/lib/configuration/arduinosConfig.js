let arduinosConfig = [
  {
    "name": "/dev/ttyUSB0",
    "column": "1",
    "baudRate": 115200,
    "numberOfLEDs": 40,
    "sensors": [
      {
        "name": "some",
        "position": 10
      }
    ],
    "baseTension": 0
  },
  {
    "name": "/dev/ttyUSB1",
    "column": "2",
    "baudRate": 115200,
    "numberOfLEDs": 40,
    "sensors": [
      {
        "name": "some",
        "position": 10
      }
    ],
    "baseTension": 0
  },
  {
    "name": "/dev/ttyUSB2",
    "column": "3",
    "baudRate": 115200,
    "numberOfLEDs": 40,
    "sensors": [
      {
        "name": "some",
        "position": 10
      }
    ],
    "baseTension": 0
  },
  {
    "name": "/dev/ttyUSB3",
    "column": "4",
    "baudRate": 115200,
    "numberOfLEDs": 40,
    "sensors": [
      {
        "name": "some",
        "position": 10
      }
    ],
    "baseTension": 0
  },
  {
    "name": "/dev/ttyUSB4",
    "column": "5",
    "baudRate": 115200,
    "numberOfLEDs": 40,
    "sensors": [
      {
        "name": "some",
        "position": 10
      }
    ],
    "baseTension": 0
  },
  {
    "name": "/dev/ttyUSB5",
    "column": "6",
    "baudRate": 115200,
    "numberOfLEDs": 40,
    "sensors": [
      {
        "name": "some",
        "position": 10
      }
    ],
    "baseTension": 0
  }, {
    "name": "/dev/ttyUSB6",
    "column": "7",
    "baudRate": 115200,
    "numberOfLEDs": 40,
    "sensors": [
      {
        "name": "some",
        "position": 10
      }
    ],
    "baseTension": 0
  },
  {
    "name": "/dev/ttyUSB7",
    "column": "8",
    "baudRate": 115200,
    "numberOfLEDs": 40,
    "sensors": [
      {
        "name": "some",
        "position": 10
      }
    ],
    "baseTension": 0
  },
  {
    "name": "/dev/ttyUSB8",
    "column": "9",
    "baudRate": 115200,
    "numberOfLEDs": 40,
    "sensors": [
      {
        "name": "some",
        "position": 10
      }
    ],
    "baseTension": 0
  },
  {
    "name": "/dev/ttyUSB9",
    "column": "10",
    "baudRate": 115200,
    "numberOfLEDs": 40,
    "sensors": [
      {
        "name": "some",
        "position": 10
      }
    ],
    "baseTension": 0
  },
  {
    "name": "/dev/ttyAMA0",
    "column": "1",
    "baudRate": 115200,
    "numberOfLEDs": 40,
    "sensors": [
      {
        "name": "some",
        "position": 10
      }
    ],
    "baseTension": 0
  }
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
