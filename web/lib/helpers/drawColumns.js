import { Arduino } from "../classes/arduino.js";
import { Column } from "../classes/column.js";

const numberOfLEDs = 40;

export const drawColumns = columnsInput => {
  const columns = [];
  const arduinos = [];

  columnsInput.forEach(column => {
    const div = document.createElement("div");
    div.className = `column column-${column.key}`;
    div.id = `column-${column.key}`;
    document.getElementById("container").appendChild(div);
    columns.push(new Column(column, numberOfLEDs));
    arduinos.push(new Arduino(0, column));
  });

  return {
    columns,
    arduinos
  };
};
