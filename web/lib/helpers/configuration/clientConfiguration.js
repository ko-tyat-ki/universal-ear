/* global console */

export const calculateConfiguration = (selectedStructure) => {
    switch (selectedStructure) {
        case 'duet':
            return {
                sticks: [
                    {
                        name: '1',
                        init: {
                            x: 122,
                            y: -180,
                            z: 0
                        }
                    },
                    {
                        name: '2',
                        init: {
                            x: -122,
                            y: -180,
                            z: 0
                        }
                    }
                ],
                sensors: [
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
                ],
                poles: [
                    {
                        geo: {
                            x: 5,
                            y: 375,
                            z: 5
                        },
                        init: {
                            x: 125,
                            y: -62.5,
                            z: 0
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 375,
                            z: 5
                        },
                        init: {
                            x: -125,
                            y: -62.5,
                            z: 0
                        }
                    }, {
                        geo: {
                            x: 255,
                            y: 5,
                            z: 5
                        },
                        init: {
                            x: 0,
                            y: 125,
                            z: 0
                        }
                    }
                ]
            }
        case 'circle':
            return {
                sticks: [
                    {
                        name: '1',
                        init: {
                            x: 597,
                            y: -180,
                            z: 0
                        }
                    },
                    {
                        name: '2',
                        init: {
                            x: 597 * Math.cos(2 * Math.PI * 1 / 11),
                            y: -180,
                            z: 597 * Math.sin(2 * Math.PI * 1 / 11)
                        }
                    },
                    {
                        name: '3',
                        init: {
                            x: 597 * Math.cos(2 * Math.PI * 2 / 11),
                            y: -180,
                            z: 597 * Math.sin(2 * Math.PI * 2 / 11)
                        }
                    },
                    {
                        name: '4',
                        init: {
                            x: 597 * Math.cos(2 * Math.PI * 3 / 11),
                            y: -180,
                            z: 597 * Math.sin(2 * Math.PI * 3 / 11)
                        }
                    },
                    {
                        name: '5',
                        init: {
                            x: 597 * Math.cos(2 * Math.PI * 4 / 11),
                            y: -180,
                            z: 597 * Math.sin(2 * Math.PI * 4 / 11)
                        }
                    },
                    {
                        name: '6',
                        init: {
                            x: 597 * Math.cos(2 * Math.PI * 5 / 11),
                            y: -180,
                            z: 597 * Math.sin(2 * Math.PI * 5 / 11)
                        }
                    },
                    {
                        name: '7',
                        init: {
                            x: 597 * Math.cos(2 * Math.PI * 6 / 11),
                            y: -180,
                            z: 597 * Math.sin(2 * Math.PI * 6 / 11)
                        }
                    },
                    {
                        name: '8',
                        init: {
                            x: 597 * Math.cos(2 * Math.PI * 7 / 11),
                            y: -180,
                            z: 597 * Math.sin(2 * Math.PI * 7 / 11)
                        }
                    },
                    {
                        name: '9',
                        init: {
                            x: 597 * Math.cos(2 * Math.PI * 8 / 11),
                            y: -180,
                            z: 597 * Math.sin(2 * Math.PI * 8 / 11)
                        }
                    },
                    {
                        name: '10',
                        init: {
                            x: 597 * Math.cos(2 * Math.PI * 9 / 11),
                            y: -180,
                            z: 597 * Math.sin(2 * Math.PI * 9 / 11)
                        }
                    },
                    {
                        name: '11',
                        init: {
                            x: 597 * Math.cos(2 * Math.PI * 10 / 11),
                            y: -180,
                            z: 597 * Math.sin(2 * Math.PI * 10 / 11)
                        }
                    }
                ],
                sensors: [
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
                ],
                poles: [
                    {
                        geo: {
                            x: 5,
                            y: 375,
                            z: 5
                        },
                        init: {
                            x: 600,
                            y: -62.5,
                            z: 0
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 375,
                            z: 5
                        },
                        init: {
                            x: 600 * Math.cos(2 * Math.PI * 1 / 11),
                            y: -62.5,
                            z: 600 * Math.sin(2 * Math.PI * 1 / 11)
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 375,
                            z: 5
                        },
                        init: {
                            x: 600 * Math.cos(2 * Math.PI * 2 / 11),
                            y: -62.5,
                            z: 600 * Math.sin(2 * Math.PI * 2 / 11)
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 375,
                            z: 5
                        },
                        init: {
                            x: 600 * Math.cos(2 * Math.PI * 3 / 11),
                            y: -62.5,
                            z: 600 * Math.sin(2 * Math.PI * 3 / 11)
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 375,
                            z: 5
                        },
                        init: {
                            x: 600 * Math.cos(2 * Math.PI * 4 / 11),
                            y: -62.5,
                            z: 600 * Math.sin(2 * Math.PI * 4 / 11)
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 375,
                            z: 5
                        },
                        init: {
                            x: 600 * Math.cos(2 * Math.PI * 5 / 11),
                            y: -62.5,
                            z: 600 * Math.sin(2 * Math.PI * 5 / 11)
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 375,
                            z: 5
                        },
                        init: {
                            x: 600 * Math.cos(2 * Math.PI * 6 / 11),
                            y: -62.5,
                            z: 600 * Math.sin(2 * Math.PI * 6 / 11)
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 375,
                            z: 5
                        },
                        init: {
                            x: 600 * Math.cos(2 * Math.PI * 7 / 11),
                            y: -62.5,
                            z: 600 * Math.sin(2 * Math.PI * 7 / 11)
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 375,
                            z: 5
                        },
                        init: {
                            x: 600 * Math.cos(2 * Math.PI * 8 / 11),
                            y: -62.5,
                            z: 600 * Math.sin(2 * Math.PI * 8 / 11)
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 375,
                            z: 5
                        },
                        init: {
                            x: 600 * Math.cos(2 * Math.PI * 9 / 11),
                            y: -62.5,
                            z: 600 * Math.sin(2 * Math.PI * 9 / 11)
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 375,
                            z: 5
                        },
                        init: {
                            x: 600 * Math.cos(2 * Math.PI * 10 / 11),
                            y: -62.5,
                            z: 600 * Math.sin(2 * Math.PI * 10 / 11)
                        }
                    }
                ]
            }
        case 'realistic':
            return {
                sticks: [
                    {
                        name: '1',
                        init: {
                            x: 0,
                            y: 0,
                            z: 0
                        }
                    },
                    {
                        name: '2',
                        init: {
                            x: 147,
                            y: -130,
                            z: 0
                        }
                    },
                    {
                        name: '3',
                        init: {
                            x: 72,
                            y: -130,
                            z: 126
                        }
                    },
                    {
                        name: '4',
                        init: {
                            x: -72,
                            y: -130,
                            z: 126
                        }
                    },
                    {
                        name: '5',
                        init: {
                            x: -147,
                            y: -130,
                            z: 0
                        }
                    },
                    {
                        name: '6',
                        init: {
                            x: -72,
                            y: 0,
                            z: -126
                        }
                    },
                    {
                        name: '7',
                        init: {
                            x: 72,
                            y: 0,
                            z: -126
                        }
                    },
                    {
                        name: '8',
                        init: {
                            x: 297,
                            y: -130,
                            z: 0
                        }
                    },
                    {
                        name: '9',
                        init: {
                            x: 147,
                            y: -130,
                            z: 256
                        }
                    },
                    {
                        name: '10',
                        init: {
                            x: -147,
                            y: -130,
                            z: 256
                        }
                    },
                    {
                        name: '11',
                        init: {
                            x: -297,
                            y: -130,
                            z: 0
                        }
                    }
                ],
                sensors: [
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
                ],
                poles: [
                    {
                        geo: {
                            x: 5,
                            y: 500,
                            z: 5
                        },
                        init: {
                            x: 0,
                            y: 0,
                            z: 0
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 400,
                            z: 5
                        },
                        init: {
                            x: 150,
                            y: -50,
                            z: 0
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 400,
                            z: 5
                        },
                        init: {
                            x: 75,
                            y: -50,
                            z: 129.9038106
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 400,
                            z: 5
                        },
                        init: {
                            x: -75,
                            y: -50,
                            z: 129.9038106
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 400,
                            z: 5
                        },
                        init: {
                            x: -150,
                            y: -50,
                            z: 0
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 500,
                            z: 5
                        },
                        init: {
                            x: -75,
                            y: 0,
                            z: -129
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 500,
                            z: 5
                        },
                        init: {
                            x: 75,
                            y: 0,
                            z: -129
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 400,
                            z: 5
                        },
                        init: {
                            x: 300,
                            y: -50,
                            z: 0
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 400,
                            z: 5
                        },
                        init: {
                            x: 150,
                            y: -50,
                            z: 259.8076211
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 400,
                            z: 5
                        },
                        init: {
                            x: -150,
                            y: -50,
                            z: 259.8076211
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 400,
                            z: 5
                        },
                        init: {
                            x: -300,
                            y: -50,
                            z: 0
                        }
                    },
                    // Inner perimeter
                    {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: 112.5,
                            y: 50,
                            z: 64.95190528
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 60 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: 0,
                            y: 50,
                            z: 129.9038106
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 0 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: -112.5,
                            y: 50,
                            z: 64.95190528
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: -60 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: -112.5,
                            y: 50,
                            z: -64.95190528
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 240 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: 0,
                            y: 50,
                            z: -129.9038106
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 180 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: 112.5,
                            y: 50,
                            z: -64.95190528
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 120 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: 112.5,
                            y: 150,
                            z: 64.95190528
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 60 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: 0,
                            y: 150,
                            z: 129.9038106
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 0 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: -112.5,
                            y: 150,
                            z: 64.95190528
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: -60 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: -112.5,
                            y: 150,
                            z: -64.95190528
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 240 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: 0,
                            y: 150,
                            z: -129.9038106
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 180 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: 112.5,
                            y: 150,
                            z: -64.95190528
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 120 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    },
                    // Outer perimeter
                    {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: 225,
                            y: 50,
                            z: 129.9038106
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 60 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: 0,
                            y: 50,
                            z: 259.8076211
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 0 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: -225,
                            y: 50,
                            z: 129.9038106
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: -60 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: 225,
                            y: 150,
                            z: 129.9038106
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 60 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: 0,
                            y: 150,
                            z: 259.8076211
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 0 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: -225,
                            y: 150,
                            z: 129.9038106
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: -60 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    },
                    // Diagonal poles
                    {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: 150,
                            y: 50,
                            z: 0
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 0 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: 75,
                            y: 50,
                            z: 129.9038106
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: -60 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: -75,
                            y: 50,
                            z: 129.9038106
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: -120 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: -150,
                            y: 50,
                            z: 0
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 180 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: -37.5,
                            y: 50,
                            z: -64.95191
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 120 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: 37.5,
                            y: 50,
                            z: -64.95191
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 60 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: 150,
                            y: 150,
                            z: 0
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 0 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: 75,
                            y: 150,
                            z: 129.9038106
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: -60 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: -75,
                            y: 150,
                            z: 129.9038106
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: -120 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: -150,
                            y: 150,
                            z: 0
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 180 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: -37.5,
                            y: 150,
                            z: -64.95191
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 120 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 150,
                            z: 5
                        },
                        init: {
                            x: 37.5,
                            y: 150,
                            z: -64.95191
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: 60 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    },
                    // Entrance
                    {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: 187.5,
                            y: 150,
                            z: -64.95191
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: -30 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: -187.5,
                            y: 150,
                            z: -64.95191
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: -150 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: 187.5,
                            y: 50,
                            z: -64.95191
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: -30 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }, {
                        geo: {
                            x: 5,
                            y: 300,
                            z: 5
                        },
                        init: {
                            x: -187.5,
                            y: 50,
                            z: -64.95191
                        },
                        euler: {
                            x: 0 / 180 * Math.PI,
                            y: -150 / 180 * Math.PI,
                            z: 90 / 180 * Math.PI
                        }
                    }
                ]
            }
        default:
            console.log('You need to pick up structure you would use')
            return
    }
}
