import net from 'net'
import { realSticks } from '../configuration/realSticksConfig';

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
      slow: sensor.slowSensorValue || 0, // in case if null or undefined
      fast: sensor.fastSensorValue || 0, // in case if null or undefined
      LEDShtuka: sensor.column || 'n/a',
      where: realSticks.find(stick => stick.name === sensor.column) ? (realSticks.find(stick => stick.name === sensor.column).init.x > 0 ? 'right' : 'left') : 'n/a'
    }))
  }

  pythonSocket.write(JSON.stringify(toPython))
}
