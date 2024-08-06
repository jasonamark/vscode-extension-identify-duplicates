# A Visual Studio Code Extension to Identify Duplicate Code

This Visual Studio Code extension identifies duplicate CSS rules, interface definitions, enums, and methods within your project. The duplicate objects are listed in a tree view grouped by type, allowing you to easily navigate and manage your codebase.

## Development

- Clone this repository.
- Run `npm install` to install dependencies.
- Run `npm run watch` to start developing.
- Run command `Debug: Start Debugging` in the command palette.

## Publish

To generate a identify-duplicates-[version].vsix file.

- Run `npm install -g vsce` to install Visual Studio Code Extension Manager.
- Run `vsce package` in the root folder.

## Installation

To install a identify-duplicates-[version].vsix file.

Using VS Code:

- Go to the Extensions view.
- Click Views and More Actions...
- Select Install from VSIX...

Using a terminal:

- Run `code --install-extension identify-duplicates-[version].vsix`

Upcoming features:

1. Customize the root directory for your analysis.
2. Specify directories to exclude from the repository analysis.
