"use strict";
import * as vscode from "vscode";
import { IdenticalObjectProvider } from "./identicalObjectProvider";
import { findDuplicateGroupsByType } from "./findDuplicateGroupsByType";
import { join } from "path";
import { ExtensionContext, ExtensionMode, Uri, Webview } from "vscode";

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "identicalObjects",
      new SidebarWebviewProvider(context),
    ),
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
  constructor(private readonly _context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._context.extensionUri],
    };

    webviewView.webview.html = getWebviewContent(
      this._context,
      webviewView,
      "sidebar.js",
      "http://localhost:9000",
    );

    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.command === "fetchDuplicates") {
        const currentWorkspace = vscode.workspace.workspaceFolders;
        const isDevelopment = process.env.NODE_ENV === "development";

        let workspaceDirectory = "";
        if (!isDevelopment) {
          if (currentWorkspace && currentWorkspace.length > 0) {
            workspaceDirectory = currentWorkspace[0].uri.fsPath;
          } else {
            webviewView.webview.postMessage({ chartData: { name: "" } });
            vscode.window.showInformationMessage("No workspace folder is open");
            return;
          }
        }

        const rootDirectory = isDevelopment
          ? message.data.rootDirectory
          : join(workspaceDirectory, message.data.rootDirectory);
        let excludedDirectoriesString =
          (message.data.excludedDirectories as string) || "";
        const additionalDirectories =
          "node_modules,report,static,assets,bower_components,dist,out,build,eject,package-lock.json,yarn.lock";
        if (excludedDirectoriesString.length) {
          excludedDirectoriesString = `${excludedDirectoriesString},${additionalDirectories}`;
        } else {
          excludedDirectoriesString = additionalDirectories;
        }
        const excludedDirectories = excludedDirectoriesString
          .split(",")
          .map((str) => str.trim());

        const duplicateGroupsByType = findDuplicateGroupsByType(
          rootDirectory,
          excludedDirectories,
        );

        webviewView.webview.postMessage({ duplicateGroupsByType });
      }
    }, null);
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
	<body style="padding: 0;">
		<div id="root"></div>
		<script nonce="${nonce}" src="${scriptUrl}"></script>
	</body>
	</html>`;
};
