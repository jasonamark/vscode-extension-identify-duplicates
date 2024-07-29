import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { IDuplicateGroup, ITreeObject } from './findIdentialObjects';

export class DuplicateObjectProvider implements vscode.TreeDataProvider<TreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined> = new vscode.EventEmitter<TreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined> = this._onDidChangeTreeData.event;

	data: TreeItem[];

	constructor(private duplicateGroups: IDuplicateGroup[]) {
		const cssItems: any[] = []
		duplicateGroups.map((group) => {
			const objectsWithSameDeclarations = group.duplicates.map((treeObject: ITreeObject) => {
				return new TreeItem(treeObject.name, [], treeObject.lineNumber, treeObject.filePath)
			})
			cssItems.push(new TreeItem('identical definitions', objectsWithSameDeclarations));
		});
		this.data = [new TreeItem('css', cssItems)];

		// this.data = [];
		// this.data = [new TreeItem('cars', [
		//   new TreeItem(
		//       'Ford', [new TreeItem('Fiesta'), new TreeItem('Focus'), new TreeItem('Mustang')]),
		//   new TreeItem(
		//       'BMW', [new TreeItem('320'), new TreeItem('X3'), new TreeItem('X5')])
		// ])];

		vscode.commands.registerCommand('identify-duplicates.openFile', item => this.openFile(item));
	}

	getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
		element.command = { command: 'identify-duplicates.openFile', title: 'title', arguments: [element] };

		console.log('!! element.collapsibleState', element.collapsibleState)
		if (element.children?.length) {
			if (element.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed) {
				element.iconPath = path.join(__filename, '..', '..', 'resources', 'icons', 'default_folder_opened.svg');
			} else {
				element.iconPath = path.join(__filename, '..', '..', 'resources', 'icons', 'default_folder.svg');
			}
		} else {
			let extension = path.extname(element.filePath).slice(1);
			if (extension === 'ts') {
				extension = 'typescript';
			}
			element.iconPath = path.join(__filename, '..', '..', 'resources', 'icons', `file_type_${extension}.svg`);
		}


		return element;
	}

	getChildren(element?: TreeItem | undefined): vscode.ProviderResult<TreeItem[]> {
		if (element === undefined) {
			return this.data;
		}
		return element.children;
	}

	public openFile(item: TreeItem) {
		if (item.filePath === undefined) return;
		// first we open the document
		vscode.workspace.openTextDocument(item.filePath).then(document => {
			// after opening the document, we set the cursor 
			// and here we make use of the line property which makes imo the code easier to read
			vscode.window.showTextDocument(document).then(editor => {
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
	readonly text: string;
	readonly row: number;
	readonly length: number;

	constructor(text: string, row: number) {
		this.text = text;
		this.length = text.length;
		this.row = row;
	}
}

export class TreeItem extends vscode.TreeItem {
	children: TreeItem[] | undefined;
	readonly filePath: string;
	readonly line: line;

	constructor(text: string, children: TreeItem[], row = 0, filePath = '') {
		super(
			text,
			children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded)

		this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
		this.children = children;
		this.filePath = filePath;
		this.line = new line(text, row);
	}
}
