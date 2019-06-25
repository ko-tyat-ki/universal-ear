export const getDistance = ({
    sensor,
    stick,
    allSticks
}) => {
    const sensorStick = allSticks.find(stick => {
        return sensor.column === stick.name
    })
    return Math.sqrt(Math.pow((sensorStick.init.x - stick.init.x), 2) + Math.pow((sensorStick.init.z - stick.init.z), 2))
}
