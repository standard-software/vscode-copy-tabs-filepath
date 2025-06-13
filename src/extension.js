const vscode = require('vscode');

const QuickPickItemKind = {
  Separator: -1,
  Default: 0
};

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
  // activeIndexも含める
  return tabs.slice(0, activeIndex + 1);
}

function getTabsToRight(tabs, activeIndex) {
  // activeIndexも含める
  return tabs.slice(activeIndex);
}

function getAllTabsInAllGroups() {
  return vscode.window.tabGroups.all.flatMap(group => group.tabs);
}

function getAllTabsInActiveGroup() {
  return vscode.window.tabGroups.activeTabGroup.tabs;
}

function activate(context) {
  const showCopyOptionsDisposable = vscode.commands.registerCommand('vscode-copy-tabs-filepath.copyFilePath', async function () {
    const activeGroup = vscode.window.tabGroups.activeTabGroup;
    const activeTab = activeGroup.activeTab;
    const tabs = activeGroup.tabs;
    const activeIndex = tabs.findIndex(tab => tab.isActive);

    const options = [
      { label: 'Active Tab', kind: QuickPickItemKind.Separator },
      { label: 'Copy Path', value: 'active_path', kind: QuickPickItemKind.Default },
      { label: 'Copy Filename', value: 'active_name', kind: QuickPickItemKind.Default },

      { label: 'Tabs to Right', kind: QuickPickItemKind.Separator },
      { label: 'Copy Path', value: 'right_path', kind: QuickPickItemKind.Default },
      { label: 'Copy Filename', value: 'right_name', kind: QuickPickItemKind.Default },

      { label: 'Tabs to Left', kind: QuickPickItemKind.Separator },
      { label: 'Copy Path', value: 'left_path', kind: QuickPickItemKind.Default },
      { label: 'Copy Filename', value: 'left_name', kind: QuickPickItemKind.Default },

      { label: 'All Tabs in Active Group', kind: QuickPickItemKind.Separator },
      { label: 'Copy Path', value: 'group_path', kind: QuickPickItemKind.Default },
      { label: 'Copy Filename', value: 'group_name', kind: QuickPickItemKind.Default },

      { label: 'All Tabs in All Groups', kind: QuickPickItemKind.Separator },
      { label: 'Copy Path', value: 'all_path', kind: QuickPickItemKind.Default },
      { label: 'Copy Filename', value: 'all_name', kind: QuickPickItemKind.Default }
    ];

    const selected = await vscode.window.showQuickPick(options, { placeHolder: 'Select what to copy' });
    if (!selected || selected.kind === QuickPickItemKind.Separator) return;

    let result = '';
    switch (selected.value) {
      case 'active_path':
        if (activeTab) {
          result = getTabFilePath(activeTab);
        }
        break;
      case 'active_name':
        if (activeTab) {
          result = getTabFileName(activeTab);
        }
        break;
      case 'right_path': {
        const rightTabs = getTabsToRight(tabs, activeIndex);
        result = rightTabs.map(getTabFilePath).filter(Boolean).join('\n');
        break;
      }
      case 'right_name': {
        const rightTabs = getTabsToRight(tabs, activeIndex);
        result = rightTabs.map(getTabFileName).filter(Boolean).join('\n');
        break;
      }
      case 'left_path': {
        const leftTabs = getTabsToLeft(tabs, activeIndex);
        result = leftTabs.map(getTabFilePath).filter(Boolean).join('\n');
        break;
      }
      case 'left_name': {
        const leftTabs = getTabsToLeft(tabs, activeIndex);
        result = leftTabs.map(getTabFileName).filter(Boolean).join('\n');
        break;
      }
      case 'group_path': {
        result = tabs.map(getTabFilePath).filter(Boolean).join('\n');
        break;
      }
      case 'group_name': {
        result = tabs.map(getTabFileName).filter(Boolean).join('\n');
        break;
      }
      case 'all_path': {
        // タブグループごとに空行を挿入
        result = vscode.window.tabGroups.all
          .map(group => group.tabs.map(getTabFilePath).filter(Boolean).join('\n'))
          .join('\n\n');
        break;
      }
      case 'all_name': {
        // タブグループごとに空行を挿入
        result = vscode.window.tabGroups.all
          .map(group => group.tabs.map(getTabFileName).filter(Boolean).join('\n'))
          .join('\n\n');
        break;
      }
    }
    if (result) {
      await vscode.env.clipboard.writeText(result);
      vscode.window.showInformationMessage('Copied: ' + result.split('\n').slice(0, 3).join(', ') + (result.includes('\n') ? ' ...' : ''));
    } else {
      vscode.window.showWarningMessage('No file(s) to copy.');
    }
  });
  context.subscriptions.push(showCopyOptionsDisposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
