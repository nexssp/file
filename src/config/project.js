const { config1 } = require('../config/config')
const { join, dirname } = require('path')

const NEXSS_PROJECT_CONFIG_PATH = process.env.NEXSS_PROJECT_CONFIG_PATH || config1.getPath()
const NEXSS_PROJECT_SRC_PATH =
  process.env.NEXSS_PROJECT_SRC_PATH || NEXSS_PROJECT_CONFIG_PATH
    ? join(dirname(NEXSS_PROJECT_CONFIG_PATH), 'src')
    : undefined

module.exports = {
  NEXSS_PROJECT_CONFIG_PATH,
  NEXSS_PROJECT_SRC_PATH,
}
