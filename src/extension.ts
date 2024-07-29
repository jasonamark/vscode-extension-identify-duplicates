'use strict';
import * as vscode from 'vscode';
import { DuplicateObjectProvider } from './duplicateObjectProvider';
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
	const excludedDirectories = ".git,node_modules,report,static,assets,bower_components,dist,out,build,eject,.next,.netlify,.yarn,.git,.vscode,package-lock.json,yarn.lock".split(",")
	.map((str) => str.trim());

	const duplicateGroups = findIdenticalObjects(
		rootDirectory,
		excludedDirectories,
	);

	console.log('!! 11111');

	const duplicateObjectProvider = new DuplicateObjectProvider(duplicateGroups);
	vscode.window.registerTreeDataProvider('duplicateObjects', duplicateObjectProvider);
}