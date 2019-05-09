import visualisations from "./lib/visualisations"


class Config {
  constructor() {
    this.mode = "basic"
  }

  getVisualizationHandler() {
    return visualisations[this.mode]
  }

}

let _instance = new Config()

let getConfig = () => {
  if (_instance == null) {
    _instance = new Config()
  }
  return _instance
}

export default getConfig
