const start = Date.now();

const sinus = (sticks, sensors) => {
  return sensors.map(sensor => {
    const tension = sensor.tension;

    return sticks.map(stick => {
      const seconds = Math.floor((Date.now() - start) / 200);
      const ledsNumber = stick.numberOfLEDs;
      const litCenter =
        Math.floor(stick.numberOfLEDs / 2) +
        Math.floor(Math.sin((stick.name + seconds) % sticks.length) * 10);

      const tensionContribution =
        tension && stick.name === sensor.column ? Math.floor(tension) : 0;
      const leds = [
        {
          number: normalise(litCenter, ledsNumber),
          color: { r: 200, g: 200, b: 200 }
        },
        {
          number: normalise(litCenter - tensionContribution, ledsNumber),
          color: { r: 200, g: 200, b: 200 }
        },
        {
          number: normalise(litCenter + tensionContribution, ledsNumber),
          color: { r: 200, g: 200, b: 200 }
        }
      ];
      return {
        key: stick.name,
        leds
      };
    });
  });
};

const normalise = (ledNumber, ledsNumber) => {
  return Math.min(Math.max(ledNumber, 0), ledsNumber - 1);
};

export default sinus;
