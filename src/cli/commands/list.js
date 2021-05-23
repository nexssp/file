module.exports = (_, args) => {
  const NEXSS_PROJECT_CONFIG_PATH = process.env.NEXSS_PROJECT_CONFIG_PATH

  const { config1 } = require('../../config/config')

  const nexssConfig = config1.load(NEXSS_PROJECT_CONFIG_PATH)
  if (nexssConfig) {
    if (nexssConfig.files && Array.isArray(nexssConfig.files)) {
      nexssConfig.files.map((e) => console.log(e.name))
    } else {
      console.log('No files has been found in this project.')
    }
  } else {
    console.log('This is not the nexss programmer project.')
  }
}
