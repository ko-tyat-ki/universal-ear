export const rainbowColors = (rainbowLength) => {

    const steps = 6 // number of steps in the rainbow logic
    const colorChangeSpeed = 1 / rainbowLength
    // cycle length is steps / colorChangeSpeed * 1000
    // stickFactor is needed to put different sticks into different phases of Rainbow Cycle
    //const timeParameter = (Date.now() * colorChangeSpeed + stickFactor) % steps
    const timeParameter = (Date.now() * colorChangeSpeed) % steps
    let outRGB = { r: 0, g: 0, b: 0 }

    if (timeParameter < 1)
        outRGB.r = timeParameter * 246
    else if (timeParameter < 3) {
        outRGB.r = 246
        outRGB.g = (timeParameter - 1) * 240 / 2 // through 2 as this step is 2 times longer
    }
    else if (timeParameter < 3) {
        outRGB.r = 246 - (timeParameter - 2) * 166 // 166 = 246 - 80
        outRGB.g = 246
        outRGB.g = (timeParameter - 2) * 80
    }
    else if (timeParameter < 4) {
        outRGB.r = 80 - (timeParameter - 3) * 25 // 25 = 80 - 55
        outRGB.g = 246 - (timeParameter - 3) * 115 // 246 - 131
        outRGB.g = 80 + (timeParameter - 3) * 175 // 255 - 80
    }
    else if (timeParameter < 5) {
        outRGB.r = 70 - (timeParameter - 4) * 10 // 10 = 80 - 70
        outRGB.g = 115 - (timeParameter - 4) * 95 // 115 - 20
        outRGB.g = 170 - (timeParameter - 4) * 85 // 255 - 170
    }
    else { // if (timeParameter < 7) {
        outRGB.r = 70 - (timeParameter - 5) * 10 // 10 = 80 - 70
        outRGB.g = 115 - (timeParameter - 5) * 95 // 115 - 20
        outRGB.g = 170 - (timeParameter - 5) * 85 // 255 - 170
    }

    return outRGB
}