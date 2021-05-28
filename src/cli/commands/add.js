module.exports = (_, args) => {
  const options = {}
  const { file1 } = require('../../config/file')
  file1.add(args[0], args.slice(1))
}
