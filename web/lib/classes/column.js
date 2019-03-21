const initColor = "#222";
const numberOfLEDs = 40;

export class Column {
  constructor(column, numberOfLEDs) {
    this.columnName = column.key;
    this.numberOfLEDs = numberOfLEDs;
    this.drawCells();
  }

  drawCells() {
    for (let key = 0; key < numberOfLEDs; key++) {
      const div = document.createElement("div");

      div.className = `cell cell-${key}-${this.columnName}`;
      div.id = `cell-${key}-${this.columnName}`;
      div.style["background-color"] = initColor;
      document.getElementById(`column-${this.columnName}`).appendChild(div);
    }
  }

  changeCellColor(cell, color) {
    const cellId = `cell-${cell}-${this.columnName}`;
    document.getElementById(cellId).style["background-color"] = color;
  }

  colorLeds(leds) {
    this.cleanLeds();

    leds.forEach(led => {
      this.changeCellColor(led.number, led.color);
    });
  }

  cleanLeds() {
    for (let key = 0; key < numberOfLEDs; key++) {
      this.changeCellColor(key, initColor);
    }
  }
}
