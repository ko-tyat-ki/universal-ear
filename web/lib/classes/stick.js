/* global document */
/* global console */

const initColor = "#222"

export class Stick {
	constructor(column, numberOfLEDs, ColumnLEDs) {
		this.columnName = column.key
		this.numberOfLEDs = numberOfLEDs
		this.ColumnsLEDs = ColumnLEDs
		this.drawCells()
	}

	drawCells() {
		for (let key = 0; key < this.numberOfLEDs; key++) {
			const div = document.createElement("div")

			div.className = `cell cell-${key}-${this.columnName}`
			div.id = `cell-${key}-${this.columnName}`
			div.style["background-color"] = initColor
			document.getElementById(`column-${this.columnName}`).appendChild(div)
		}
	}

	changeCellColor(cell, color) {
		const cellId = `cell-${cell}-${this.columnName}`
		document.getElementById(cellId).style["background-color"] = color
	}

	colorLeds(leds) {
		this.cleanLeds()

		leds.forEach(led => {
			this.changeCellColor(led.number, led.color)
			this.ColumnsLEDs[led.number].material.color.setHex(0xff55ff)
		})
	}

	cleanLeds() {
		for (let key = 0; key < this.numberOfLEDs; key++) {
			this.changeCellColor(key, initColor)
			this.ColumnsLEDs[key].material.color.setHex(0x222222)
		}
	}
}
