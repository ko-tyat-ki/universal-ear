export const getDistance = ({
    sensor,
    stick,
    names
}) => {
    return Math.abs(names.indexOf(sensor.key) - stick.stickName)
}
