/* global test */
/* global expect */

import {
    transformHexToRgb,
    addColor,
    combineLEDs
} from '../web/lib/helpers/dataHelpers'

test('#transformHexToRgb', () => {
    expect(transformHexToRgb(5636095)).toEqual({
        r: 85,
        g: 255,
        b: 255
    })
})

test('#addColor', () => {
    const first = 256 * 256 * 13 + 256 * 24 + 253
    const second = 256 * 256 * 100 + 256 * 200 + 20
    expect(addColor(first, second)).toEqual(256 * 256 * 113 + 256 * 224 + 255)
})

test('#combineLEDs', () => {
    const first = [256 * 256 * 13 + 256 * 24 + 253, 256 * 256 * 13 + 256 * 24 + 253]
    const second = [256 * 256 * 100 + 256 * 200 + 20, 256 * 256 * 100 + 256 * 200 + 20]
    expect(combineLEDs(first, second)).toEqual([256 * 256 * 113 + 256 * 224 + 255, 256 * 256 * 113 + 256 * 224 + 255])
})