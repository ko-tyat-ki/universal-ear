/* global test */
/* global expect */
/* global ArrayBuffer */
/* global Uint8Array */

import {
    addColor,
    combineLEDs,
    regroupConfig,
    putLedsInBufferArray,
    eliminateLEDsConfigRepetition
} from '../web/lib/helpers/dataHelpers'

test('#addColor', () => {
    const first = {
        r: 13,
        g: 24,
        b: 253
    }
    const second = {
        r: 100,
        g: 200,
        b: 20
    }
    expect(addColor(first, second)).toEqual({
        r: 113,
        g: 224,
        b: 255
    })
})

test('#combineLEDs', () => {
    const first = [{
        number: 10,
        color: {
            r: 13,
            g: 24,
            b: 253
        }
    }, {
        number: 11,
        color: {
            r: 13,
            g: 24,
            b: 253
        }
    }]
    const second = [{
        number: 10,
        color: {
            r: 100,
            g: 200,
            b: 20
        }
    }, {
        number: 12,
        color: {
            r: 100,
            g: 200,
            b: 20
        }
    }]
    expect(combineLEDs(first, second)).toEqual([{
        number: 10,
        color: {
            r: 113,
            g: 224,
            b: 255
        }
    }, {
        number: 11,
        color: {
            r: 13,
            g: 24,
            b: 253
        }
    }, {
        number: 12,
        color: {
            r: 100,
            g: 200,
            b: 20
        }
    }])
})

test('eliminateLEDsConfigRepetition', () => {
    const ledsConfig = [{ number: 10, color: { r: 13, g: 24, b: 17 } }, { number: 10, color: { r: 9, g: 100, b: 253 } }, { number: 9, color: { r: 0, g: 0, b: 255 } }]
    expect(eliminateLEDsConfigRepetition(ledsConfig)).toEqual([{ number: 10, color: { r: 13, g: 100, b: 253 } }, { number: 9, color: { r: 0, g: 0, b: 255 } }])
})

test('#regroupConfig', () => {
    const ledsConfig = [[
        { key: '1', leds: [{ number: 10, color: { r: 0, g: 0, b: 1 } }, { number: 9, color: { r: 0, g: 0, b: 2 } }, { number: 8, color: { r: 0, g: 0, b: 3 } }] },
        { key: '2', leds: [{ number: 10, color: { r: 0, g: 0, b: 4 } }, { number: 11, color: { r: 0, g: 0, b: 5 } }, { number: 8, color: { r: 0, g: 0, b: 6 } }] },
        { key: '3', leds: [{ number: 10, color: { r: 0, g: 0, b: 4 } }, { number: 11, color: { r: 0, g: 0, b: 5 } }, { number: 8, color: { r: 0, g: 0, b: 6 } }] }
    ], [
        { key: '1', leds: [{ number: 10, color: { r: 0, g: 0, b: 7 } }, { number: 7, color: { r: 0, g: 0, b: 8 } }, { number: 8, color: { r: 0, g: 0, b: 9 } }] },
        { key: '2', leds: [{ number: 10, color: { r: 0, g: 0, b: 10 } }, { number: 12, color: { r: 0, g: 0, b: 11 } }, { number: 14, color: { r: 0, g: 0, b: 12 } }] },
        { key: '2', leds: [{ number: 10, color: { r: 0, g: 0, b: 10 } }, { number: 12, color: { r: 0, g: 0, b: 11 } }, { number: 14, color: { r: 0, g: 0, b: 12 } }] }
    ]]

    const expected = [
        { key: '1', leds: [{ number: 10, color: { r: 0, g: 0, b: 8 } }, { number: 9, color: { r: 0, g: 0, b: 2 } }, { number: 8, color: { r: 0, g: 0, b: 12 } }, { number: 7, color: { r: 0, g: 0, b: 8 } }] },
        { key: '2', leds: [{ number: 10, color: { r: 0, g: 0, b: 24 } }, { number: 11, color: { r: 0, g: 0, b: 5 } }, { number: 8, color: { r: 0, g: 0, b: 6 } }, { number: 12, color: { r: 0, g: 0, b: 22 } }, { number: 14, color: { r: 0, g: 0, b: 24 } }] },
        { key: '3', leds: [{ number: 10, color: { r: 0, g: 0, b: 4 } }, { number: 11, color: { r: 0, g: 0, b: 5 } }, { number: 8, color: { r: 0, g: 0, b: 6 } }] }
    ]

    expect(regroupConfig(ledsConfig)).toEqual(expected)
})

test('#putLedsInBufferArray', () => {
    const leds = [{ number: 0, color: { r: 0, g: 0, b: 7 } }, { number: 1, color: { r: 0, g: 0, b: 8 } }, { number: 2, color: { r: 0, g: 0, b: 9 } }]
    const buffer = new ArrayBuffer(3 * leds.length + 3)
    const expected = new Uint8Array(buffer)
    expected.set([0x10, 0x11, 0, 0, 7, 0, 0, 8, 0, 0, 9, 0x12], 0)
    expect(putLedsInBufferArray(leds, 3)).toEqual(expected)
})