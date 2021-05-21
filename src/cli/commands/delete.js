module.exports = (_, args) => {
  const _log = require('@nexssp/logdebug')

  const NEXSS_PROJECT_CONFIG_PATH = process.env.NEXSS_PROJECT_CONFIG_PATH
  const { config1 } = require('../../config/config')

  const { searchData } = require('../../lib/search')
  const { deleteFile } = require('../../lib/file')

  // if (cliArgs._.length === 0) {
  //   _log.error("Please specify file to delete from project");
  //   const files = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH).files;
  //   if (files && files.length > 0) {
  //     files.forEach(element => {
  //       console.log(`${element.name}`);
  //     });
  //   } else {
  //     warn("There is no files to delete");
  //   }
  //   return;
  // }
  const cliArgs = require('minimist')(process.argv.slice(2))
  const options = {}
  options.fileName = cliArgs._[1]

  const nexssConfig = config1.load(NEXSS_PROJECT_CONFIG_PATH)
  if (!nexssConfig) {
    _log.warn(
      `You are not in the Nexss Programmer Project. To remove file plase use 'rm ${options.fileName}'`
    )
    process.exit()
  }

  require('@nexssp/extend')('object')
  if (options.fileName && nexssConfig.findByProp('files', 'name', options.fileName)) {
    _log.info(`File '${options.fileName}' is in the _nexss.yml.`)

    deleteFile(options.fileName)
    // process.exit(0);
  } else {
    const projectFiles = () => nexssConfig.files.map((f) => f.name)
    // console.log(projectFiles())
    const questions = []
    questions.push({
      type: 'autocomplete',
      name: 'fileToDelete',
      source: searchData(projectFiles),
      message: 'Select file to delete',
    })

    const inquirer = require('inquirer')
    inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

    inquirer.prompt(questions).then((answers) => {
      // console.log(answers);
      // const nexssConfig = require("./lib/nexss-config");
      if (!answers.fileToDelete) {
        _log.warn('No file has been selected to delete.')
        return
      }
      deleteFile(answers.fileToDelete)
    })
    if (options.fileName) _log.warn(`File '${options.fileName}' is NOT in the _nexss.yml file`)
    process.exit(0)
  }
}
