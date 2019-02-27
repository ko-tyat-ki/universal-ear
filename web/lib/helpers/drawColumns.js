import { Arduino } from '../classes/arduino.js'
import { Column } from '../classes/column.js'

export const drawColumns = (columnKeys) => {
    const columns = []
    const arduinos = []

    columnKeys.forEach(key => {
        const div = document.createElement('div')
        div.className = `column column-${key}`
        div.id = `column-${key}`
        document.getElementById('container').appendChild(div)
        columns.push(new Column(key))
        arduinos.push(new Arduino(0, key))
    })

    return {
        columns,
        arduinos
    }
}
