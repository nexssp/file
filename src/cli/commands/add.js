module.exports = (_, args) => {
  const options = {}
  const { file1 } = require('../../config/file')
  const cliArgs = require('minimist')(process.argv.slice(2))
  const template = cliArgs.t || cliArgs.template

  file1.add(args[0], { template })
}
