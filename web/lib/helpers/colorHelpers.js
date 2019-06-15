const transformHexToRgb = (hex) => {
    const b = hex % 256
    const g = (hex - b) / 256 % 256
    const r = ((hex - b) / 256 - g) / 256
    return {
        r, g, b
    }
}

const transformRgbToHex = ({ r, g, b }) => {
    return 0x1000000 + b + 0x100 * g + 0x10000 * r
}

export {
    transformHexToRgb,
    transformRgbToHex
}