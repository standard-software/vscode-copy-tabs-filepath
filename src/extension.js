const vscode = require('vscode');
const path = require(`path`);

const {
  isUndefined,
} = require(`./parts/parts.js`);

const {
  registerCommand,
  commandQuickPick,
} = require(`./lib/libVSCode.js`);

const getWorkspaceFolderPath = () => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0].uri.fsPath;
  }
  return undefined;
};

const driveLetterUpper = path => {
  if (path[1] === `:`) {
    return path[0].toUpperCase() + path.slice(1);
  }
  return path;
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

  let relativePath = undefined;
  let projectRelativePathSlash = undefined;
  const workspaceFolderPath = getWorkspaceFolderPath();
  if (!isUndefined(workspaceFolderPath)) {
    relativePath = path.relative(workspaceFolderPath, fullPath);
    projectRelativePathSlash = path.relative(
      path.dirname(workspaceFolderPath),
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
  const workspaceFolderPath = getWorkspaceFolderPath();
  if (!isUndefined(workspaceFolderPath)) {
    return path.basename(workspaceFolderPath);
  }
  return '';
}

const projectFolderNameRootName = () => {
  const workspaceFolderPath = getWorkspaceFolderPath();
  if (workspaceFolderPath) {
    return path.basename(path.dirname(workspaceFolderPath)) + '/' + path.basename(workspaceFolderPath);
  }
  return '';
}

const projectRootFullPath = () => {
  const workspaceFolderPath = getWorkspaceFolderPath();
  if (workspaceFolderPath) {
    return driveLetterUpper(workspaceFolderPath);
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

const filePathTypeToText = (filePathType, s) => {
  switch (filePathType) {
    case 'fullPath':
      return `full path${s}`;
    case 'fileName':
      return `file name${s}`;
    case 'fileNameWithoutExt':
      return `file name${s} without extension`;
    case 'relativePath':
      return `relative path${s}`;
    case 'projectRelativePathSlash':
      return `project relative path${s} slash`;
    default:
      throw new Error('Unknown file path type: ' + filePathType);
  }
};

const copyPathsGroupsAndMessage = (pathsGroups, filePathType) => {
  const result = pathsGroups.map(paths => paths.join('\n')).join('\n\n');
  const pathCount = pathsGroups.flat().length;

  const pathTypeText = filePathTypeToText(
    filePathType,
    pathCount > 1 ? 's' : ''
  );

  copyAndMessage(result,
    `Copied: ${pathTypeText}: ${pathCount}`,
    `No ${pathTypeText} to copy.`);
}

const copyTabsGroupsFilePath = (tabsGroups, filePathType) => {
  const pathsGroups = [];
  for (const tabs of tabsGroups) {
    const paths = [];
    for (const tab of tabs) {
      const path = filePathInfo(tab.input?.uri?.fsPath)[filePathType];
      if (isUndefined(path)) { continue; }
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


const copyExplorerFilePath = (filePaths, filePathType) => {
  if (!filePaths || filePaths.length === 0) {
    vscode.window.showWarningMessage('No files selected.');
    return;
  }

  const paths = [];
  for (const filePath of filePaths) {
      const path = filePathInfo(filePath)[filePathType];
    if (isUndefined(path)) { continue; }
    paths.push(path);
  }

  const result = paths.join('\n');
  const pathCount = paths.length;

  const pathTypeText = filePathTypeToText(
    filePathType,
    pathCount > 1 ? 's' : ''
  );
  copyAndMessage(result,
    `Copied: ${pathTypeText}: ${pathCount}`,
    `No ${pathTypeText} to copy.`);
};

function activate(context) {
  registerCommand(context, 'vscode-copy-tabs-filepath.editorTitleContextMenu',
    async () => {
      const activeGroup = vscode.window.tabGroups.activeTabGroup;

      if (!activeGroup || !activeGroup.tabs || activeGroup.tabs.length === 0) {
        vscode.window.showWarningMessage('Copy Tabs FilePath : No active tab group or tabs found.');
        return;
      }

      const activeIndex = activeGroup.tabs.findIndex(tab => tab.isActive);

      const tabsToRight = getTabsToRight(activeGroup.tabs, activeIndex);
      const tabsRightText = `${tabsToRight.length} Tab${tabsToRight.length > 1 ? 's' : ''}`;
      const allTabsAllGroups = vscode.window.tabGroups.all.map(group => group.tabs);
      const allTabsCount = allTabsAllGroups.flat().length;
      const tabsAllText = `${allTabsCount} Tab${allTabsCount > 1 ? 's' : ''}`;

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
        if (!isUndefined(getWorkspaceFolderPath())) {
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
        { label: `Tabs to Right of Active Tab : ${tabsRightText}`, kind: vscode.QuickPickItemKind.Separator },
        ...createSubOptions([tabsToRight], 'Tabs to Right'),
        { label: `All Tabs in All Groups : ${tabsAllText}`, kind: vscode.QuickPickItemKind.Separator },
        ...createSubOptions(allTabsAllGroups, 'All Tabs'),
      ];
      if (!isUndefined(getWorkspaceFolderPath())) {
        options.push({
          label: 'Project', kind: vscode.QuickPickItemKind.Separator
        });
        options.push({
          label: 'Project : Copy project root name',
          func: () => { copyProjectRootName() }
        });
        options.push({
          label: 'Project : Copy project folder name and root name',
          func: () => { copyProjectFolderNameRootName() }
        });
        options.push({
          label: 'Project : Copy project root full path',
          func: () => { copyProjectRootFullPath() }
        });
      }
      commandQuickPick(
        options,
        `Select copy type and format`
      );
    }
  );

  registerCommand(context, 'vscode-copy-tabs-filepath.explorerContextMenu',
    async (uri, allUris) => {
      const uris =
        (allUris && allUris.length > 0)
        ? allUris : [uri];

      if (!uris || uris.length === 0) {
        vscode.window.showWarningMessage('No files selected.');
        return;
      }
      const selectedFilePaths = uris.map(u => u.fsPath);

      const options = [];
      options.push({
        label: 'Copy file name',
        func: () => { copyExplorerFilePath(selectedFilePaths, 'fileName') }
      });
      options.push({
        label: 'Copy file name without extension',
        func: () => { copyExplorerFilePath(selectedFilePaths, 'fileNameWithoutExt') }
      });
      if (!isUndefined(getWorkspaceFolderPath())) {
        options.push({
          label: 'Copy relative path',
          func: () => { copyExplorerFilePath(selectedFilePaths, 'relativePath') }
        });
        options.push({
          label: 'Copy relative path slash with project root',
          func: () => { copyExplorerFilePath(selectedFilePaths, 'projectRelativePathSlash') }
        });
      }
      options.push({
        label: 'Copy file full path',
        func: () => { copyExplorerFilePath(selectedFilePaths, 'fullPath') }
      });
      commandQuickPick(
        options,
        `Select copy format for ${
          selectedFilePaths.length
        } file${
          selectedFilePaths.length > 1 ? 's' : ''
        }`
      );
    }
  );
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};
