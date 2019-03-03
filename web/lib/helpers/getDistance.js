export const getDistance = ({
    arduino,
    column,
    names
}) => {
    return Math.abs(names.indexOf(arduino.key) - names.indexOf(column.columnName))
}
