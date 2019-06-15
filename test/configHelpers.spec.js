import fs from 'fs'
import config from '../web/lib/helpers/config'

test('Saving test file and check if it was created', () => {
  let data = {"test": "config"};
  config.save(data)

  expect(fs.existsSync(config.DefaultPath)).toBe(true)

  expect(config.read()).toEqual(data)
})


test('Reading unexistent config', () => {
  expect(config.read("/not_exist/config.json")).toEqual({})
})
