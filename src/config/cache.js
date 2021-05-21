const cache = require('@nexssp/cache')

const cacheLanguages = cache({
  bucket: 'languages',
  recreateCache: process.argv.includes('--nocache'),
  auto: true, // It will create directory if does not exist.
})

module.exports = { cacheLanguages }
