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
                sticks: [
                    {
                        x: 122,
                        y: -180,
                        z: 0
                    },
                    {
                        x: 122 * Math.cos(2 * Math.PI * 1 / 11),
                        y: -180,
                        z: 122 * Math.sin(2 * Math.PI * 1 / 11)
                    },
                    {
                        x: 122 * Math.cos(2 * Math.PI * 2 / 11),
                        y: -180,
                        z: 122 * Math.sin(2 * Math.PI * 2 / 11)
                    },
                    {
                        x: 122 * Math.cos(2 * Math.PI * 3 / 11),
                        y: -180,
                        z: 122 * Math.sin(2 * Math.PI * 3 / 11)
                    },
                    {
                        x: 122 * Math.cos(2 * Math.PI * 4 / 11),
                        y: -180,
                        z: 122 * Math.sin(2 * Math.PI * 4 / 11)
                    },
                    {
                        x: 122 * Math.cos(2 * Math.PI * 5 / 11),
                        y: -180,
                        z: 122 * Math.sin(2 * Math.PI * 5 / 11)
                    },
                    {
                        x: 122 * Math.cos(2 * Math.PI * 6 / 11),
                        y: -180,
                        z: 122 * Math.sin(2 * Math.PI * 6 / 11)
                    },
                    {
                        x: 122 * Math.cos(2 * Math.PI * 7 / 11),
                        y: -180,
                        z: 122 * Math.sin(2 * Math.PI * 7 / 11)
                    },
                    {
                        x: 122 * Math.cos(2 * Math.PI * 8 / 11),
                        y: -180,
                        z: 122 * Math.sin(2 * Math.PI * 8 / 11)
                    },
                    {
                        x: 122 * Math.cos(2 * Math.PI * 9 / 11),
                        y: -180,
                        z: 122 * Math.sin(2 * Math.PI * 9 / 11)
                    },
                    {
                        x: 122 * Math.cos(2 * Math.PI * 10 / 11),
                        y: -180,
                        z: 122 * Math.sin(2 * Math.PI * 10 / 11)
                    }
                ],
                sensors: [
                    {
                        key: '0',
                        sensorPosition: 75
                    },
                    {
                        key: '1',
                        sensorPosition: 75
                    },
                    {
                        key: '2',
                        sensorPosition: 75
                    },
                    {
                        key: '3',
                        sensorPosition: 75
                    },
                    {
                        key: '4',
                        sensorPosition: 75
                    },
                    {
                        key: '5',
                        sensorPosition: 75
                    },
                    {
                        key: '6',
                        sensorPosition: 75
                    },
                    {
                        key: '7',
                        sensorPosition: 75
                    },
                    {
                        key: '8',
                        sensorPosition: 75
                    },
                    {
                        key: '9',
                        sensorPosition: 75
                    },
                    {
                        key: '-',
                        sensorPosition: 20
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
                        initX: 125 * Math.cos(2 * Math.PI * 1 / 11),
                        initY: -62,
                        initZ: 125 * Math.sin(2 * Math.PI * 1 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 125 * Math.cos(2 * Math.PI * 2 / 11),
                        initY: -62,
                        initZ: 125 * Math.sin(2 * Math.PI * 2 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 125 * Math.cos(2 * Math.PI * 3 / 11),
                        initY: -62,
                        initZ: 125 * Math.sin(2 * Math.PI * 3 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 125 * Math.cos(2 * Math.PI * 4 / 11),
                        initY: -62,
                        initZ: 125 * Math.sin(2 * Math.PI * 4 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 125 * Math.cos(2 * Math.PI * 5 / 11),
                        initY: -62,
                        initZ: 125 * Math.sin(2 * Math.PI * 5 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 125 * Math.cos(2 * Math.PI * 6 / 11),
                        initY: -62,
                        initZ: 125 * Math.sin(2 * Math.PI * 6 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 125 * Math.cos(2 * Math.PI * 7 / 11),
                        initY: -62,
                        initZ: 125 * Math.sin(2 * Math.PI * 7 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 125 * Math.cos(2 * Math.PI * 8 / 11),
                        initY: -62,
                        initZ: 125 * Math.sin(2 * Math.PI * 8 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 125 * Math.cos(2 * Math.PI * 9 / 11),
                        initY: -62,
                        initZ: 125 * Math.sin(2 * Math.PI * 9 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 125 * Math.cos(2 * Math.PI * 10 / 11),
                        initY: -62,
                        initZ: 125 * Math.sin(2 * Math.PI * 10 / 11)
                    }
                ]
            }
        default:
            console.log('You need to pick up structure you would use')
            return
    }
}