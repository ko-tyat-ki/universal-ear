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
                        sensorPosition: 40
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
                        x: 597,
                        y: -180,
                        z: 0
                    },
                    {
                        x: 597 * Math.cos(2 * Math.PI * 1 / 11),
                        y: -180,
                        z: 597 * Math.sin(2 * Math.PI * 1 / 11)
                    },
                    {
                        x: 597 * Math.cos(2 * Math.PI * 2 / 11),
                        y: -180,
                        z: 597 * Math.sin(2 * Math.PI * 2 / 11)
                    },
                    {
                        x: 597 * Math.cos(2 * Math.PI * 3 / 11),
                        y: -180,
                        z: 597 * Math.sin(2 * Math.PI * 3 / 11)
                    },
                    {
                        x: 597 * Math.cos(2 * Math.PI * 4 / 11),
                        y: -180,
                        z: 597 * Math.sin(2 * Math.PI * 4 / 11)
                    },
                    {
                        x: 597 * Math.cos(2 * Math.PI * 5 / 11),
                        y: -180,
                        z: 597 * Math.sin(2 * Math.PI * 5 / 11)
                    },
                    {
                        x: 597 * Math.cos(2 * Math.PI * 6 / 11),
                        y: -180,
                        z: 597 * Math.sin(2 * Math.PI * 6 / 11)
                    },
                    {
                        x: 597 * Math.cos(2 * Math.PI * 7 / 11),
                        y: -180,
                        z: 597 * Math.sin(2 * Math.PI * 7 / 11)
                    },
                    {
                        x: 597 * Math.cos(2 * Math.PI * 8 / 11),
                        y: -180,
                        z: 597 * Math.sin(2 * Math.PI * 8 / 11)
                    },
                    {
                        x: 597 * Math.cos(2 * Math.PI * 9 / 11),
                        y: -180,
                        z: 597 * Math.sin(2 * Math.PI * 9 / 11)
                    },
                    {
                        x: 597 * Math.cos(2 * Math.PI * 10 / 11),
                        y: -180,
                        z: 597 * Math.sin(2 * Math.PI * 10 / 11)
                    }
                ],
                sensors: [
                    {
                        key: '0',
                        sensorPosition: 25
                    },
                    {
                        key: '1',
                        sensorPosition: 25
                    },
                    {
                        key: '2',
                        sensorPosition: 25
                    },
                    {
                        key: '3',
                        sensorPosition: 25
                    },
                    {
                        key: '4',
                        sensorPosition: 25
                    },
                    {
                        key: '5',
                        sensorPosition: 25
                    },
                    {
                        key: '6',
                        sensorPosition: 25
                    },
                    {
                        key: '7',
                        sensorPosition: 25
                    },
                    {
                        key: '8',
                        sensorPosition: 25
                    },
                    {
                        key: '9',
                        sensorPosition: 25
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
                        initX: 600,
                        initY: -62,
                        initZ: 0
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 600 * Math.cos(2 * Math.PI * 1 / 11),
                        initY: -62,
                        initZ: 600 * Math.sin(2 * Math.PI * 1 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 600 * Math.cos(2 * Math.PI * 2 / 11),
                        initY: -62,
                        initZ: 600 * Math.sin(2 * Math.PI * 2 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 600 * Math.cos(2 * Math.PI * 3 / 11),
                        initY: -62,
                        initZ: 600 * Math.sin(2 * Math.PI * 3 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 600 * Math.cos(2 * Math.PI * 4 / 11),
                        initY: -62,
                        initZ: 600 * Math.sin(2 * Math.PI * 4 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 600 * Math.cos(2 * Math.PI * 5 / 11),
                        initY: -62,
                        initZ: 600 * Math.sin(2 * Math.PI * 5 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 600 * Math.cos(2 * Math.PI * 6 / 11),
                        initY: -62,
                        initZ: 600 * Math.sin(2 * Math.PI * 6 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 600 * Math.cos(2 * Math.PI * 7 / 11),
                        initY: -62,
                        initZ: 600 * Math.sin(2 * Math.PI * 7 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 600 * Math.cos(2 * Math.PI * 8 / 11),
                        initY: -62,
                        initZ: 600 * Math.sin(2 * Math.PI * 8 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 600 * Math.cos(2 * Math.PI * 9 / 11),
                        initY: -62,
                        initZ: 600 * Math.sin(2 * Math.PI * 9 / 11)
                    }, {
                        geoX: 5,
                        geoY: 375,
                        geoZ: 5,
                        initX: 600 * Math.cos(2 * Math.PI * 10 / 11),
                        initY: -62,
                        initZ: 600 * Math.sin(2 * Math.PI * 10 / 11)
                    }
                ]
            }
        case 'realistic':
            return {
                sticks: [
                    {
                        x: 0,
                        y: -130,
                        z: 0
                    },
                    {
                        x: 147,
                        y: -180,
                        z: 0
                    },
                    {
                        x: 72,
                        y: -180,
                        z: 126
                    },
                    {
                        x: -72,
                        y: -180,
                        z: 126
                    },
                    {
                        x: -147,
                        y: -180,
                        z: 0
                    },
                    {
                        x: -72,
                        y: -130,
                        z: -126
                    },
                    {
                        x: 72,
                        y: -130,
                        z: -126
                    },
                    {
                        x: 297,
                        y: -180,
                        z: 0
                    },
                    {
                        x: 147,
                        y: -180,
                        z: 256
                    },
                    {
                        x: -147,
                        y: -180,
                        z: 256
                    },
                    {
                        x: -297,
                        y: -180,
                        z: 0
                    }
                ],
                sensors: [
                    {
                        key: '0',
                        sensorPosition: 25
                    },
                    {
                        key: '1',
                        sensorPosition: 25
                    },
                    {
                        key: '2',
                        sensorPosition: 25
                    },
                    {
                        key: '3',
                        sensorPosition: 25
                    },
                    {
                        key: '4',
                        sensorPosition: 25
                    },
                    {
                        key: '5',
                        sensorPosition: 25
                    },
                    {
                        key: '6',
                        sensorPosition: 25
                    },
                    {
                        key: '7',
                        sensorPosition: 25
                    },
                    {
                        key: '8',
                        sensorPosition: 25
                    },
                    {
                        key: '9',
                        sensorPosition: 25
                    },
                    {
                        key: '-',
                        sensorPosition: 20
                    }
                ],
                poles: [
                    {
                        geoX: 5,
                        geoY: 500,
                        geoZ: 5,
                        initX: 0,
                        initY: -62,
                        initZ: 0
                    }, {
                        geoX: 5,
                        geoY: 400,
                        geoZ: 5,
                        initX: 150,
                        initY: -62,
                        initZ: 0
                    }, {
                        geoX: 5,
                        geoY: 400,
                        geoZ: 5,
                        initX: 75,
                        initY: -62,
                        initZ: 129.9038106
                    }, {
                        geoX: 5,
                        geoY: 400,
                        geoZ: 5,
                        initX: -75,
                        initY: -62,
                        initZ: 129.9038106
                    }, {
                        geoX: 5,
                        geoY: 400,
                        geoZ: 5,
                        initX: -150,
                        initY: -62,
                        initZ: 0
                    }, {
                        geoX: 5,
                        geoY: 500,
                        geoZ: 5,
                        initX: -75,
                        initY: -62,
                        initZ: -129.9038106
                    }, {
                        geoX: 5,
                        geoY: 500,
                        geoZ: 5,
                        initX: 75,
                        initY: -62,
                        initZ: -129.9038106
                    }, {
                        geoX: 5,
                        geoY: 400,
                        geoZ: 5,
                        initX: 300,
                        initY: -62,
                        initZ: 0
                    }, {
                        geoX: 5,
                        geoY: 400,
                        geoZ: 5,
                        initX: 150,
                        initY: -62,
                        initZ: 259.8076211
                    }, {
                        geoX: 5,
                        geoY: 400,
                        geoZ: 5,
                        initX: -150,
                        initY: -62,
                        initZ: 259.8076211
                    }, {
                        geoX: 5,
                        geoY: 400,
                        geoZ: 5,
                        initX: -300,
                        initY: -62,
                        initZ: 0
                    }
                ]
            }
        default:
            console.log('You need to pick up structure you would use')
            return
    }
}