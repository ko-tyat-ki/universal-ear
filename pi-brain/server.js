const net = require('net')

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port1 = new SerialPort('/dev/ttyACM1', {
  baudRate: 9600
})
const parser1 = port1.pipe(new Readline({ delimiter: '\n' }))

const port2 = new SerialPort('/dev/ttyACM2', {
  baudRate: 9600
})
const parser2 = port2.pipe(new Readline({ delimiter: '\n' }))

const ports = [port1, port2]

const parsers = [parser1, parser2]

const dividers = [200.0 , 500.0]

const client = net.createConnection({ port: 8124 }).on('error', () => {
  console.log('disconnected from server')
})

parsers.map( (parser, key) => {
  let lastSendTime = 0

  parser.on('data', function (data) {
    const sensorValue = parseInt(data, 10)
    console.log(`Sensor value ${key}:`, sensorValue)

    client.write(Buffer.from(`${sensorValue}`))

    // do the math
    const outVale = Math.floor((sensorValue / dividers[key]) * 40) //number of LEDs to l$

    lastSendTime = Date.now()
    ports[key].write(outVale + "\n", function(err) {
      console.log(`Send value ${key}:`, outVale)

      if (err) {
        return console.log('Error on write: ', err.message)
      }
    })
  })

  // Open errors will be emitted as an error event
  ports[key].on('error', function(err) {
    console.log('Error: ', err.message)
  })


  // Send heartbeat signal every 3 seconds
  setInterval(function() {
    if (Date.now() - lastSendTime < 3000){
      return
    }

    console.log(`Heartbeat ${key}`)
    ports[key].write(5 + "\n", function(err) {
      if (err) {
        return console.log('Error on write: ', err.message)
      }
    })
  }, 1000)
})
