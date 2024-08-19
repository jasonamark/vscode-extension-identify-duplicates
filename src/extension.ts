"use strict";
import * as vscode from "vscode";
import { IdenticalObjectProvider } from "./identicalObjectProvider";
import { findIdenticalObjects } from "./findIdentialObjects";
import { join } from "path";
import { ExtensionContext, ExtensionMode, Uri, Webview } from "vscode";

export async function activate(context: vscode.ExtensionContext) {
  console.log('!! activate context.extensionUri', context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("identicalObjects", new SidebarWebviewProvider(context))
  );

  // const duplicateObjectProvider = new IdenticalObjectProvider();
  // const treeView = vscode.window.createTreeView("identicalObjects", {
  //   treeDataProvider: duplicateObjectProvider,
  // });
  // treeView.onDidExpandElement((e: any) => {
  //   duplicateObjectProvider.updateItemState(e.element);
  // });
  // treeView.onDidCollapseElement((e: any) => {
  //   duplicateObjectProvider.updateItemState(e.element);
  // });
  // vscode.window.registerTreeDataProvider(
  //   "identicalObjects",
  //   duplicateObjectProvider,
  // );
  // vscode.commands.registerCommand("identify-duplicates.refresh", () => {
  //   loadData();
  // });

  // loadData();

  // async function loadData() {
  //   const currentWorkspace = vscode.workspace.workspaceFolders;
  //   let workspaceDirectory = "";
  //   if (context.extensionMode === vscode.ExtensionMode.Production) {
  //     if (currentWorkspace && currentWorkspace.length > 0) {
  //       workspaceDirectory = currentWorkspace[0].uri.fsPath;
  //     } else {
  //       vscode.window.showInformationMessage("No workspace folder is open");
  //       return;
  //     }
  //   }

  //   const rootDirectory =
  //     context.extensionMode === vscode.ExtensionMode.Development
  //       ? "/Users/jasonmark/Documents/REV/11Series"
  //       : workspaceDirectory;
  //   const excludedDirectories =
  //     "node_modules,report,static,assets,bower_components,dist,out,build,eject,package-lock.json,yarn.lock"
  //       .split(",")
  //       .map((str) => str.trim());

  //   const duplicateGroups = findIdenticalObjects(
  //     rootDirectory,
  //     excludedDirectories,
  //   );
  //   duplicateObjectProvider.loadData(duplicateGroups);
  // }
}

class SidebarWebviewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly _context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._context.extensionUri
			]
		};

		webviewView.webview.html = getWebviewContent(this._context, webviewView, "sidebar.js",
        "http://localhost:9000",);
  }

  // private getHtmlForWebview(webview: vscode.Webview): string {
  //   // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
	// 	// const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

	// 	// Do the same for the stylesheet.
	// 	// const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
	// 	// const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
	// 	// const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

	// 	// Use a nonce to only allow a specific script to be run.
	// 	const nonce = getNonce();

  //   /*
  //   <link href="${styleResetUri}" rel="stylesheet">
  //   <link href="${styleVSCodeUri}" rel="stylesheet">
  //   <link href="${styleMainUri}" rel="stylesheet">
  //   */

	// 	return `<!DOCTYPE html>
	// 		<html lang="en">
	// 		<head>
	// 			<meta charset="UTF-8">

	// 			<!--
	// 				Use a content security policy to only allow loading styles from our extension directory,
	// 				and only allow scripts that have a specific nonce.
	// 				(See the 'webview-sample' extension sample for img-src content security policy examples)
	// 			-->
	// 			<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

	// 			<meta name="viewport" content="width=device-width, initial-scale=1.0">

	// 			<title>Cat Colors</title>
	// 		</head>
	// 		<body>
	// 			<ul class="color-list">
	// 			</ul>

	// 			<button class="add-color-button">Add Color</button>

	// 		</body>
	// 		</html>`;
  // }
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

const getWebviewContent = (
  context: ExtensionContext,
  webviewView: vscode.WebviewView,
  jsFile: string,
  localServerUrl: string,
) => {
  let scriptUrl = null;
  let cssUrl = null;

  const isProduction = context.extensionMode === ExtensionMode.Production;
  if (isProduction) {
    scriptUrl = webviewView.webview
      .asWebviewUri(Uri.file(join(context.extensionPath, "dist", jsFile)))
      .toString();
  } else {
    scriptUrl = `${localServerUrl}/${jsFile}`;
  }

  // Use a nonce to whitelist which scripts can be run
  const nonce = getNonce();

  return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		${isProduction ? `<link href="${cssUrl}" rel="stylesheet">` : ""}
	</head>
	<body>
		<div id="root"></div>
		<script nonce="${nonce}" src="${scriptUrl}"></script>
	</body>
	</html>`;
};
