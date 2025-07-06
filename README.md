# Copy Tabs FilePath

[![](https://vsmarketplacebadges.dev/version-short/SatoshiYamamoto.vscode-copy-tabs-filepath.png)](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-copy-tabs-filepath)
[![](https://vsmarketplacebadges.dev/installs-short/SatoshiYamamoto.vscode-copy-tabs-filepath.png)](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-copy-tabs-filepath)
[![](https://vsmarketplacebadges.dev/rating-short/SatoshiYamamoto.vscode-copy-tabs-filepath.png)](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-copy-tabs-filepath)
[![](https://img.shields.io/github/license/standard-software/vscode-copy-tabs-filepath.png)](https://github.com/standard-software/vscode-copy-tabs-filepath/blob/main/LICENSE)

This extension allows you to copy the file paths or file names of the active tab, tabs to the right of the active tab, or all tabs to the clipboard.

## Features

- Copy file names and file paths of active tabs, left/right tabs, or all tabs in VS Code.
- Copy file names and file paths of selected files in VS Code Explorer panel.
- You can choose from different types of file paths
  - filename
  - filename without extension
  - relative path
  - relative path including project root name
  - full path

## Screenshots

- Context menu for active tab

![](https://raw.githubusercontent.com/standard-software/vscode-copy-tabs-filepath/main/README_IMG/README_01.png)

---

- Command palette that opens when selecting context menu. When no folder is open in VS Code.

![](https://raw.githubusercontent.com/standard-software/vscode-copy-tabs-filepath/main/README_IMG/README_02.png)

---

- Command palette that opens when selecting context menu. When a folder is open in VS Code.

![](https://raw.githubusercontent.com/standard-software/vscode-copy-tabs-filepath/main/README_IMG/README_03.png)

---

- Context menu for selected file in Explorer pane.

![](https://raw.githubusercontent.com/standard-software/vscode-copy-tabs-filepath/main/README_IMG/README_04.png)

---

- Command palette that opens when selecting context menu in Explorer pane.

![](https://raw.githubusercontent.com/standard-software/vscode-copy-tabs-filepath/main/README_IMG/README_05.png)

## Installation

[Visual Studio Marketplace - Copy Tabs FilePath](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-copy-tabs-filepath)

## GitHub

[standard-software/vscode-copy-tabs-filepath](https://github.com/standard-software/vscode-copy-tabs-filepath)

## Usage

[1]
you can right-click on an editor tab and select  
`Copy Tabs FilePath : Active Tab FileName`  
`Copy Tabs FilePath : Right Tabs FileName`  
`Copy Tabs FilePath : Left Tabs FileName`

[2]
Open the command palette (`Ctrl+Shift+P`) and type  
`Copy Tabs FilePath`  
Select the desired command.

Alternatively, you can right-click on an editor tab and select  
`Copy Tabs FilePath : more`
from the context menu.

- Copy Tabs FilePath

  - Active Tab

    - Active Tab : Copy file name
    - Active Tab : Copy file name without extension
    - Active Tab : Copy relative path
    - Active Tab : Copy relative path slash with project root
    - Active Tab : Copy file full path

  - Right Tabs

    - Right Tabs : Copy file name
    - Right Tabs : Copy file name without extension
    - Right Tabs : Copy relative path
    - Right Tabs : Copy relative path slash with project root
    - Right Tabs : Copy file full path

  - LeftRight Tabs

    - Left Tabs : Copy file name
    - Left Tabs : Copy file name without extension
    - Left Tabs : Copy relative path
    - Left Tabs : Copy relative path slash with project root
    - Left Tabs : Copy file full path

  - All Tabs in All Groups

    - All Tabs : Copy file name
    - All Tabs : Copy file name without extension
    - All Tabs : Copy relative path
    - All Tabs : Copy relative path slash with project root
    - All Tabs : Copy file full path

  - Project
    - Project : Copy project root name
    - Project : Copy project folder name and root name
    - Project : Copy project root full path

[3]
you can right-click on an explorer view item(multi select) and select  
`Copy Tabs FilePath : Explorer`  
from the context menu.

- Copy Tabs FilePath : explorer
  - Copy file name
  - Copy file name without extension
  - Copy relative path
  - Copy relative path slash with project root
  - Copy file full path

Relative path and project path options are displayed only when a workspace folder is open.

## Settings

No special settings are required at this time.

## Support / Contact

For requests or bug reports, please contact via GitHub Issues or email.

Satoshi Yamamoto  
standard.software.net@gmail.com  
Japanese / English

## License

MIT License

---
