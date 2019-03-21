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
  let columns;

  switch (selectedFunction) {
    case 0:
      columns = [
        {
          key: "a",
          sensorPosition: 10
        },
        {
          key: "s",
          sensorPosition: 30
        }
      ];
      break;
    case 1:
      columns = [
        {
          key: "0",
          sensorPosition: 20
        },
        {
          key: "1",
          sensorPosition: 20
        },
        {
          key: "2",
          sensorPosition: 20
        },
        {
          key: "3",
          sensorPosition: 20
        },
        {
          key: "4",
          sensorPosition: 20
        },
        {
          key: "5",
          sensorPosition: 20
        },
        {
          key: "6",
          sensorPosition: 20
        },
        {
          key: "7",
          sensorPosition: 20
        },
        {
          key: "8",
          sensorPosition: 20
        },
        {
          key: "9",
          sensorPosition: 20
        }
      ];
      break;
    default:
      console.log("You need to pick up configuration you would use");
      return;
  }

  return {
    ...drawColumns(columns),
    columnKeys: columns.map(column => column.key)
  };
};

const cleanScreen = columnKeys => {
  columnKeys.forEach(columnKey => {
    const columnEl = document.getElementById(`column-${columnKey}`);
    document.getElementById("container").removeChild(columnEl);
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
