# Change Log

All notable changes to the "vscode-copy-tabs-filepath" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.1.0] - 2025-06-18 Wed

### Added
- Active Tab context menu
  - Project root name copy
  - Project folder name and root name copy
  - Project root full path copy
- exploer view context menu
  - File name only
  - File name without extension
  - Relative path from workspace root
  - Relative path including project root name
  - Full path

## [1.0.1] - 2025-06-17

- update CHANGELOG.md

## [1.0.0] - 2025-06-17

### Added
- Initial release of Copy Tabs FilePath extension
- Command palette integration with `Copy Tabs FilePath` command
- Tab context menu integration for easy access
- Support for copying file paths from multiple tab scopes:
  - Active Tab: Copy file information from the currently active tab
  - Tabs to Right: Copy file information from all tabs to the right of the active tab
  - All Tabs in All Groups: Copy file information from all open tabs across all editor groups
- Multiple file path format options:
  - File name only
  - File name without extension
  - Relative path from workspace root
  - Relative path including project root name
  - Full path
