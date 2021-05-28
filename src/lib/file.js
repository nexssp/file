const fs = require('fs')
const { NEXSS_PROJECT_CONFIG_PATH } = require('../config/project')
const { deleteByProp, push } = require('@nexssp/extend/object')
const { addTimestamp } = require('@nexssp/extend/string')

const { config1 } = require('../config/config')
function deleteFile(filename) {
  const questions = []

  const inquirer = require('inquirer')
  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

  questions.push({
    type: 'confirm',
    name: 'delete',
    message: `Do you really want to delete file ${filename}? Backup will be automatically done by adding timestamp at the end of file..`,
  })

  inquirer.prompt(questions).then((answers) => {
    if (answers.delete) {
      const configContent = config1.load(NEXSS_PROJECT_CONFIG_PATH)
      deleteByProp(configContent, 'files', 'name', filename)

      config1.save(configContent, NEXSS_PROJECT_CONFIG_PATH)
      const fileStammped = addTimestamp(filename)
      if (fs.existsSync(filename)) {
        fs.renameSync(filename, fileStammped)
      }

      console.log(
        `File definition has been removed from _nexss.yml and file has been renamed to ${fileStammped}.`
      )
    }
  })
}

module.exports = { deleteFile }
