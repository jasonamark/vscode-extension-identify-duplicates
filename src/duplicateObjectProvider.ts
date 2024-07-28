import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class DuplicateObjectProvider implements vscode.TreeDataProvider<TreeItem> {

	onDidChangeTreeData?: vscode.Event<TreeItem|null|undefined>|undefined;

	data: TreeItem[];

	constructor(private workspaceRoot: string | undefined) {
		console.log('!! workspaceRoot', workspaceRoot);
		
		this.data = [new TreeItem('cars', [
      new TreeItem(
          'Ford', [new TreeItem('Fiesta'), new TreeItem('Focus'), new TreeItem('Mustang')]),
      new TreeItem(
          'BMW', [new TreeItem('320'), new TreeItem('X3'), new TreeItem('X5')])
    ])];

		vscode.commands.registerCommand('identify-duplicates.openFile', item => this.openFile(item));
	}

	getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    element.command = { command: 'identify-duplicates.openFile', title : 'title', arguments: [element] };
		return element;
  }

  getChildren(element?: TreeItem | undefined): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }

	public openFile(item: TreeItem) {
		console.log('!! openFile', item);
		if (item.file === undefined) return;
		// first we open the document
		vscode.workspace.openTextDocument(item.file).then( document => {
				// after opening the document, we set the cursor 
				// and here we make use of the line property which makes imo the code easier to read
				vscode.window.showTextDocument(document).then( editor => {
								let pos = new vscode.Position(item.line.row, item.line.length);
								// here we set the cursor
								editor.selection = new vscode.Selection(pos, pos);
								// here we set the focus of the opened editor
								editor.revealRange(new vscode.Range(pos, pos));
						}
				);
		});
	}
}

class line {
	readonly text : string;
	readonly row : number;
	readonly length : number;

	constructor (text : string, row : number) {
			this.text = text;
			this.length = text.length;
			this.row = row;
	}
}

export class TreeItem extends vscode.TreeItem {
  children: TreeItem[] | undefined;
	readonly file: string;
	readonly line: line;

  constructor(label: string, children?: TreeItem[]) {
    super(
        label,
        children === undefined ? vscode.TreeItemCollapsibleState.None :vscode.TreeItemCollapsibleState.Expanded)
		
		if (children) {
			this.iconPath = vscode.ThemeIcon.Folder
		} else {
			this.iconPath = vscode.ThemeIcon.File
		}
		this.children = children;

		this.iconPath = path.join(__filename, '..', '..', 'resources', 'icons', 'file_type_ai.svg');
		this.file = '/Users/jasonmark/Documents/JAS/vscode-extension-identify-duplicates/src/nodeDependencies.ts';
    this.line = new line('	constructor (text : string, row : number)', 57);
  }
}
