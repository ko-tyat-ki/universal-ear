import {
    transformHexToRgb,
} from '../web/lib/helpers/colorHelpers'

test('#transformHexToRgb', () => {
    expect(transformHexToRgb(5636095)).toEqual({
        r: 85,
        g: 255,
        b: 255
    })
})