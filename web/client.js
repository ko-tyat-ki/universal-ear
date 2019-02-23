const initColor = '#222';
const brightColor = '#88b';
const numberOfLEDs = 30;

class Column {
    constructor (columnNumber) {
        this.time = 0;
        this.isKeyUp = true;
        this.columnNumber = columnNumber;

        this.drawCells();
        this.listen();        
    }

    drawCells() {
        for (let key = 0; key < numberOfLEDs; key++) {
            const div = document.createElement('div');
            div.className = `cell cell-${key}-${this.columnNumber}`;
            div.id = `cell-${key}-${this.columnNumber}`;
            div.style['background-color'] = initColor;
            document.getElementById(`column-${this.columnNumber}`).appendChild(div);
        };
    }

    listen() {
        document.addEventListener('keydown', (event) => {
            this.isKeyUp = true;
            if (event.key === this.columnNumber.toString()) {
                if (this.isKeyUp) {
                    this.time++;
                }
                this.ledsGrow();
            }    
        }, false);
        
        document.addEventListener('keyup', (event) => {
            if (event.key === this.columnNumber.toString()) {
                this.time = 0;
                this.isKeyUp = false;
                this.ledsClean();
            }
        }, false);
    }

    changeCellColor(cell, color) {
        const cellId = `cell-${cell}-${this.columnNumber}`;
        document.getElementById(cellId).style['background-color'] = color;
    };

    ledsGrow() {
        for (let key = 0; key < this.time; key++) {
            this.changeCellColor(numberOfLEDs/2 - key, brightColor);
            this.changeCellColor(numberOfLEDs/2 + key, brightColor);
        }
    }
    
   ledsClean() {
        for (let key = 0; key < numberOfLEDs; key++) {
            this.changeCellColor(key, initColor);
        }
    };
}

const setup = () => {
    const totalNumberOfColumns = 9;

    for (let key = 0; key < totalNumberOfColumns; key++) {
        const div = document.createElement('div');
        div.className = `column column-${key}`;
        div.id = `column-${key}`;
        document.getElementById('container').appendChild(div);
        new Column(key);
    }
};

setup();