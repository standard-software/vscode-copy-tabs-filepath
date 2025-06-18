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

const projectRootName = () => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    const workspaceFolder = workspaceFolders[0];
    return path.basename(workspaceFolder.uri.fsPath);
  }
  return '';
}

const projectFolderNameRootName = () => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    const workspaceFolder = workspaceFolders[0];
    return path.basename(path.dirname(workspaceFolder.uri.fsPath)) + '/' + path.basename(workspaceFolder.uri.fsPath);
  }
  return '';
}

const projectRootFullPath = () => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    const workspaceFolder = workspaceFolders[0];
    return driveLetterUpper(workspaceFolder.uri.fsPath);
  }
  return '';
}

const getTabsToRight =(tabs, activeIndex) => {
  return tabs.slice(activeIndex);
}

const copyAndMessage = (text, successMessage, warningMessage) => {
  if (text !== '') {
    vscode.env.clipboard.writeText(text);
    vscode.window.showInformationMessage(successMessage);
  } else {
    vscode.window.showWarningMessage(warningMessage);
  }
}

const copyPathsGroups = (pathsGroups, pathTypeText) => {
  const result = pathsGroups.map(paths => paths.join('\n')).join('\n\n');
  const pathCount = pathsGroups.flat().length;

  copyAndMessage(result,
    `Copied: ${pathTypeText}${pathCount > 1 ? 's' : ''}: ${pathCount}`,
    `No ${pathTypeText} to copy.`);
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
  copyPathsGroups(pathsGroups, 'file name');
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
  copyPathsGroups(pathsGroups, 'file name');
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
  copyPathsGroups(pathsGroups, 'relative path');
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
  copyPathsGroups(pathsGroups, 'project relative path');
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
  copyPathsGroups(pathsGroups, 'file path');
}

const copyProjectRootName = () => {
  const folderName = projectRootName();

  copyAndMessage(folderName,
    `Copied project root folder name: ${folderName}`,
    'No project root folder found.');
}

const copyProjectRootFullPath = () => {
  const fullPath = projectRootFullPath();
  copyAndMessage(fullPath,
    `Copied project root full path: ${fullPath}`,
    'No project root folder found.');
}

const copyProjectFolderNameRootName = () => {
  const folderName = projectFolderNameRootName();

  copyAndMessage(folderName,
    `Copied project folder name and root name: ${folderName}`,
    'No project folder found.');
}

// Explorer context functions
const filePathInfo = (filePath) => {
  const fullPath = driveLetterUpper(filePath);
  const fileName = path.basename(fullPath);
  const fileNameWithoutExt = path.basename(fullPath, path.extname(fullPath));

  const workspaceFolders = vscode.workspace.workspaceFolders;
  let relativePath = fullPath;
  let projectRelativePath = fullPath;

  if (workspaceFolders && workspaceFolders.length > 0) {
    const workspaceFolder = workspaceFolders[0];
    relativePath = path.relative(workspaceFolder.uri.fsPath, fullPath);
    projectRelativePath = path.relative(
      path.dirname(workspaceFolder.uri.fsPath),
      fullPath
    ).replaceAll('\\', '/');
  }

  return {
    fullPath,
    fileName,
    fileNameWithoutExt,
    relativePath,
    projectRelativePath
  };
};

const copySelectedFilesInfo = (uris, infoType) => {
  if (!uris || uris.length === 0) {
    vscode.window.showWarningMessage('No files selected.');
    return;
  }

  const paths = [];
  for (const uri of uris) {
    const fileInfo = filePathInfo(uri.fsPath);
    const pathValue = fileInfo[infoType];
    if (pathValue !== '') {
      paths.push(pathValue);
    }
  }

  const result = paths.join('\n');
  const pathCount = paths.length;

  if (result !== '') {
    vscode.env.clipboard.writeText(result);
    const typeLabel = infoType === 'fullPath' ? 'file path' :
                     infoType === 'fileName' ? 'file name' :
                     infoType === 'fileNameWithoutExt' ? 'file name' :
                     infoType === 'relativePath' ? 'relative path' :
                     infoType === 'projectRelativePath' ? 'project relative path' : 'file info';
    vscode.window.showInformationMessage(`Copied: ${typeLabel}${pathCount > 1 ? 's' : ''}: ${pathCount}`);
  } else {
    vscode.window.showWarningMessage('No file paths to copy.');
  }
};

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
      { label: 'Project', kind: vscode.QuickPickItemKind.Separator },
      { label: 'Project : Copy project root name', func: () => { copyProjectRootName() }},
      { label: 'Project : Copy project folder name and root name', func: () => { copyProjectFolderNameRootName() }},
      { label: 'Project : Copy project root full path', func: () => { copyProjectRootFullPath() }}
    ];

    commandQuickPick(options, 'Select what to copy');
  });

  registerCommand(context, 'vscode-copy-tabs-filepath.copySelectedFilesPath', async (selectedFilePath, allSelectedFilePaths) => {
    const selectedPaths = allSelectedFilePaths && allSelectedFilePaths.length > 0 ? allSelectedFilePaths : [selectedFilePath];

    if (!selectedPaths || selectedPaths.length === 0) {
      vscode.window.showWarningMessage('No files selected.');
      return;
    }

    const options = [
      { label: 'Copy file name', func: () => { copySelectedFilesInfo(selectedPaths, 'fileName') } },
      { label: 'Copy file name without extension', func: () => { copySelectedFilesInfo(selectedPaths, 'fileNameWithoutExt') } },
      { label: 'Copy relative path', func: () => { copySelectedFilesInfo(selectedPaths, 'relativePath') } },
      { label: 'Copy relative path slash with project root', func: () => { copySelectedFilesInfo(selectedPaths, 'projectRelativePath') } },
      { label: 'Copy file full path', func: () => { copySelectedFilesInfo(selectedPaths, 'fullPath') } }
    ];

    commandQuickPick(options, `Select copy format for ${selectedPaths.length} file${selectedPaths.length > 1 ? 's' : ''}`);
  });
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};
