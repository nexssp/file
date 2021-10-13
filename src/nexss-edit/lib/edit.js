module.exports.edit = (filename) => {
  const { error } = require('@nexssp/logdebug')
  const { bold } = require('@nexssp/ansi')
  const extension = require('path').extname(filename)
  const { language1 } = require('../../config/language')
  const languageSelected = language1.byFilename(`example.${extension}`, true)

  const editorId =
    (languageSelected.editors && Object.keys(languageSelected.editors)[0]) || 'vscode'
  const editors = require('../editors')
  if (!editors[editorId]) {
    // use vscode as default
    editorId = 'vscode'
  }

  const editorSelected = editors[editorId]
  const { ensureInstalled } = require('@nexssp/ensure')

  ensureInstalled(editorSelected.command, editorSelected.install)

  if (!filename) {
    filename = '.'
  } else {
    if (!require('fs').existsSync(filename)) {
      error(`${bold(filename)} not found.`)
      process.exit(1)
    }
  }

  try {
    console.log(`For files: ${extension} you are using ${editorSelected.title}`)
    console.log(`Website: ${editorSelected.website}`)
    console.log(`License: ${editorSelected.license}`)

    require('child_process').execSync(`${editorSelected.command} ${filename}`, {
      stdio: 'inherit',
    })
  } catch (error) {
    console.log(error)
  }
}
