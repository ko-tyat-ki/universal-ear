/* global console */

export const calculateFakeSensors = (selectedStructure) => {
    switch (selectedStructure) {
        case 'duet':
            return [
                {
                    key: 'a',
                    sensorPosition: 10,
                    stick: '1'
                },
                {
                    key: 's',
                    sensorPosition: 30,
                    stick: '2'
                }
            ]
        case 'circle':
            return [
                {
                    key: '0',
                    sensorPosition: 25,
                    stick: '1'
                },
                {
                    key: '1',
                    sensorPosition: 25,
                    stick: '2'
                },
                {
                    key: '2',
                    sensorPosition: 25,
                    stick: '3'
                },
                {
                    key: '3',
                    sensorPosition: 25,
                    stick: '4'
                },
                {
                    key: '4',
                    sensorPosition: 25,
                    stick: '5'
                },
                {
                    key: '5',
                    sensorPosition: 25,
                    stick: '6'
                },
                {
                    key: '6',
                    sensorPosition: 25,
                    stick: '7'
                },
                {
                    key: '7',
                    sensorPosition: 25,
                    stick: '8'
                },
                {
                    key: '8',
                    sensorPosition: 25,
                    stick: '9'
                },
                {
                    key: '9',
                    sensorPosition: 25,
                    stick: '10'
                },
                {
                    key: '-',
                    sensorPosition: 20,
                    stick: '11'
                }
            ]
        case 'realistic':
            return [
                {
                    key: '0',
                    sensorPosition: 25,
                    stick: '1'
                },
                {
                    key: '1',
                    sensorPosition: 25,
                    stick: '2'
                },
                {
                    key: '2',
                    sensorPosition: 25,
                    stick: '3'
                },
                {
                    key: '3',
                    sensorPosition: 25,
                    stick: '4'
                },
                {
                    key: '4',
                    sensorPosition: 25,
                    stick: '5'
                },
                {
                    key: '5',
                    sensorPosition: 25,
                    stick: '6'
                },
                {
                    key: '6',
                    sensorPosition: 25,
                    stick: '7'
                },
                {
                    key: '7',
                    sensorPosition: 25,
                    stick: '8'
                },
                {
                    key: '8',
                    sensorPosition: 25,
                    stick: '9'
                },
                {
                    key: '9',
                    sensorPosition: 25,
                    stick: '10'
                },
                {
                    key: '-',
                    sensorPosition: 20,
                    stick: '11'
                }
            ]
        case 'final':
            return [
                {
                    key: '0',
                    sensorPosition: 25,
                    stick: '1'
                },
                {
                    key: '1',
                    sensorPosition: 25,
                    stick: '2'
                },
                {
                    key: '2',
                    sensorPosition: 25,
                    stick: '3'
                },
                {
                    key: '3',
                    sensorPosition: 25,
                    stick: '4'
                },
                {
                    key: '4',
                    sensorPosition: 25,
                    stick: '5'
                },
                {
                    key: '5',
                    sensorPosition: 25,
                    stick: '6'
                },
                {
                    key: '6',
                    sensorPosition: 25,
                    stick: '7'
                },
                {
                    key: '7',
                    sensorPosition: 25,
                    stick: '8'
                },
                {
                    key: '8',
                    sensorPosition: 25,
                    stick: '9'
                },
                {
                    key: '9',
                    sensorPosition: 25,
                    stick: '10'
                },
                {
                    key: '-',
                    sensorPosition: 20,
                    stick: '11'
                },
                {
                    key: '=',
                    sensorPosition: 20,
                    stick: '12'
                }
            ]
        default:
            console.log('You need to pick up structure you would use')
            return
    }
}
