const yann = (sticks, sensors) => {
  const brightColour = {
    r: 200,
    g: 200,
    b: 255
  }
  const offColour = {
    r: 0,
    g: 0,
    b: 0
  }

  console.log('yann')
  return sticks.map(stick => {
    let leds = Array.from(Array(3), (x, i) => () => {} )
    const middleLEDIndex = parseInt(stick.numberOfLEDs / 2)

    for (let key = 0; key < stick.numberOfLEDs; key++) {


      const movingIndexOfColouredLed = parseInt(sinwave * stick.numberOfLEDs  - parseInt(stick.numberOfLEDs / 2))



      for(let LedIndex = 0; LedIndex < stick.numberOfLEDs; LedIndex++) {
        const sinwave = Math.sin(parseInt(stick.name))
        console.log({stick_name: stick.name, middleLEDIndex: middleLEDIndex, key: key, sinwave: sinwave, movingIndexOfColouredLed: movingIndexOfColouredLed})

        if (LedIndex > Math.abs(movingIndexOfColouredLed) || LedIndex > Math.abs(movingIndexOfColouredLed)) {
          leds[LedIndex] = { number: key, color: offColour }
        } else {
          leds[LedIndex] = { number: key, color: offColour }
        }
      }
    }
    return [
      {
        key: stick.name,
        leds
      }
    ]
  })
}

export default yann
