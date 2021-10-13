module.exports = {
  atom: {
    install: "scoop install atom",
    listExtensions: "",
    installExtension: "",
    uninstallExtension: "",
    command: "atom",
    args: "<file>",
    title: "Atom",
    website: "https://atom.io/",
    license: "MIT (https://spdx.org/licenses/MIT.html)",
  },
  notepadplusplus: {
    install: "scoop install notepadplusplus",
    listExtensions: "",
    installExtension: "",
    uninstallExtension: "",
    command: "notepad++.exe",
    args: "<file>",
    title: "Notepad++",
    website: "https://notepad-plus-plus.org",
    license: "GPL-2.0-only (https://spdx.org/licenses/GPL-2.0-only.html)",
  },
  vscode: {
    install: "scoop install vscode",
    listExtensions: "vscode list-extensions",
    installExtension: "vscode --install-extension",
    uninstallExtension: "--uninstall-extension <extension>",
    command: "code",
    args: "<file>",
    title: "Visual Studio Code",
    website: "https://code.visualstudio.com/",
    license: "Freeware (https://code.visualstudio.com/License/)",
  },
};