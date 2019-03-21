export const basic = ({ arduinos, columns }) => {
  const brightColor = "#88b";
  columns.map((columnData, key) => {
    let column = columnData;
    let arduino = arduinos[key];

    const tension = arduino.read();
    const numberOfLEDs = column.numberOfLEDs;

    const leds = [];

    for (let key = 0; key <= Math.min(tension, arduino.sensorPosition); key++) {
      leds.push({
        number: Math.max(arduino.sensorPosition - key, 0),
        color: brightColor
      });
      leds.push({
        number: Math.min(arduino.sensorPosition + key, numberOfLEDs - 1),
        color: brightColor
      });
    }

    if (leds.number === 0) {
      console.log({ leds, numberOfLEDs });
    }

    column.colorLeds(leds);
  });
};
