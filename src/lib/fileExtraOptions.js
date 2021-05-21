module.exports.extraFunctions = (templatePath) => {
  const { which } = require('@nexssp/ensure')
  const { green, bold, yellow } = require('@nexssp/ansi')
  const _log = require('@nexssp/logdebug')
  const _fs = require('fs')
  // Extra operation for the template like installations, files copy, info
  if (_fs.existsSync(`${templatePath}.js`)) {
    console.log('Additional files and commands for this file. Please wait..')
    const extraOptions = require(`${templatePath}.js`)
    const files = extraOptions.files || []
    const path = require('path')
    files.forEach((element) => {
      const elementPath = path.join(path.dirname(templatePath), element)
      const destinationPath = process.env.NEXSS_PROJECT_SRC_PATH
        ? path.join(process.env.NEXSS_PROJECT_SRC_PATH, path.dirname(element))
        : path.dirname(element)

      // If we are in the project folder make a copy to the src/ of that project
      _log.info(
        yellow(
          bold(
            `Copying 3rdParty libraries... 
${elementPath} TO 
${destinationPath}`
          )
        )
      )
      const fse = require('fs-extra')
      fse.ensureDirSync(destinationPath)
      fse.copySync(elementPath, path.join(destinationPath, path.basename(element)))
      log.success('copied.')
    })

    const { commands } = extraOptions

    if (commands && commands.forEach) {
      // const distName = dist();

      // TODO: Later to cleanup this config file !!
      // switch (distName) {
      //   default:
      //     languageConfig.compilers.ruby.install = replaceCommandByDist(
      //       languageConfig.compilers.ruby.install
      //     );
      //     break;
      // }

      // FIXME: to check this part!!
      const defaultOptions = { stdio: 'inherit' }
      if (process.platform === 'win32') {
        defaultOptions.shell = true
      } else {
        defaultOptions.shell = process.shell
      }

      _log.info(green(bold(`Please wait.. Installing..`)))

      commands.forEach((cmd2) => {
        // TODO: better error handling
        // console.log(cmd);
        cmd = process.replacePMByDistro(cmd2)

        if (cmd) {
          if (!process.argv.includes('--progress') && !process.env.NEXSS_ARG_PROGRESS) {
            _log.info(
              'To see all installation messages use --progress or set the env variable: NEXSS_ARG_PROGRESS'
            )
            defaultOptions.stdio = 'pipe'
          }

          try {
            require('child_process').execSync(`${cmd}`, defaultOptions)
          } catch (err) {
            _log.error('==========================================================')
            _log.error(bold(`There was an issue with the command: ${red(cmd)}, details:`))

            const commandRun = cmd.split(' ').shift()
            if (!which(commandRun)) {
              _log.error(red(`${commandRun} seems to be not installed.`))
              _log.error(red(`Error during execute extra operations: ${templatePath}.js`))
            } else {
              _log.ok(bold(`${commandRun} seems to be installed however there may be more errors:`))
              _log.error(err.stdout ? err.stdout.toString() : '')
              _log.error(err.stderr ? err.stderr.toString() : '')
              _log.error('==========================================================')
            }

            process.exit()
          }
        }
      })

      _log.info(green(bold(`Completed.`)))
    }

    const descriptions = extraOptions.descriptions || []
    if (descriptions.length > 0) {
      // warn("Some information about installed packages.");
      descriptions.forEach((desc) => {
        if (desc) {
          _log.info(bold('Info from additional third party libraries package:'))
          _log.info(desc)
        }
      })
    }
  }
}
