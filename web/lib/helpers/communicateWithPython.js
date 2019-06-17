import net from 'net'

const pythonClient = net.createConnection({ port: 8124 }).on('error', () => {
    console.log('python disconnected')
})

export const writeToPython = (sensorsData, currentMode) => {
    const toPython = sensorsData.map(sensor => ({
        name: sensor.key,
        slow: sensor.slowSensorSpeed,
        fast: sensor.fastSensorSpeed
    }))
    toPython.mode = currentMode
    pythonClient.write(JSON.stringify(toPython))
}