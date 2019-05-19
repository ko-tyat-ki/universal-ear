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
                        x: 0,
                        y: -50,
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
                        y: -50,
                        z: -126
                    },
                    {
                        x: 72,
                        y: -50,
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
                    }
                ]
            }
        default:
            console.log('You need to pick up structure you would use')
            return
    }
}