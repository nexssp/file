module.exports = {
  defaultTestFunction: 'nSpawn',
  nexsstests: [
    {
      title: 'Adds file',
      params: ['nexssp-file add myfile.js --template=default', /^add\|a/],
    },
    {
      title: 'display menu',
      params: ['nexssp-file', /^add\|a/],
    },
  ],
}
