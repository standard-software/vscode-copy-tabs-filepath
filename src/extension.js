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

const hasWorkspaceFolder = () => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  return workspaceFolders && workspaceFolders.length > 0;
};

const filePathInfo = (filePath) => {
  if (!filePath) {
    return {
      fullPath: undefined,
      fileName: undefined,
      fileNameWithoutExt: undefined,
      relativePath: undefined,
      projectRelativePathSlash: undefined
    };
  }
  const fullPath = driveLetterUpper(filePath);
  const fileName = path.basename(fullPath);
  const fileNameWithoutExt = path.basename(fullPath, path.extname(fullPath));

  const workspaceFolders = vscode.workspace.workspaceFolders;
  let relativePath = undefined;
  let projectRelativePathSlash = undefined;

  if (hasWorkspaceFolder()) {
    const workspaceFolder = workspaceFolders[0];
    relativePath = path.relative(workspaceFolder.uri.fsPath, fullPath);
    projectRelativePathSlash = path.relative(
      path.dirname(workspaceFolder.uri.fsPath),
      fullPath
    ).replaceAll('\\', '/');
  }
  return {
    fullPath,
    fileName,
    fileNameWithoutExt,
    relativePath,
    projectRelativePathSlash
  };
};

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

const copyPathsGroupsAndMessage = (pathsGroups, pathTypeText) => {
  const result = pathsGroups.map(paths => paths.join('\n')).join('\n\n');
  const pathCount = pathsGroups.flat().length;

  copyAndMessage(result,
    `Copied: ${pathTypeText}${pathCount > 1 ? 's' : ''}: ${pathCount}`,
    `No ${pathTypeText} to copy.`);
}

const copyTabsGroupsFilePath = (tabsGroups, filePathType) => {
  const pathsGroups = [];
  for (const tabs of tabsGroups) {
    const paths = [];
    for (const tab of tabs) {
      const path = filePathInfo(tab.input?.uri?.fsPath)[filePathType];
      if (path === undefined) { continue; }
      paths.push(path);
    }
    pathsGroups.push(paths);
  }
  copyPathsGroupsAndMessage(pathsGroups, filePathType);
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


const copySelectedFilesInfo = (uris, filePathType) => {
  if (!uris || uris.length === 0) {
    vscode.window.showWarningMessage('No files selected.');
    return;
  }

  const paths = [];
  for (const uri of uris) {
    const fileInfo = filePathInfo(uri.fsPath);
    const pathValue = fileInfo[filePathType];
    if (pathValue !== '') {
      paths.push(pathValue);
    }
  }

  const result = paths.join('\n');
  const pathCount = paths.length;

  if (result !== '') {
    vscode.env.clipboard.writeText(result);
    const typeLabel = filePathType === 'fullPath' ? 'file path' :
                     filePathType === 'fileName' ? 'file name' :
                     filePathType === 'fileNameWithoutExt' ? 'file name' :
                     filePathType === 'relativePath' ? 'relative path' :
                     filePathType === 'projectRelativePathSlash' ? 'project relative path' : 'file info';
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
      options.push({
        label: `${groupName} : Copy file name`,
        func: () => { copyTabsGroupsFilePath(tabsGroups, 'fileName') }
      });
      options.push({
        label: `${groupName} : Copy file name without extension`,
        func: () => { copyTabsGroupsFilePath(tabsGroups, 'fileNameWithoutExt') }
      });
      if (hasWorkspaceFolder()) {
        options.push({
          label: `${groupName} : Copy relative path`,
          func: () => { copyTabsGroupsFilePath(tabsGroups, 'relativePath') }
        });
        options.push({
          label: `${groupName} : Copy relative path slash with project root`,
          func: () => { copyTabsGroupsFilePath(tabsGroups, 'projectRelativePathSlash') }
        });
      }
      options.push({
        label: `${groupName} : Copy file full path`,
        func: () => { copyTabsGroupsFilePath(tabsGroups, 'fullPath') }
      });

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

    const options = [];
    options.push({
      label: 'Copy file name',
      func: () => { copySelectedFilesInfo(selectedPaths, 'fileName') }
    });
    options.push({
      label: 'Copy file name without extension',
      func: () => { copySelectedFilesInfo(selectedPaths, 'fileNameWithoutExt') }
    });
    if (hasWorkspaceFolder()) {
      options.push({
        label: 'Copy relative path',
        func: () => { copySelectedFilesInfo(selectedPaths, 'relativePath') }
      });
      options.push({
        label: 'Copy relative path slash with project root',
        func: () => { copySelectedFilesInfo(selectedPaths, 'projectRelativePathSlash') }
      });
    }
    options.push({
      label: 'Copy file full path',
      func: () => { copySelectedFilesInfo(selectedPaths, 'fullPath') }
    });

    commandQuickPick(options, `Select copy format for ${selectedPaths.length} file${selectedPaths.length > 1 ? 's' : ''}`);
  });
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};
