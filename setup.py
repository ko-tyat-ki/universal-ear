import requests

ports = [
    {
        "name": "/dev/ttyUSB1",
        "column": '1',
    },
    {
        "name": "/dev/ttyUSB2",
        "column": '2',
    },
    {
        "name": "/dev/ttyUSB3",
        "column": '3',
    },
    {
        "name": "/dev/ttyUSB4",
        "column": '4',
    },
    {
        "name": "/dev/ttyUSB5",
        "column": '5',
    },
    {
        "name": "/dev/ttyUSB6",
        "column": '6',
    },
    {
        "name": "/dev/ttyUSB7",
        "column": '7',
    },
    {
        "name": "/dev/ttyUSB8",
        "column": '8',
    },
    {
        "name": "/dev/ttyUSB9",
        "column": '9',
    },
    {
        "name": "/dev/ttyUSB0",
        "column": '10',
    },
    {
        "name": "/dev/ttyAMA0",
        "column": '11',
    },
]

for port in ports:
    requests.post(
        "http://192.168.0.130:3000/stick",
        json=port
    )
