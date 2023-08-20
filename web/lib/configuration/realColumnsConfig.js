/* global console */

export const calculateRealColumns = (selectedStructure) => {
    switch (selectedStructure) {
        case 'kyctst':
            return [{
                numberOfLEDs: 20,
                name: '1',
                init: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }]
        case 'duet':
            return [{
                numberOfLEDs: 40,
                name: '1',
                init: {
                    x: 125,
                    y: -180,
                    z: 0
                }
            },
            {
                numberOfLEDs: 40,
                name: '2',
                init: {
                    x: -125,
                    y: -180,
                    z: 0
                }
            }]
        case 'circle':
            return [{
                numberOfLEDs: 40,
                name: '1',
                init: {
                    x: 597,
                    y: -180,
                    z: 0
                }
            },
            {
                numberOfLEDs: 40,
                name: '2',
                init: {
                    x: 597 * Math.cos(2 * Math.PI * 1 / 11),
                    y: -180,
                    z: 597 * Math.sin(2 * Math.PI * 1 / 11)
                }
            },
            {
                numberOfLEDs: 40,
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
                numberOfLEDs: 40,
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
                numberOfLEDs: 40,
                name: '7',
                init: {
                    x: 597 * Math.cos(2 * Math.PI * 6 / 11),
                    y: -180,
                    z: 597 * Math.sin(2 * Math.PI * 6 / 11)
                }
            },
            {
                numberOfLEDs: 40,
                name: '8',
                init: {
                    x: 597 * Math.cos(2 * Math.PI * 7 / 11),
                    y: -180,
                    z: 597 * Math.sin(2 * Math.PI * 7 / 11)
                }
            },
            {
                numberOfLEDs: 40,
                name: '9',
                init: {
                    x: 597 * Math.cos(2 * Math.PI * 8 / 11),
                    y: -180,
                    z: 597 * Math.sin(2 * Math.PI * 8 / 11)
                }
            },
            {
                numberOfLEDs: 40,
                name: '10',
                init: {
                    x: 597 * Math.cos(2 * Math.PI * 9 / 11),
                    y: -180,
                    z: 597 * Math.sin(2 * Math.PI * 9 / 11)
                }
            },
            {
                numberOfLEDs: 40,
                name: '11',
                init: {
                    x: 597 * Math.cos(2 * Math.PI * 10 / 11),
                    y: -180,
                    z: 597 * Math.sin(2 * Math.PI * 10 / 11)
                }
            }]
        case 'nowhere2019':
            return [
                {
                    numberOfLEDs: 40,
                    name: '1',
                    init: {
                        x: 125,
                        y: -180,
                        z: 0
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '2',
                    init: {
                        x: -125,
                        y: -180,
                        z: 0
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '3',
                    init: {
                        x: 0,
                        y: -180,
                        z: 0
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '4',
                    init: {
                        x: 125,
                        y: -180,
                        z: -250
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '5',
                    init: {
                        x: 75,
                        y: -140,
                        z: 75
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '6',
                    init: {
                        x: 225,
                        y: -140,
                        z: 75
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '7',
                    init: {
                        x: -225,
                        y: -140,
                        z: -75
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '8',
                    init: {
                        x: -75,
                        y: -140,
                        z: -75
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '9',
                    init: {
                        x: 75,
                        y: -140,
                        z: -75
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '10',
                    init: {
                        x: 225,
                        y: -140,
                        z: -75
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '11',
                    init: {
                        x: -75,
                        y: -140,
                        z: -225
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '12',
                    init: {
                        x: 75,
                        y: -140,
                        z: -225
                    }
                }]
        case 'summerRave2019':
            return [
                {
                    numberOfLEDs: 40,
                    name: '1',
                    init: {
                        x: 125,
                        y: -180,
                        z: 0
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '2',
                    init: {
                        x: -125,
                        y: -180,
                        z: 0
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '3',
                    init: {
                        x: 0,
                        y: -180,
                        z: 0
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '4',
                    init: {
                        x: 125,
                        y: -180,
                        z: -250
                    }
                }]
        case 'londonDecompression2019':
            return [
                {
                    numberOfLEDs: 40,
                    name: '1',
                    init: {
                        x: -250,
                        y: -180,
                        z: 300
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '2',
                    init: {
                        x: -250,
                        y: -180,
                        z: 200
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '3',
                    init: {
                        x: -250,
                        y: -180,
                        z: 100
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '4',
                    init: {
                        x: -150,
                        y: -180,
                        z: 0
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '5',
                    init: {
                        x: -50,
                        y: -180,
                        z: 0
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '6',
                    init: {
                        x: 50,
                        y: -180,
                        z: 0
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '7',
                    init: {
                        x: 150,
                        y: -180,
                        z: 0
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '8',
                    init: {
                        x: 250,
                        y: -180,
                        z: 100
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '9',
                    init: {
                        x: 250,
                        y: -180,
                        z: 200
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '10',
                    init: {
                        x: 250,
                        y: -180,
                        z: 300
                    }
                }
            ]
            case 'mcf-mb-2022':
                return [{
                    numberOfLEDs: 40,
                    name: '1',
                    init: {
                        x: 397,
                        y: -180,
                        z: 0
                    }
                },
                {
                    numberOfLEDs: 40,
                    name: '2',
                    init: {
                        x: 397 * Math.cos(2 * Math.PI * 1 / 5),
                        y: -180,
                        z: 397 * Math.sin(2 * Math.PI * 1 / 5)
                    }
                },
                {
                    numberOfLEDs: 40,
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
                    numberOfLEDs: 40,
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
