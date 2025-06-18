# Copy Tabs FilePath

[![](https://vsmarketplacebadges.dev/version-short/SatoshiYamamoto.vscode-copy-tabs-filepath.png)](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-copy-tabs-filepath)
[![](https://vsmarketplacebadges.dev/installs-short/SatoshiYamamoto.vscode-copy-tabs-filepath.png)](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-copy-tabs-filepath)
[![](https://vsmarketplacebadges.dev/rating-short/SatoshiYamamoto.vscode-copy-tabs-filepath.png)](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-copy-tabs-filepath)
[![](https://img.shields.io/github/license/standard-software/vscode-copy-tabs-filepath.png)](https://github.com/standard-software/vscode-copy-tabs-filepath/blob/main/LICENSE)

This extension allows you to copy the file paths or file names of the active tab, tabs to the right of the active tab, or all tabs to the clipboard.

## Features

- Copy file paths of the active tab or explorer view
- Copy file paths of multiple tabs to the right of the active tab in batch
- Copy file paths of all tabs in the window
- You can choose from different types of file paths
  - filename
  - filename without extension
  - relative path
  - relative path including project root name
  - full path

![](https://raw.githubusercontent.com/standard-software/vscode-copy-tabs-filepath/README_IMG/README_01.png)
![](https://raw.githubusercontent.com/standard-software/vscode-copy-tabs-filepath/README_IMG/README_02.png)
![](https://raw.githubusercontent.com/standard-software/vscode-copy-tabs-filepath/README_IMG/README_03.png)
![](https://raw.githubusercontent.com/standard-software/vscode-copy-tabs-filepath/README_IMG/README_04.png)

## Installation

[Visual Studio Marketplace - Copy Tabs FilePath](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-copy-tabs-filepath)

## GitHub

[standard-software/vscode-copy-tabs-filepath](https://github.com/standard-software/vscode-copy-tabs-filepath)

## Usage

Open the command palette (`Ctrl+Shift+P`) and type  
`Copy Tabs FilePath`  
Select the desired command.

Alternatively, you can right-click on an editor tab and select  
`Copy Tabs FilePath`  
from the context menu.

- Copy Tabs FilePath
  - Active Tab
    - Active Tab : Copy file name
    - Active Tab : Copy file name without extension
    - Active Tab : Copy relative path
    - Active Tab : Copy relative path with project root
    - Active Tab : Copy file full path

  - Tabs to Right of Active Tab
    - Tabs to Right : Copy file name
    - Tabs to Right : Copy file name without extension
    - Tabs to Right : Copy relative path
    - Tabs to Right : Copy relative path with project root
    - Tabs to Right : Copy file full path

  - All Tabs in All Groups
    - All Tabs : Copy file name
    - All Tabs : Copy file name without extension
    - All Tabs : Copy relative path
    - All Tabs : Copy relative path with project root
    - All Tabs : Copy file full path

  - Project
    - Project : Copy project root name
    - Project : Copy project folder name and root name
    - Project : Copy project root full path

you can right-click on an explorer view item(multi select) and select  
`Copy Tabs FilePath : explorer`  
from the context menu.

- Copy Tabs FilePath : explorer
  - Copy file name
  - Copy file name without extension
  - Copy relative path
  - Copy relative path with project root
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
