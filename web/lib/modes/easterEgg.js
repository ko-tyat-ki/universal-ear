import { simpleRainbow } from "../helpers/rainbowColors";
import { NUMBER_OF_LEDS } from "../configuration/constants";
import { easterEggConfig } from '../../../modes_config.json'

let start = Date.now()
const speed = easterEggConfig.speed // 150
const duration = easterEggConfig.speed// 10 seconds, 30 Seconds of fun! - needs to be 2 times melody
const tensionThreshold = easterEggConfig.speed // 10
const activationStickCount = easterEggConfig.speed // 3

let modeIsActive = false;

const isTriggered = (sensors, sticks) => {
  const countOfTenseSensors = sensors.map(sensor => {
    // Find a Stick that corresponds to current Sensor
    const stick = sticks.find(stick => stick.name === sensor.stick)
    if (!stick) return

    const tension = sensor.tension
    // console.log(tension, tensionThreshold)
    return tension > tensionThreshold ? 1 : 0
  }).reduce(function (a, b) {
    return a + b
  }, 0);
  return countOfTenseSensors >= activationStickCount;
}

const isActive = () => {
  return modeIsActive
}

const activate = () => {
  modeIsActive = true
  start = Date.now()
}

const deactivate = () => {
  console.log("deactivated")
  modeIsActive = false
}

const canActivate = (sticks, sensors) => {
  if (!modeIsActive && isTriggered(sensors, sticks)) {
    activate()
    return true
  }
}

// в это время играет музыка бенни хилла
const easterEgg = (sticks, sensors) => {
  if (!modeIsActive) return

  if (modeIsActive && Date.now() - start > duration) {
    deactivate()
    return
  }

  // Get tension of current sensor
  // const tension = sensor.tension

  return sticks.map((stick, key) => {
    const leds = []
    const numberOfLeds = Math.floor((Date.now() - start) / speed) % NUMBER_OF_LEDS

    {
      [...Array(numberOfLeds)].map((el, key) => leds.push({
        number: key,
        color: simpleRainbow(key)
      }))
    }
    return [
      {
        key: stick.name,
        leds
      }
    ]
  })
}

export default {
  mode: easterEgg,
  canActivate,
  isActive
}
