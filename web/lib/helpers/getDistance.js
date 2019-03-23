export const getDistance = ({
    arduino,
    column,
    names
}) => {
    console.log("distance")
    console.log(names)
    console.log(arduino.key)
    console.log(column.columnName)
    console.log(names.indexOf(arduino.key))
    console.log(names.indexOf(column.columnName))

    return Math.abs(names.indexOf(arduino.key) - names.indexOf(column.columnName))
}
