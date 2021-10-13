const assert = require('assert')
const { createNewTestFolder } = require('@nexssp/test')
const tf = createNewTestFolder()

const packageFolder = process.cwd()
const binFileCommand = `node ${packageFolder}/bin/nexssp-file`

console.log('Changing folder: ', tf)
process.chdir(tf)

require('child_process').execSync(`${binFileCommand} add myfile.js --template=default`, {
  stdio: 'inherit',
})

require('child_process').execSync(`${binFileCommand} add myfile.js --template=default -f`, {
  stdio: 'inherit',
})
require('child_process').execSync('dir', { stdio: 'inherit' })
