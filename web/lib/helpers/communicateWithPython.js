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

(() => {
  connectToPython()
})()

export const writeToPython = (sensorsData, currentMode) => {
  if (!isConnectedToPython || !sensorsData || sensorsData.length === 0) return

  const toPython = {
    mode: currentMode || 'RESETTING',
    sensorsData: sensorsData.map(sensor => ({
      name: sensor.key || 'n/a',
      slow: sensor.slowSensorValue || 0, // in case if null or undefined
      fast: sensor.fastSensorValue || 0, // in case if null or undefined
      column: sensor.column || 'n/a'
    }))
  }

  pythonSocket.write(JSON.stringify(toPython))
}
