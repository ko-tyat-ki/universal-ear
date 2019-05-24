export const getDistance = ({
    sensorNumber,
    stickNumber
}) => {
    return Math.abs(sensorNumber - stickNumber)
}
