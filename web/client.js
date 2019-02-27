import { sleep } from './lib/helpers/sleep.js'
import { drawColumns } from './lib/helpers/drawColumns.js'

const connectArduinosWithColumns = async ({
    arduinos,
    columns
}) => {
    for (let columnName in columns) {
        let column = columns[columnName]
        let arduino = arduinos[columnName]

        column.colorLeds(arduino.read())
    }
}

(async () => {
    const columnKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    const {
        columns,
        arduinos
    } = drawColumns(columnKeys)

    let currentTime = Date.now()

    while (true) {
        let delta = Date.now() - currentTime

        arduinos.forEach(arduino => {
            arduino.update(delta)
        })

        currentTime = Date.now()
        await sleep(10)

        await connectArduinosWithColumns({
            arduinos,
            columns
        })
    }
})()
