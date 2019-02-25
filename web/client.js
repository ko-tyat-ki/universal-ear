const initColor = '#222'
const brightColor = '#88b'
const numberOfLEDs = 30
const totalNumberOfColumns = 10

import { sleep } from '/lib/helpers/sleep.js'

class Arduino {
    constructor(tension, key) {
        this.minimalTension = tension
        this.tension = tension
        this.isBeingPulled = false
        this.tensionSpeed = 0.05
        this.key = key

        this.setKeyDownEventListener()
        this.setKeyUpEventListener()
    }

    setKeyDownEventListener() {
        document.addEventListener('keydown', (event) => {
            if (event.key === this.key.toString()) {
                this.isBeingPulled = true
            }
        }, false)
    }

    setKeyUpEventListener() {
        document.addEventListener('keyup', (event) => {
            if (event.key === this.key.toString()) {
                this.isBeingPulled = false
            }
        }, false)
    }

    read() {
        return this.tension
    }

    pull() {
        // TODO: pull speed
        this.tension += 1
    }

    update(delta) {
        let tension = this.tension

        if (this.isBeingPulled) {
            tension += this.tensionSpeed * delta
        } else {
            tension -= this.tensionSpeed * delta
        }

        this.tension = Math.max(
            this.minimalTension,
            tension
        )

        if (this.tension != this.minimalTension) {
            console.log("Arduino", this.key, this.tension, this.isBeingPulled)
        }
    }
}

class Column {
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

const connectArduinoWithColumn = async ({
    arduinos,
    columns
}) => {ommit
    for (let columnName in columns) {
        let column = columns[columnName]
        let arduino = arduinos[columnName]

        column.colorLeds(arduino.read())
    }
}

(async () => {
    let columns = {}
    let arduinos = {}

    for (let key = 0; key < totalNumberOfColumns; key++) {
        const div = document.createElement('div')
        div.className = `column column-${key}`
        div.id = `column-${key}`
        document.getElementById('container').appendChild(div)
        columns[key] = new Column(key)
        arduinos[key] = new Arduino(0, key)
    }

    let currentTime = Date.now()

    while (true) {
        let delta = Date.now() - currentTime

        for (let arduinoName in arduinos) {
            arduinos[arduinoName].update(delta)
        }

        currentTime = Date.now()
        await sleep(10)

        await connectArduinoWithColumn({
            arduinos,
            columns
        })
    }
})()
