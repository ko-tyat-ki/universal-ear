let isSleeping = false
const tensionThreshold = 10
let noActionsSince = Date.now()
let getBoredAfter = 3 * 1000
let onSleepHandler
let onWakeUpHandler

const wasStretchedHardEnoughToWakeUp = (sticks, sensors) => {
  const countOfTenseSensors = sensors.map(sensor => {
    // Find a Stick that corresponds to current Sensor
    const stick = sticks.find(stick => stick.name === sensor.stick)
    if (!stick) return

    const tension = sensor.tension
    return tension > tensionThreshold ? 1 : 0
  }).reduce((a, b) => {
    return a + b
  }, 0);
  return countOfTenseSensors >= 1
}

const wakeUp = () => {
  // Track last trigger
  noActionsSince = Date.now()
  // Already awake
  if (!isSleeping) return

  isSleeping = false
  if (onWakeUpHandler) onWakeUpHandler()
}

const goSleep = () => {
  // If already sleeping
  if (isSleeping) return

  isSleeping = true
  if (onSleepHandler) onSleepHandler()
}

const gotSleepy = () => {
  return Date.now() - noActionsSince > getBoredAfter
};

const checkIfSleeping = () => {
  return isSleeping
}

const track = (sticks, sensors) => {
  if (wasStretchedHardEnoughToWakeUp(sticks, sensors)) wakeUp()
  if (gotSleepy()) goSleep()
}

const onSleep = (handler) => {
  onSleepHandler = handler
}
let onWakeUp = (handler) => {
  onWakeUpHandler = handler
}

export default {
  checkIfSleeping,
  track,
  onSleep,
  onWakeUp
}
