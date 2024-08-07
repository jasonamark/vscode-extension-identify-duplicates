# A Visual Studio Code Extension to Identify Duplicate Code

This Visual Studio Code extension identifies duplicate object definitions in your codebase. It scans your project for redundant:

- Method bodies
- Interface declarations
- Enum structures
- CSS class definitions

## Features

- **Tree View Listing**: View identical CSS rules, interface definitions, enums, and methods grouped by type.
- **File Navigation**: Click on an item in the tree view to open the file and set the cursor on the definition.
- **Manual Refresh**: Use the refresh button at the top of the tree view to refresh the list after making file changes.
- **Automatic Exclusion**: Ignores files located in the node_modules directory and any directory prefixed with a '.'.

## Usage

![Repository Visualization](https://github.com/jasonamark/jasonamark/raw/main/identify-duplicates.gif)

## Why This Extension is Helpful

By identifying duplicate objects, this extension helps you eliminate redundancy, making your codebase cleaner and more maintainable.

## Features in Development

- **Set Root Directory**: Customize the root directory for your analysis.
- **Directory Exclusion**: Specify directories to exclude from the repository analysis.

## Feedback

I value your feedback and suggestions! If you encounter any issues, have questions, or want to propose new features, please send me an email [jason.a.mark@gmail.com](jason.a.mark@gmail.com).
