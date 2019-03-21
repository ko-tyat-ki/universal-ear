export const basic = ({ arduinos, columns }) => {
  const brightColor = "#88b";
  columns.map((columnName, key) => {
    let column = columns[key];
    let arduino = arduinos[key];

    const tension = arduino.read();
    const numberOfLEDs = column.numberOfLEDs;

    const leds = [];

    for (let key = 0; key < Math.min(tension, numberOfLEDs / 2); key++) {
      leds.push({
        number: numberOfLEDs / 2 - key,
        color: brightColor
      });
      leds.push({
        number: numberOfLEDs / 2 + key,
        color: brightColor
      });
    }

    column.colorLeds(leds);
  });
};
