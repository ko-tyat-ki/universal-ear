import tinycolor from "tinycolor2";

const randomwhite = (sticks, sensors) => {
  return sticks.map(stick => {
    if (!stick) return
    const leds = []
    for (let i = 0; i < stick.numberOfLEDs; i++) {
      if(Math.random() < 0.5) {
        leds.push({
          number: i,
          color: tinycolor("white").toRgb()
        })
      }
    }

    return [{
      key: stick.name,
      leds
    }]
  })
}

export default randomwhite