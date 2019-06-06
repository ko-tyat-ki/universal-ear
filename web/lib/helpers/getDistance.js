export const getDistance = ({
    sensor,
    stick,
    allSticks
}) => {
    const sensorStick = allSticks.find(stick => {
        return sensor.column === stick.name
    })
    // console.log('1', sensorStick.init.x - stick.init.x)
    // console.log('2', sensorStick.init.z - stick.init.z)
    // console.log('3', (sensorStick.init.x - stick.init.x) ^ 2 + (sensorStick.init.z - stick.init.z) ^ 2)
    return Math.sqrt(Math.pow((sensorStick.init.x - stick.init.x), 2) + Math.pow((sensorStick.init.z - stick.init.z), 2))
}
