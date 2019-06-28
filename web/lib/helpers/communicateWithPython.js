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
      slow: sensor.slowSensorSpeed || -1, // in case if undefined
      fast: sensor.fastSensorSpeed || -1, // in case if undefined
      column: sensor.column || 'n/a'
    }))
  }

  pythonSocket.write(JSON.stringify(toPython))
}
