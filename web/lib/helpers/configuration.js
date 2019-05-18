/* global console */

export const calculateConfiguration = (selectedStructure) => {
    switch (selectedStructure) {
        case 'duet':
            return {
                sticks: [
                    {
                        x: 122,
                        y: -180,
                        z: 0
                    },
                    {
                        x: -122,
                        y: -180,
                        z: 0
                    }
                ],
                sensors: [
                    {
                        key: 'a',
                        sensorPosition: 10
                    },
                    {
                        key: 's',
                        sensorPosition: 120
                    }
                ],
                poles: [
                    {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 125,
                        initY: -62,
                        initZ: 0
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: -125,
                        initY: -62,
                        initZ: 0
                    }, {
                        geoX: 255,
                        geoY: 5,
                        geoZ: 5,
                        initX: 0,
                        initY: 125,
                        initZ: 0
                    }
                ]

            }
        case 'circle':
            return {
                columns: [
                    {
                        key: '0',
                        sensorPosition: 20
                    },
                    {
                        key: '1',
                        sensorPosition: 20
                    },
                    {
                        key: '2',
                        sensorPosition: 20
                    },
                    {
                        key: '3',
                        sensorPosition: 20
                    },
                    {
                        key: '4',
                        sensorPosition: 20
                    },
                    {
                        key: '5',
                        sensorPosition: 20
                    },
                    {
                        key: '6',
                        sensorPosition: 20
                    },
                    {
                        key: '7',
                        sensorPosition: 20
                    },
                    {
                        key: '8',
                        sensorPosition: 20
                    },
                    {
                        key: '9',
                        sensorPosition: 20
                    }
                ]
            }
        default:
            console.log('You need to pick up structure you would use')
            return
    }
}