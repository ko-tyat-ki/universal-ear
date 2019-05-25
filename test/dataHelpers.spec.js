/* global test */
/* global expect */

import {
    addColor,
    combineLEDs,
    regroupConfig,
    transformHexToRgb,
    eliminateLEDsConfigRepetition
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
    const first = [{
        number: 10,
        color: 256 * 256 * 13 + 256 * 24 + 253
    }, {
        number: 11,
        color: 256 * 256 * 13 + 256 * 24 + 253
    }]
    const second = [{
        number: 10,
        color: 256 * 256 * 100 + 256 * 200 + 20
    }, {
        number: 12,
        color: 256 * 256 * 100 + 256 * 200 + 20
    }]
    expect(combineLEDs(first, second)).toEqual([{
        number: 10,
        color: 256 * 256 * 113 + 256 * 224 + 255
    }, {
        number: 11,
        color: 256 * 256 * 13 + 256 * 24 + 253
    }, {
        number: 12,
        color: 256 * 256 * 100 + 256 * 200 + 20
    }])
})

test('eliminateLEDsConfigRepetition', () => {
    const ledsConfig = [{ number: 10, color: 256 * 256 * 13 + 256 * 24 + 17 }, { number: 10, color: 256 * 256 * 9 + 256 * 100 + 253 }, { number: 9, color: 255 }]
    expect(eliminateLEDsConfigRepetition(ledsConfig)).toEqual([{ number: 10, color: 256 * 256 * 13 + 256 * 100 + 253 }, { number: 9, color: 255 }])
})

test('#regroupConfig', () => {
    const ledsConfig = [[
        { key: '1', leds: [{ number: 10, color: 1 }, { number: 9, color: 2 }, { number: 8, color: 3 }] },
        { key: '2', leds: [{ number: 10, color: 4 }, { number: 11, color: 5 }, { number: 8, color: 6 }] },
        { key: '3', leds: [{ number: 10, color: 4 }, { number: 11, color: 5 }, { number: 8, color: 6 }] }
    ], [
        { key: '1', leds: [{ number: 10, color: 7 }, { number: 7, color: 8 }, { number: 8, color: 9 }] },
        { key: '2', leds: [{ number: 10, color: 10 }, { number: 12, color: 11 }, { number: 14, color: 12 }] },
        { key: '2', leds: [{ number: 10, color: 10 }, { number: 12, color: 11 }, { number: 14, color: 12 }] }
    ]]

    const expected = [
        { key: '1', leds: [{ number: 10, color: 8 }, { number: 9, color: 2 }, { number: 8, color: 12 }, { number: 7, color: 8 }] },
        { key: '2', leds: [{ number: 10, color: 24 }, { number: 11, color: 5 }, { number: 8, color: 6 }, { number: 12, color: 22 }, { number: 14, color: 24 }] },
        { key: '3', leds: [{ number: 10, color: 4 }, { number: 11, color: 5 }, { number: 8, color: 6 }] }
    ]

    expect(regroupConfig(ledsConfig)).toEqual(expected)
})