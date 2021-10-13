'use strict'
/* eslint-disable space-before-function-paren, comma-dangle */

/**
 * Copyright © 2018-2021 Nexss.com / Marcin Polak mapoart@gmail.com. All rights reserved.
 * This source code is governed by MIT license, please check LICENSE file.
 */

/**
 * Project in json and yaml
 * @constructor
 */

function nexssFile({} = {}) {
  const _log = require('@nexssp/logdebug')
  const _fs = require('fs')
  const { NEXSS_PROJECT_SRC_PATH, NEXSS_PROJECT_CONFIG_PATH } = require('./config/project')
  const { bold, yellow } = require('@nexssp/ansi')
  const { extname, join, resolve, dirname, isAbsolute, normalize } = require('path')
  const { config1 } = require('./config/config')
  const { language1 } = require('./config/language')
  const cliArgs = require('minimist')(process.argv.slice(2))

  language1.start()
  const start = () => {
    return true
  }
  const { push } = require('@nexssp/extend/object')
  const add = (name, { template } = {}) => {
    // TODO: move the options/cli to the funcs params

    _log.dc(`NEXSS_PROJECT_SRC_PATH:`, NEXSS_PROJECT_SRC_PATH)
    const fs = require('fs')

    const { searchData } = require('./lib/search')

    const options = {}
    options.template = template // from old code
    options.fileName = name

    if (!/^[^\\\/\:\*\?\"\<\>\|\.]+(\.[^\\\/\:\*\?\"\<\>\|\.]+)+$/.test(name)) {
      _log.error(`Add valid filename like: mycorrectfilename.[extension]. Examples:
  nexss file add myfile.js
  nexss f a myfile.rs`)
      process.exit(0)
    }

    options.filePath = options.fileName

    if (
      NEXSS_PROJECT_SRC_PATH &&
      !options.fileName.includes('src/') &&
      !options.fileName.includes('src\\')
    ) {
      if (!_fs.existsSync(options.fileName)) {
        options.filePath = join(NEXSS_PROJECT_SRC_PATH, options.fileName)
      }
    }

    _log.dc(`options.filePath:`, options.filePath)

    if (_fs.existsSync(options.filePath) && !cliArgs.force && !cliArgs.f) {
      _log.error(`File already exists: ${options.fileName}`)
      process.exitCode = 1
      return
    }

    options.extension = extname(name)

    const lang = language1.byExtension(options.extension)

    const questions = []

    if (
      options.template ||
      cliArgs.helloWorld ||
      cliArgs.HelloWorld ||
      cliArgs.default ||
      cliArgs.empty
    ) {
      if (cliArgs.helloWorld) {
        options.template = 'helloWorld'
      } else if (cliArgs.HelloWorld) {
        options.template = 'HelloWorld'
      } else if (cliArgs.default) {
        options.template = 'default'
      } else if (cliArgs.empty) {
        options.template = '!empty'
      } else if (cliArgs.e) {
        options.template = '!empty'
      }

      if (extname(options.template)) {
        if (!isAbsolute(options.template)) {
          _log.error(`Please enter template name without extension or pass the absolute path. Example:
  nexss file add myprogram.js --template=default
  nexss file add myprogram.js --template=helloWorld
  `)
          process.exit(0)
        } else if (existsSync(options.template)) {
          _log.error(`The template${options.template} does not exist.`)
          process.exit(0)
        }
      }
      execute(options)
    } else {
      const inquirer = require('inquirer')
      inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

      // const { templateNames } = require("../../nexss-language/lib/templateDELETED");
      const selectedLanguage = language1.byExtension(options.extension)
      const templateNames = () =>
        selectedLanguage.getTemplatesList().map((e) => `${options.extension} ${e}`)

      questions.push({
        type: 'autocomplete',
        name: 'template',
        source: searchData(templateNames, 'extension', options.extension),
        message: 'Select template',
        validate(val) {
          return val ? true : 'Select file template'
        },
      })

      inquirer.prompt(questions).then((answers) => {
        Object.assign(options, answers)
        if (answers.template) {
          answers.template = answers.template.split(' ')[1]
          options.template = answers.template
        }

        execute(options)
        // process.exit(0)
      })
    }
  }

  function execute(options) {
    const { filePath } = options

    _log.dy(`Execute with options:`, options)

    if ((typeof options.template === 'boolean' && options.template) || !options.template) {
      options.template = `default${options.extension}`
    }

    if (options.template) {
      if (!isAbsolute(options.template) && !extname(options.template)) {
        options.template = `${options.template}${options.extension}`
      }

      const selectedLanguage = language1.byExtension(options.extension)
      const templatesPath = `${selectedLanguage.getTemplatesPath()}/${options.template}`

      options.templatePath = templatesPath

      if (!_fs.existsSync(options.templatePath)) {
        _log.error(`Template ${bold(options.template)} does not exist.`)
        _log.error(`File ${bold(normalize(options.fileName))} has not been created.`)
        process.exit(0)
      } else {
        _log.info(`Using ${bold(options.template)} template. Creating from template...`)

        const directory = dirname(filePath)
        if (!_fs.existsSync(directory)) {
          _log.info(`src/ folder not found. creating in the main folder. ${NEXSS_PROJECT_SRC_PATH}`)
          _fs.mkdirSync(directory, { recursive: true })
        }

        try {
          _fs.copyFileSync(options.templatePath, filePath)

          _log.ok(`File ${yellow(bold(normalize(filePath)))} has been created.`)
        } catch (err) {
          if (err.code === 'ENOENT') {
            _log.error(`Error during copy from ${normalize(options.templatePath)} to ${filePath}`)
            return
          }
          if (err.code === 'EACCES') {
            _log.error(
              `Error during copy from ${normalize(
                options.templatePath
              )} to ${filePath}. Permission denied. You may need to run this as root? or change permissions?`
            )
            return
          }
          throw err
        }

        // cliArgs.noconfig - no config modification
        if (!cliArgs.noconfig && NEXSS_PROJECT_CONFIG_PATH) {
          const configContent = config1.load(NEXSS_PROJECT_CONFIG_PATH)

          if (!options.fileName.includes('src/') && !options.fileName.includes('src\\')) {
            options.fileName = `src/${options.fileName}`
          }
          const { findByProp } = require('@nexssp/extend/object')
          if (!cliArgs.f && findByProp(configContent, 'files', 'name', options.fileName)) {
            _log.info(yellow(`File '${normalize(options.fileName)}' is already in the _nexss.yml`))
            return
          }
          push(configContent, 'files', {
            name: options.fileName,
          })
          config1.save(configContent, NEXSS_PROJECT_CONFIG_PATH)
          _log.success('Done.')
        }
      }
      const { extraFunctions } = require('./lib/fileExtraOptions')
      extraFunctions(options.templatePath)
      if (cliArgs.edit) {
        const { edit } = require('./nexss-edit/lib/edit')
        edit(options.fileName)
      }
    }
  }

  return {
    start,
    add,
  }
}

module.exports = nexssFile
