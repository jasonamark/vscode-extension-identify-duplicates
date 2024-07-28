'use strict';
import * as vscode from 'vscode';
import { DuplicateObjectProvider } from './duplicateObjectProvider';
import { processDirectory } from './processDirectory';

export async function activate(context: vscode.ExtensionContext) {
	const currentWorkspace = vscode.workspace.workspaceFolders;
	const isDevelopment = process.env.NODE_ENV === "development";

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

	// const chartData = await processDirectory(
	// 	rootDirectory,
	// 	excludedDirectories,
	// );

	const duplicateObjectProvider = new DuplicateObjectProvider(rootDirectory);
	vscode.window.registerTreeDataProvider('duplicateObjects', duplicateObjectProvider);
}