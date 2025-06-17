const vscode = require('vscode');
const path = require(`path`);

const {
  registerCommand,
  commandQuickPick,
} = require(`./lib/libVSCode.js`);

const driveLetterUpper = path => {
  if (path[1] === `:`) {
    return path[0].toUpperCase() + path.slice(1);
  }
  return path;
};

const tabFilePath = (tab) => {
  const path = tab.input?.uri?.fsPath ?? '';
  return driveLetterUpper(path);
}

const tabRelativePath = (tab) => {
  const filePath = tabFilePath(tab);

  const editor = vscode.window.activeTextEditor;
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
  const filePathRelative =
    workspaceFolder
      ? path.relative(
        workspaceFolder.uri.fsPath,
        filePath
      )
      : filePath;

  return filePathRelative;
}

const tabProjectRelativePathSlash = (tab) => {
  const filePath = tabFilePath(tab);

  const editor = vscode.window.activeTextEditor;
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
  const filePathRelativeProject =
    workspaceFolder
      ? path.relative(
        path.dirname(workspaceFolder.uri.fsPath),
        filePath
      )
      : filePath;

  return filePathRelativeProject.replaceAll(`\\`, `/`);
}

const tabFileName = (tab) => {
  const filePath = tabFilePath(tab);
  const fileName = path.basename(filePath);
  return fileName ?? '';
}

const tabFileNameWithoutExt = (tab) => {
  const filePath = tabFilePath(tab);
  const fileName = path.basename(filePath, path.extname(filePath));
  return fileName ?? '';
}

// const getTabsToLeft =(tabs, activeIndex) => {
//   return tabs.slice(0, activeIndex + 1);
// }

const getTabsToRight =(tabs, activeIndex) => {
  return tabs.slice(activeIndex);
}

const copyTextAndShowMessage = (pathsGroups, text) => {
  const result = pathsGroups.map(paths => paths.join('\n')).join('\n\n');
  const pathCount = pathsGroups.flat().length;

  if (result !== '') {
    vscode.env.clipboard.writeText(result);
    vscode.window.showInformationMessage(`Copied: ${text}${pathCount > 1 ? 's' : ''}: ${pathCount}`);
  } else {
    vscode.window.showWarningMessage(`No ${text} to copy.`);
  }
}

const copyFileName = (tabsGroups) => {
  const pathsGroups = [];
  for (const tabs of tabsGroups) {
    const paths = [];
    for (const tab of tabs) {
      const path = tabFileName(tab);
      if (path !== '') {
        paths.push(path);
      }
    }
    pathsGroups.push(paths);
  }
  copyTextAndShowMessage(pathsGroups, 'file name');
}

const copyFileNameWithoutExt = (tabsGroups) => {
  const pathsGroups = [];
  for (const tabs of tabsGroups) {
    const paths = [];
    for (const tab of tabs) {
      const path = tabFileNameWithoutExt(tab);
      if (path !== '') {
        paths.push(path);
      }
    }
    pathsGroups.push(paths);
  }
  copyTextAndShowMessage(pathsGroups, 'file name');
}

const copyRelativePath = (tabsGroups) => {
  const pathsGroups = [];
  for (const tabs of tabsGroups) {
    const paths = [];
    for (const tab of tabs) {
      const path = tabRelativePath(tab);
      if (path !== '') {
        paths.push(path);
      }
    }
    pathsGroups.push(paths);
  }
  copyTextAndShowMessage(pathsGroups, 'relative path');
}

const copyProjectRelativePath = (tabsGroups) => {
  const pathsGroups = [];
  for (const tabs of tabsGroups) {
    const paths = [];
    for (const tab of tabs) {
      const path = tabProjectRelativePathSlash(tab);
      if (path !== '') {
        paths.push(path);
      }
    }
    pathsGroups.push(paths);
  }
  copyTextAndShowMessage(pathsGroups, 'project relative path');
}

const copyFullPath = (tabsGroups) => {
  const pathsGroups = [];
  for (const tabs of tabsGroups) {
    const paths = [];
    for (const tab of tabs) {
      const path = tabFilePath(tab);
      if (path !== '') {
        paths.push(path);
      }
    }
    pathsGroups.push(paths);
  }
  copyTextAndShowMessage(pathsGroups, 'file path');
}

function activate(context) {
  registerCommand(context, 'vscode-copy-tabs-filepath.copyTabsFilePath', async () => {
    const activeGroup = vscode.window.tabGroups.activeTabGroup;
    const activeIndex = activeGroup.tabs.findIndex(tab => tab.isActive);

    const tabsToRight = getTabsToRight(activeGroup.tabs, activeIndex);
    const allTabsAllGroups = vscode.window.tabGroups.all.map(group => group.tabs);

    const createSubOptions = (tabsGroups, groupName) => {
      const options = [];
        options.push({ label: `${groupName} : Copy file name`, func: () => { copyFileName(tabsGroups) } });
        options.push({ label: `${groupName} : Copy file name without extension`, func: () => { copyFileNameWithoutExt(tabsGroups) } });
        options.push({ label: `${groupName} : Copy relative path`, func: () => { copyRelativePath(tabsGroups) } });
        options.push({ label: `${groupName} : Copy relative path slash with project root`, func: () => { copyProjectRelativePath(tabsGroups) } });
        options.push({ label: `${groupName} : Copy file full path`, func: () => { copyFullPath(tabsGroups) } });

      return options;
    }

    const options = [
      { label: 'Active Tab', kind: vscode.QuickPickItemKind.Separator },
      ...createSubOptions([[activeGroup.activeTab]], 'Active Tab'),
      { label: 'Tabs to Right of Active Tab', kind: vscode.QuickPickItemKind.Separator },
      ...createSubOptions([tabsToRight], 'Tabs to Right'),
      { label: 'All Tabs in All Groups', kind: vscode.QuickPickItemKind.Separator },
      ...createSubOptions(allTabsAllGroups, 'All Tabs'),
    ];

    commandQuickPick(options, 'Select what to copy');
  });
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};
