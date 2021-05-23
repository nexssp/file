const assert = require('assert')
const { createNewTestFolder } = require('@nexssp/test')
const tf = createNewTestFolder()

console.log('Changing folder: ', tf)
process.chdir(tf)

require('child_process').execSync('nexssp-file add myfile.js --template=default', {
  stdio: 'inherit',
})

require('child_process').execSync('nexssp-file add myfile.js --template=default -f', {
  stdio: 'inherit',
})
require('child_process').execSync('dir', { stdio: 'inherit' })
