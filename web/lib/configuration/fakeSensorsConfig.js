/* global console */

export const calculateFakeSensors = (selectedStructure) => {
    switch (selectedStructure) {
        case 'duet':
            return [
                {
                    key: 'a',
                    sensorPosition: 10,
                    column: '1'
                },
                {
                    key: 's',
                    sensorPosition: 30,
                    column: '2'
                }
            ]
        case 'circle':
            return [
                {
                    key: '0',
                    sensorPosition: 25,
                    column: '1'
                },
                {
                    key: '1',
                    sensorPosition: 25,
                    column: '2'
                },
                {
                    key: '2',
                    sensorPosition: 25,
                    column: '3'
                },
                {
                    key: '3',
                    sensorPosition: 25,
                    column: '4'
                },
                {
                    key: '4',
                    sensorPosition: 25,
                    column: '5'
                },
                {
                    key: '5',
                    sensorPosition: 25,
                    column: '6'
                },
                {
                    key: '6',
                    sensorPosition: 25,
                    column: '7'
                },
                {
                    key: '7',
                    sensorPosition: 25,
                    column: '8'
                },
                {
                    key: '8',
                    sensorPosition: 25,
                    column: '9'
                },
                {
                    key: '9',
                    sensorPosition: 25,
                    column: '10'
                },
                {
                    key: '-',
                    sensorPosition: 20,
                    column: '11'
                }
            ]
        case 'realistic':
            return [
                {
                    key: '0',
                    sensorPosition: 25,
                    column: '1'
                },
                {
                    key: '1',
                    sensorPosition: 25,
                    column: '2'
                },
                {
                    key: '2',
                    sensorPosition: 25,
                    column: '3'
                },
                {
                    key: '3',
                    sensorPosition: 25,
                    column: '4'
                },
                {
                    key: '4',
                    sensorPosition: 25,
                    column: '5'
                },
                {
                    key: '5',
                    sensorPosition: 25,
                    column: '6'
                },
                {
                    key: '6',
                    sensorPosition: 25,
                    column: '7'
                },
                {
                    key: '7',
                    sensorPosition: 25,
                    column: '8'
                },
                {
                    key: '8',
                    sensorPosition: 25,
                    column: '9'
                },
                {
                    key: '9',
                    sensorPosition: 25,
                    column: '10'
                },
                {
                    key: '-',
                    sensorPosition: 20,
                    column: '11'
                }
            ]
        default:
            console.log('You need to pick up structure you would use')
            return
    }
}
