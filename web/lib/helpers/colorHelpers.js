import chroma from "chroma-js"

const transformHexToRgb = (hex) => {
  const b = hex % 256
  const g = (hex - b) / 256 % 256
  const r = ((hex - b) / 256 - g) / 256
  return {
    r, g, b
  }
}

const transformRgbToHex = ({r, g, b}) => {
  return 0x1000000 + b + 0x100 * g + 0x10000 * r
}

const colorStep = (colorFrom, colorTo, ratio) => {
  let result = chroma.mix(chroma([colorFrom.r, colorFrom.g, colorFrom.b]).name() ,chroma([colorTo.r, colorTo.g, colorTo.b]).name(), ratio).rgb();
  return {r: result[0], g: result[1], b: result[2]}
}

export {
  transformHexToRgb,
  transformRgbToHex,
  colorStep
}