const yann = (sticks, sensors) => {
  let leds
  return sensors.map(sensor => {
    return sticks.map(stick => {
      const leds = []
      for (let key = 0; key < stick.numberOfLEDs; key++) {

        leds.push({
          number: key,
          color: {
            r: 100,
            g: 100,
            b: 155
          }
        })
      }

    })

    return {
      key: stick.name,
      leds
    }
  })
}

export default yann
