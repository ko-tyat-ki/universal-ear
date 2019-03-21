import { sleep } from "./lib/helpers/sleep.js";
import { drawColumns } from "./lib/helpers/drawColumns.js";

import { basic } from "./lib/functions/basic.js";
import { randomEcho } from "./lib/functions/randomEcho.js";
import { flicker } from "./lib/functions/flicker.js";

const connectArduinosWithColumns = async ({ arduinos, columns }) => {
  const selectedFunction = document.getElementById("select-regime").options
    .selectedIndex;

  switch (selectedFunction) {
    case 0:
      basic({
        arduinos,
        columns
      });
      break;
    case 1:
      randomEcho({
        arduinos,
        columns
      });
      break;
    case 2:
      flicker({
        arduinos,
        columns
      });
      break;
    case 3:
      console.log("No function is written for this option yet");
      break;
    default:
      console.log("You need to pick up function you would use");
  }
};

const buildColumns = async configuration => {
  const selectedFunction = configuration.options.selectedIndex;
  let columnKeys;

  switch (selectedFunction) {
    case 0:
      columnKeys = ["a", "s"];
      break;
    case 1:
      columnKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      break;
    default:
      console.log("You need to pick up configuration you would use");
      return;
  }

  return { ...drawColumns(columnKeys), columnKeys };
};

const cleanScreen = columnKeys => {
  columnKeys.forEach(columnKey => {
    const column = document.getElementById(`column-${columnKey}`);
    document.getElementById("container").removeChild(column);
  });
};

(async () => {
  let currentTime = Date.now();
  const configuration = document.getElementById("select-configuaration");

  let { columns, arduinos, columnKeys } = await buildColumns(configuration);
  configuration.addEventListener("change", async () => {
    cleanScreen(columnKeys);
    let update = await buildColumns(configuration);
    columns = update.columns;
    arduinos = update.arduinos;
    columnKeys = update.columnKeys;
  });

  while (true) {
    let delta = Date.now() - currentTime;

    arduinos.forEach(arduino => {
      arduino.update(delta);
    });

    currentTime = Date.now();
    await sleep(10);

    await connectArduinosWithColumns({
      arduinos,
      columns
    });
  }
})();
