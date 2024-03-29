/* global console */

export const calculateClientSticks = (selectedStructure) => {
    switch (selectedStructure) {
        case 'duet':
            return [
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
            ]
        case 'summerRave2019':
            return [
                {
                    name: '1',
                    init: {
                        x: 125,
                        y: -180,
                        z: 0
                    }
                },
                {
                    name: '2',
                    init: {
                        x: -125,
                        y: -180,
                        z: 0
                    }
                },
                {
                    name: '3',
                    init: {
                        x: 0,
                        y: -180,
                        z: 0
                    }
                },
                {
                    name: '4',
                    init: {
                        x: 125,
                        y: -180,
                        z: -250
                    }
                }
            ]
        case 'londonDecompression2019':
            return [
                {
                    name: '1',
                    init: {
                        x: -250,
                        y: -180,
                        z: 300
                    }
                },
                {
                    name: '2',
                    init: {
                        x: -250,
                        y: -180,
                        z: 200
                    }
                },
                {
                    name: '3',
                    init: {
                        x: -250,
                        y: -180,
                        z: 100
                    }
                },
                {
                    name: '4',
                    init: {
                        x: -150,
                        y: -180,
                        z: 0
                    }
                },
                {
                    name: '5',
                    init: {
                        x: -50,
                        y: -180,
                        z: 0
                    }
                },
                {
                    name: '6',
                    init: {
                        x: 50,
                        y: -180,
                        z: 0
                    }
                },
                {
                    name: '7',
                    init: {
                        x: 150,
                        y: -180,
                        z: 0
                    }
                },
                {
                    name: '8',
                    init: {
                        x: 250,
                        y: -180,
                        z: 100
                    }
                },
                {
                    name: '9',
                    init: {
                        x: 250,
                        y: -180,
                        z: 200
                    }
                },
                {
                    name: '10',
                    init: {
                        x: 250,
                        y: -180,
                        z: 300
                    }
                }
            ]
        case 'circle':
            return [
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
            ]
        case 'realistic':
            return [
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
            ]
        case 'nowhere2019':
            return [
                {
                    name: '1',
                    init: {
                        x: -75,
                        y: -140,
                        z: 225
                    }
                },
                {
                    name: '2',
                    init: {
                        x: 75,
                        y: -140,
                        z: 225
                    }
                },
                {
                    name: '3',
                    init: {
                        x: -225,
                        y: -140,
                        z: 75
                    }
                },
                {
                    name: '4',
                    init: {
                        x: -75,
                        y: -140,
                        z: 75
                    }
                },
                {
                    name: '5',
                    init: {
                        x: 75,
                        y: -140,
                        z: 75
                    }
                },
                {
                    name: '6',
                    init: {
                        x: 225,
                        y: -140,
                        z: 75
                    }
                },
                {
                    name: '7',
                    init: {
                        x: -225,
                        y: -140,
                        z: -75
                    }
                },
                {
                    name: '8',
                    init: {
                        x: -75,
                        y: -140,
                        z: -75
                    }
                },
                {
                    name: '9',
                    init: {
                        x: 75,
                        y: -140,
                        z: -75
                    }
                },
                {
                    name: '10',
                    init: {
                        x: 225,
                        y: -140,
                        z: -75
                    }
                },
                {
                    name: '11',
                    init: {
                        x: -75,
                        y: -140,
                        z: -225
                    }
                },
                {
                    name: '12',
                    init: {
                        x: 75,
                        y: -140,
                        z: -225
                    }
                }
            ]
            case 'mcf-mb-2022':
                return [
                    {
                        name: '1',
                        init: {
                            x: 397,
                            y: -180,
                            z: 0
                        }
                    },
                    {
                        name: '2',
                        init: {
                            x: 397 * Math.cos(2 * Math.PI * 1 / 5),
                            y: -180,
                            z: 397 * Math.sin(2 * Math.PI * 1 / 5)
                        }
                    },
                    {
                        name: '3',
                        init: {
                            x: 397 * Math.cos(2 * Math.PI * 2 / 5),
                            y: -180,
                            z: 397 * Math.sin(2 * Math.PI * 2 / 5)
                        }
                    },
                    {
                        name: '4',
                        init: {
                            x: 397 * Math.cos(2 * Math.PI * 3 / 5),
                            y: -180,
                            z: 397 * Math.sin(2 * Math.PI * 3 / 5)
                        }
                    },
                    {
                        name: '5',
                        init: {
                            x: 397 * Math.cos(2 * Math.PI * 4 / 5),
                            y: -180,
                            z: 397 * Math.sin(2 * Math.PI * 4 / 5)
                        }
                    }
                ]
        default:
            console.log('You need to pick up structure you would use')
            return
    }
}
