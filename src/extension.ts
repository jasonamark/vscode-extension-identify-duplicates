'use strict';
import * as vscode from 'vscode';
import { IdenticalObjectProvider } from './identicalObjectProvider';
import { findIdenticalObjects } from './findIdentialObjects';

export async function activate(context: vscode.ExtensionContext) {
	const currentWorkspace = vscode.workspace.workspaceFolders;
	const isDevelopment = true;

	let workspaceDirectory = "";
	if (!isDevelopment) {
		if (currentWorkspace && currentWorkspace.length > 0) {
			workspaceDirectory = currentWorkspace[0].uri.fsPath;
		} else {
			vscode.window.showInformationMessage(
				"No workspace folder is open",
			);
			return;
		}
	}

	const rootDirectory = isDevelopment ? '/Users/jasonmark/Documents/REV/11Series' : workspaceDirectory;
	const excludedDirectories = "node_modules,report,static,assets,bower_components,dist,out,build,eject,package-lock.json,yarn.lock".split(",")
	.map((str) => str.trim());

	const duplicateGroups = findIdenticalObjects(
		rootDirectory,
		excludedDirectories,
	);

	const duplicateObjectProvider = new IdenticalObjectProvider(duplicateGroups);
	vscode.window.registerTreeDataProvider('identicalObjects', duplicateObjectProvider);
	vscode.commands.registerCommand('identify-duplicates.refresh', () => duplicateObjectProvider.refresh());
	const treeView = vscode.window.createTreeView('identicalObjects', { treeDataProvider: duplicateObjectProvider });
	treeView.onDidExpandElement(e => {
		duplicateObjectProvider.updateItemState(e.element)
	});
	treeView.onDidCollapseElement(e => {
		duplicateObjectProvider.updateItemState(e.element)
	});
}