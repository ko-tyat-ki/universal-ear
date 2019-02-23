
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('/dev/tty.usbmodem14101')
const parser = port.pipe(new Readline({ delimiter: '\n' }))

var lastSendTime = 0



// Read data that is available but keep the stream in "paused mode"
port.on('readable', function () {
  console.log('Data:', port.read())
  port.write("1\n", function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
  })
})

parser.on('data', function (data) {
  dataStr = data.toString('utf8');
  console.log('Data:', dataStr)

  const sensorValue = parseInt(dataStr, 10)
  console.log('Sensor value:', sensorValue)

  // do the math
  const outVale = Math.floor((sensorValue / 200.0) * 40) //number of LEDs to light up

  lastSendTime = Date.now()
  port.write(outVale + "\n", function(err) {
    console.log("Send value:", outVale)
    if (err) {
      return console.log('Error on write: ', err.message)
    }
  })
})

// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message)
})


// Send heartbeat signal every 3 seconds
setInterval(function() {
  if (Date.now() - lastSendTime < 3000){
    return
  }

  console.log('Heartbeat')
  port.write(5 + "\n", function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
  })
}, 1000)
