import os from 'os'
import fs from 'fs'

const DefaultPath = os.homedir() + '/ear_config.json'

function read(path) {
  path = path || DefaultPath;

  let res  = {}
  try {
    let configData = fs.readFileSync(path, 'utf-8')
    res = JSON.parse(configData)
  } catch (err) {
    console.log(err)
  }

  return res
}


function save(config, path) {
  path = path || DefaultPath;

  fs.writeFileSync(path, JSON.stringify(config), {'flag': 'w+'}, (err) => {
    console.log("Saving config failed:", err, )
  })
}

export default {
  DefaultPath,
  read,
  save
}
