
let clone = (orig) => {
  return Object.assign( Object.create( Object.getPrototypeOf(orig)), orig)
}

class Led {

  constructor(r, g, b) {
    this.r = r
    this.g = g
    this.b = b
  }

  toArduinoString(idx) {
    return idx + ";" + this.r + ";" + this.g + ";" + this.b + ";"
  }

}

class Leds {

  constructor() {
    this.leds = []
  }

  static fill(numberOfLeds, led) {
    let leds = new Leds()

    for (let i = 0; i < numberOfLeds; i++) {
      leds.set(i, led)
    }

    return leds
  }

  set(idx, led) {
    this.leds[idx] = clone(led)
  }

  toArduinoStrings() {
    const batch = 17
    let batches = []

    this.leds.forEach((led, idx) => {
      let batchIdx = Math.floor(idx / batch)

      if (!batches[batchIdx]) {
        batches[batchIdx] = "l"
      }

      batches[batchIdx] += led.toArduinoString(idx)
    })

    return batches
  }

}

export {
  Led,
  Leds
}
