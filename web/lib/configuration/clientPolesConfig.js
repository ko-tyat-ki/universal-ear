/* global console */

export const calculateClientPoles = (selectedStructure) => {
    switch (selectedStructure) {
        case 'duet':
            return [{
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
            }]
        case 'circle':
            return [
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
        case 'realistic':
            return [
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
        case 'final':
            return [
                // vertical poles
                {
                    geo: {
                        x: 5,
                        y: 400,
                        z: 5
                    },
                    init: {
                        x: -75,
                        y: -50,
                        z: 225
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
                        z: 225
                    }
                }, {
                    geo: {
                        x: 5,
                        y: 400,
                        z: 5
                    },
                    init: {
                        x: -225,
                        y: -50,
                        z: 75
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
                        z: 75
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
                        z: 75
                    }
                }, {
                    geo: {
                        x: 5,
                        y: 400,
                        z: 5
                    },
                    init: {
                        x: 225,
                        y: -50,
                        z: 75
                    }
                }, {
                    geo: {
                        x: 5,
                        y: 400,
                        z: 5
                    },
                    init: {
                        x: -225,
                        y: -50,
                        z: -75
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
                        z: -75
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
                        z: -75
                    }
                }, {
                    geo: {
                        x: 5,
                        y: 400,
                        z: 5
                    },
                    init: {
                        x: 225,
                        y: -50,
                        z: -75
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
                        z: -225
                    }
                },
                {
                    geo: {
                        x: 5,
                        y: 400,
                        z: 5
                    },
                    init: {
                        x: 75,
                        y: -50,
                        z: -225
                    }
                },
                // Horizontal
                {
                    geo: {
                        x: 5,
                        y: 450,
                        z: 5
                    },
                    init: {
                        x: 0,
                        y: 100,
                        z: 75
                    },
                    euler: {
                        x: 0 / 180 * Math.PI,
                        y: 0 / 180 * Math.PI,
                        z: 90 / 180 * Math.PI
                    }
                },
                {
                    geo: {
                        x: 5,
                        y: 450,
                        z: 5
                    },
                    init: {
                        x: 0,
                        y: 100,
                        z: -75
                    },
                    euler: {
                        x: 0 / 180 * Math.PI,
                        y: 0 / 180 * Math.PI,
                        z: 90 / 180 * Math.PI
                    }
                },
                {
                    geo: {
                        x: 5,
                        y: 450,
                        z: 5
                    },
                    init: {
                        x: 0,
                        y: 150,
                        z: 75
                    },
                    euler: {
                        x: 0 / 180 * Math.PI,
                        y: 0 / 180 * Math.PI,
                        z: 90 / 180 * Math.PI
                    }
                },
                {
                    geo: {
                        x: 5,
                        y: 450,
                        z: 5
                    },
                    init: {
                        x: 0,
                        y: 150,
                        z: -75
                    },
                    euler: {
                        x: 0 / 180 * Math.PI,
                        y: 0 / 180 * Math.PI,
                        z: 90 / 180 * Math.PI
                    }
                },
                {
                    geo: {
                        x: 5,
                        y: 450,
                        z: 5
                    },
                    init: {
                        x: 75,
                        y: 150,
                        z: 0
                    },
                    euler: {
                        x: 0 / 180 * Math.PI,
                        y: 90 / 180 * Math.PI,
                        z: 90 / 180 * Math.PI
                    }
                },
                {
                    geo: {
                        x: 5,
                        y: 450,
                        z: 5
                    },
                    init: {
                        x: 75,
                        y: 100,
                        z: 0
                    },
                    euler: {
                        x: 0 / 180 * Math.PI,
                        y: 90 / 180 * Math.PI,
                        z: 90 / 180 * Math.PI
                    }
                },
                {
                    geo: {
                        x: 5,
                        y: 450,
                        z: 5
                    },
                    init: {
                        x: -75,
                        y: 100,
                        z: 0
                    },
                    euler: {
                        x: 0 / 180 * Math.PI,
                        y: 90 / 180 * Math.PI,
                        z: 90 / 180 * Math.PI
                    }
                },
                {
                    geo: {
                        x: 5,
                        y: 450,
                        z: 5
                    },
                    init: {
                        x: -75,
                        y: 150,
                        z: 0
                    },
                    euler: {
                        x: 0 / 180 * Math.PI,
                        y: 90 / 180 * Math.PI,
                        z: 90 / 180 * Math.PI
                    }
                }
            ]
        default:
            console.log('You need to pick up structure you would use')
            return
    }
}
