import requests

ports = [
    {
        "name": "/dev/ttyAMA0",
        "column": 1,
    },
    {
        "name": "/dev/ttyUSB0",
        "column": 2,
    },
    {
        "name": "/dev/ttyUSB2",
        "column": 3,
    },
    {
        "name": "/dev/ttyUSB5",
        "column": 4,
    },
    {
        "name": "/dev/ttyUSB4",
        "column": 5,
    },
    {
        "name": "/dev/ttyUSB1",
        "column": 6,
    },
    {
        "name": "/dev/ttyUSB3",
        "column": 7,
    }
]

for port in ports:
    requests.post(
        "http://192.168.0.130:3000/stick",
        json=port
    )
