const vscode = require('vscode');

const {
  registerCommand,
  commandQuickPick,
} = require(`./lib/libVSCode.js`);

function getTabFilePath(tab) {
  if (tab.input && tab.input.uri) {
    return tab.input.uri.fsPath;
  }
  return undefined;
}

function getTabFileName(tab) {
  const path = getTabFilePath(tab);
  if (!path) return undefined;
  return path.split(/[/\\]/).pop();
}

function getTabsToLeft(tabs, activeIndex) {
  return tabs.slice(0, activeIndex + 1);
}

function getTabsToRight(tabs, activeIndex) {
  return tabs.slice(activeIndex);
}

const copyFileName = (tabsGroups) => {
  const result = tabsGroups
    .map(tabs => tabs.map(getTabFileName).filter(Boolean).join('\n'))
    .join('\n\n');

  if (result) {
    vscode.env.clipboard.writeText(result);
    vscode.window.showInformationMessage('Copied: ' + result.split('\n').slice(0, 3).join(', ') + (result.includes('\n') ? ' ...' : ''));
  } else {
    vscode.window.showWarningMessage('No filenames to copy.');
  }
}

const copyFilePath = (tabsGroups) => {
  const result = tabsGroups
    .map(tabs => tabs.map(getTabFilePath).filter(Boolean).join('\n'))
    .join('\n\n');

  if (result) {
    vscode.env.clipboard.writeText(result);
    vscode.window.showInformationMessage('Copied: ' + result.split('\n').slice(0, 3).join(', ') + (result.includes('\n') ? ' ...' : ''));
  } else {
    vscode.window.showWarningMessage('No file paths to copy.');
  }
}

function activate(context) {
  registerCommand(context, 'vscode-copy-tabs-filepath.copyFilePath', async function () {
    const activeGroup = vscode.window.tabGroups.activeTabGroup;
    const activeIndex = activeGroup.tabs.findIndex(tab => tab.isActive);

    const options = [
      { label: 'Active Tab', kind: vscode.QuickPickItemKind.Separator },
      {
        label: 'Copy Path',
        func: () => {
          copyFilePath([[activeGroup.activeTab]]);
        }
      },
      {
        label: 'Copy Filename',
        func: () => {
          copyFileName([[activeGroup.activeTab]]);
        }
      },

      { label: 'Tabs to Right', kind: vscode.QuickPickItemKind.Separator },
      {
        label: 'Copy Path',
        func: () => {
          copyFilePath([getTabsToRight(activeGroup.tabs, activeIndex)]);
        }
      },
      {
        label: 'Copy Filename',
        func: () => {
          copyFileName([getTabsToRight(activeGroup.tabs, activeIndex)]);
        }
      },

      { label: 'Tabs to Left', kind: vscode.QuickPickItemKind.Separator },
      {
        label: 'Copy Path',
        func: () => {
          copyFilePath([getTabsToLeft(activeGroup.tabs, activeIndex)]);
        }
      },
      {
        label: 'Copy Filename',
        func: () => {
          copyFileName([getTabsToLeft(activeGroup.tabs, activeIndex)]);
        }
      },

      { label: 'All Tabs in Active Group', kind: vscode.QuickPickItemKind.Separator },
      {
        label: 'Copy Path',
        func: () => {
          copyFilePath([activeGroup.tabs]);
        }
      },
      {
        label: 'Copy Filename',
        func: () => {
          copyFileName([activeGroup.tabs]);
        }
      },

      { label: 'All Tabs in All Groups', kind: vscode.QuickPickItemKind.Separator },
      {
        label: 'Copy Path',
        func: () => {
          copyFilePath(vscode.window.tabGroups.all.map(group => group.tabs));
        }
      },
      {
        label: 'Copy Filename',
        func: () => {
          copyFileName(vscode.window.tabGroups.all.map(group => group.tabs));
        }
      }
    ];

    commandQuickPick(options, 'Select what to copy');
  });
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};
