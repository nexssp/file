const { cacheLanguages } = require('./cache')
const language = require('@nexssp/languages')
const language1 = language({ cache: cacheLanguages })

module.exports = { language1 }
