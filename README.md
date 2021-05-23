# @nexssp/file

Create/manage files from the templates from over 50 programming languages.

This package use **@nexssp/languages** to manage templates and language programming definitions..

## Note

This Nexss Programmer's plugin is the effect of the refactoring the Nexss Programmer **@nexssp/cli** which development has been started in 2018. Now this module can be also used **_as separate program_** without the Nexss Programmer.

## Install

```sh
npm i -g @nexssp/file
```

Now you can use `nexssp-file`.

## Usage

### Add Commands

Templates are downloaded based on the extension passed to the `nexss file add` command.

```sh
# Below is the same as nexss programmer's `nexss file add myfile.js` or just `nexss f a myfile.js`
nexssp-file add myfile.js

```

Just more here from Nexss Programmers docs:

```sh
nexss file list # list files for actual project (the same as nexss f l)
nexss file add # add file with selection

# Predefined templates (which appears on the list) are passed without extension:
nexss file add myfile.js --template helloWorld

# Absolute paths needs to have extension:
nexss file add myfile.js --template c:\templates\template1.js
```

![nexssProgrammer-SelectTemplateExampleCLI](https://user-images.githubusercontent.com/53263666/72731382-ebc4dc80-3b93-11ea-9d84-5ee136ab2e33.png)

## File Templates - Languages configuration

Languages configuration are in the **c:/Users/\<yourusername\>/.nexss/languages/**

Sometimes template file needs extra libraries or files or commands to run. You can do this by creating the file (as example below) and specify:

- **files**: _Array_ ["folder/file","file.ext"] - files to copy
- **commands**: _Array_ ["mv source dest","ps"] - commands to run after files are copied
- **repos**: _Array_ this is just to keep repositories (nothing is run)
- **descriptions**: _Array_ - displays messages after file is added

Example: Template is name **Default.ahk**, so below file with config for the template is called **Default.ahk.js**

```js
const config = {
  files: ['3rdPartyLibraries/JSONParser.ahk'],
  commands: ['ls -la', 'some second command'],
  repos: ['https://github.com/dbohdan/jimhttp'],
  descriptions: ['This information will be displayed after all files are copied and commands run.'],
}

module.exports = config
```

You also can use conditions like below: (example of **Elixir** language):

```js
const config = {
  files: ['mix.exs'],
  commands: ['IF exist src (cd src && mv mix.exs ../mix.exs && cd ..) else ( mix deps.get)'],
  repos: [],
  descriptions: ['!!! You may see some warnings at the very first run of your Elixir program.'],
}
```

## Writing own Templates - Default and HelloWorld

Nexss Programmer uses JSON as interchange format between languages. To use fully Nexss Programmer features like Nexss Programmer projects programming language needs to have: Default and HelloWorld. (Most of the Nexss Programmer's languages already have implemented)

- Default - Just passing data and adding extra item in JSON "test" with value of "test"
- Hello World - Adding field HelloFrom<Language here>: Version of the language

### Development and Test of the Default and Hello World templates

#### Default

```sh
# Default
nexss file add myfile.cpp --t=Default # This creates file from template Default

(This below only works on Nexss Programmer and it is not a part of the @nexssp/languages)
nexss myfile.cpp # and this should give kind of output (below C++):
{"start":1578507572953,"cwd":"C:\\xdata\\1\\1234","debug":true,"_":[],"outputCPP":"Hello from C++ 17!"}
```
