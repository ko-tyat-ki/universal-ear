const initColor = '#222'
const brightColor = '#88b'
const numberOfLEDs = 40

export class Column {
    constructor(columnName) {
        this.columnName = columnName
        this.drawCells()
    }

    drawCells() {
        for (let key = 0; key < numberOfLEDs; key++) {
            const div = document.createElement('div')

            div.className = `cell cell-${key}-${this.columnName}`
            div.id = `cell-${key}-${this.columnName}`
            div.style['background-color'] = initColor
            document.getElementById(`column-${this.columnName}`).appendChild(div)
        }
    }

    changeCellColor(cell, color) {
        const cellId = `cell-${cell}-${this.columnName}`
        document.getElementById(cellId).style['background-color'] = color
    };

    colorLeds(tension) {
        this.cleanLeds()

        for (let key = 0; key < Math.min(tension, numberOfLEDs/2); key++) {
            this.changeCellColor(numberOfLEDs/2 - key, brightColor)
            this.changeCellColor(numberOfLEDs/2 + key, brightColor)
        }
    }

    cleanLeds() {
         for (let key = 0; key < numberOfLEDs; key++) {
             this.changeCellColor(key, initColor)
         }
    }
}
