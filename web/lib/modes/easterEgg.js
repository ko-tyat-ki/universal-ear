import { simpleRainbow } from "../helpers/rainbowColors";
import { NUMBER_OF_LEDS } from "../configuration/constants";
import { easterEggConfig } from '../../../modes_config.json'

let start = Date.now()
const speed = easterEggConfig.speed // 150
const duration = easterEggConfig.duration// 10 seconds, 30 Seconds of fun! - needs to be 2 times melody
const tensionThreshold = easterEggConfig.tensionThreshold // 10
const activationStickCount = easterEggConfig.activationStickCount // 3

export const isEasterTriggered = (sensors) => {
  return sensors.filter(sensor => sensor.tension && sensor.tension > tensionThreshold).filter(Boolean).length >= activationStickCount
}

export const easterEggDuration = duration


// const isActive = () => {
//   return modeIsActive
// }

// const activate = () => {
//   modeIsActive = true
//   start = Date.now()
// }

// const deactivate = () => {
//   console.log("deactivated")
//   modeIsActive = false
// }

// const canActivate = (sticks, sensors) => {
//   if (!modeIsActive && isTriggered(sensors, sticks)) {
//     activate()
//     return true
//   }
// }

// в это время играет музыка бенни хилла
export const easterEgg = (sticks, sensors) => {
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

// export default {
//   mode: easterEgg,
//   canActivate,
//   isActive
// }
