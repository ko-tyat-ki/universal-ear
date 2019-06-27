import net from 'net'

let isConnectedToPython = false
let pythonSocket = null

const connectToPython = () => {
  if (pythonSocket) return

  pythonSocket = net.createConnection({
    port: 8124,
    host: 'localhost'
  }).on('error', () => {
    pythonSocket.destroy()
    pythonSocket = null
    isConnectedToPython = false
    console.log('python disconnected')
    setTimeout(connectToPython, 2000)
  }).on('connect', () => {
    isConnectedToPython = true
    console.log('connection established');
  })
}

connectToPython()

export const writeToPython = (sensorsData, currentMode) => {
  if (!isConnectedToPython) return

  const toPython = {
    mode: currentMode,
    sensorsData: sensorsData.map(sensor => ({
      name: sensor.key,
      slow: sensor.slowSensorSpeed,
      fast: sensor.fastSensorSpeed
    }))
  }

  let toSend = JSON.stringify(toPython);
  pythonSocket.write(toSend)
}
