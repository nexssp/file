module.exports = (_, args) => {
  const options = {}
  options.fileName = args[0] || options.fileName || ''
  const cliArgs = require('minimist')(process.argv.slice(2))
  options.template = cliArgs.template || cliArgs.t
  const { file1 } = require('../../config/file')
  file1.add(options.fileName, options)
}
