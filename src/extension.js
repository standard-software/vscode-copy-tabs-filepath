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

const getTabFilePath = (tab) => {
  const path = tab.input?.uri?.fsPath ?? '';
  return driveLetterUpper(path);
}

const getTabRelativePath = (tab) => {
  const filePath = getTabFilePath(tab);

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

const getTabProjectRelativePathSlash = (tab) => {
  const filePath = getTabFilePath(tab);

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

const getTabFileName = (tab) => {
  const filePath = getTabFilePath(tab);
  const fileName = path.basename(filePath);
  return fileName ?? '';
}

const getTabFileNameWithoutExt = (tab) => {
  const filePath = getTabFilePath(tab);
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
    vscode.window.showWarningMessage('No filenames to copy.');
  }
}

const copyFileName = (tabsGroups) => {
  const pathsGroups = [];
  for (const tabs of tabsGroups) {
    const paths = [];
    for (const tab of tabs) {
      const path = getTabFileName(tab);
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
      const path = getTabFileNameWithoutExt(tab);
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
      const path = getTabRelativePath(tab);
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
      const path = getTabProjectRelativePathSlash(tab);
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
      const path = getTabFilePath(tab);
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

    const options = [
      { label: 'Active Tab', kind: vscode.QuickPickItemKind.Separator },
      {
        label: 'Active Tab : Copy file name',
        func: () => { copyFileName([[activeGroup.activeTab]]) },
      },
      {
        label: 'Active Tab : Copy file name without extension',
        func: () => { copyFileNameWithoutExt([[activeGroup.activeTab]]) },
      },
      {
        label: 'Active Tab : Copy relative path',
        func: () => { copyRelativePath([[activeGroup.activeTab]]) },
      },
      {
        label: 'Active Tab : Copy relative path with project root',
        func: () => { copyProjectRelativePath([[activeGroup.activeTab]]) },
      },
      {
        label: 'Active Tab : Copy file full path',
        func: () => { copyFullPath([[activeGroup.activeTab]]) },
      },

      { label: 'Tabs to Right', kind: vscode.QuickPickItemKind.Separator },
      {
        label: 'Tabs to Right : Copy file name',
        func: () => { copyFileName([tabsToRight]) },
      },
      {
        label: 'Tabs to Right : Copy file name without extension',
        func: () => { copyFileNameWithoutExt([tabsToRight]) },
      },
      {
        label: 'Tabs to Right : Copy relative path',
        func: () => { copyRelativePath([tabsToRight]) },
      },
      {
        label: 'Tabs to Right : Copy relative path with project root',
        func: () => { copyProjectRelativePath([tabsToRight]) },
      },
      {
        label: 'Tabs to Right : Copy file full path',
        func: () => { copyFullPath([tabsToRight]) },
      },

      { label: 'All Tabs in All Groups', kind: vscode.QuickPickItemKind.Separator },
      {
        label: 'All Tabs in All Groups : Copy file name',
        func: () => { copyFileName(allTabsAllGroups) },
      },
      {
        label: 'All Tabs in All Groups : Copy file name without extension',
        func: () => { copyFileNameWithoutExt(allTabsAllGroups) },
      },
      {
        label: 'All Tabs in All Groups : Copy relative path',
        func: () => { copyRelativePath(allTabsAllGroups) },
      },
      {
        label: 'All Tabs in All Groups : Copy relative path with project root',
        func: () => { copyProjectRelativePath(allTabsAllGroups) },
      },
      {
        label: 'All Tabs in All Groups : Copy file full path',
        func: () => { copyFullPath(allTabsAllGroups) },
      },
    ];

    commandQuickPick(options, 'Select what to copy');
  });
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};
