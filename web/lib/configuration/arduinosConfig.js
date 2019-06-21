export const arduinosConfig = [
	{
		name: '/dev/tty.usbmodem14201', // first port on MAC
		column: '1',
		baudRate: 115200,
		numberOfLEDs: 40,
		sensors: [
			{
				name: 'someName',
				position: 20
			}
		],
		baseTension: 0
	}, {
		name: 'COM14', // first port on Windows
		column: '1',
		baudRate: 115200,
		numberOfLEDs: 40,
		sensors: [
			{
				name: 'someName',
				position: 20
			}
		],
		baseTension: 0
	}, {
		name: '/dev/ttyACM0', // first one on pi
		column: '1',
		baudRate: 115200,
		numberOfLEDs: 40,
		sensors: [
			{
				name: 'someName',
				position: 20
			}
		],
		baseTension: 0
	}, {
		name: '/dev/ttyAMA0', // first one on pi
		column: '1',
		baudRate: 115200,
		numberOfLEDs: 40,
		sensors: [
			{
				name: 'someName123123',
				position: 20
			}
		],
		baseTension: 0
	}, {
		name: '/dev/ttyUSB0', // second arduino port
		column: '1',
		baudRate: 115200,
		numberOfLEDs: 40,
		sensors: [
			{
				name: 'someOtherName',
				position: 30
			}
		],
		baseTension: 0
	}, {
		name: '/dev/ttyUSB1',
		column: '2',
		baudRate: 115200,
		numberOfLEDs: 40,
		sensors: [
			{
				name: 'some',
				position: 10
			}
		],
		baseTension: 0
	}, {
		name: '/dev/tty.usbserial-14250', // first port on MAC
		column: '1',
		baudRate: 115200,
		numberOfLEDs: 40,
		sensors: [
			{
				name: 'someName',
				position: 20
			}
		],
		baseTension: 0
	}, {
		name: '/dev/tty.usbserial-1420', // first port on MAC
		column: '1',
		baudRate: 115200,
		numberOfLEDs: 40,
		sensors: [
			{
				name: 'someName',
				position: 20
			}
		],
		baseTension: 0
	}
]
