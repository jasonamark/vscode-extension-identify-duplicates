import * as vscode from "vscode";
import { findDuplicateGroupsByType } from "./findDuplicateGroupsByType";
import { join } from "path";
import { ExtensionContext, ExtensionMode, Uri, Webview } from "vscode";
import { ITreeObject } from "./sidebar/types";
import { readFile } from "fs/promises";

export class SidebarWebviewProvider implements vscode.WebviewViewProvider {
  private _webviewView?: vscode.WebviewView;
  private _rootDirectory: string;
  private _excludedDirectories: string[];
  private _excludedFiles: string[];

  constructor(private readonly _context: vscode.ExtensionContext) {
    this._rootDirectory = "";
    this._excludedDirectories = [];
    this._excludedFiles = [];
  }

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._context.extensionUri],
    };

    webviewView.webview.html = this.getWebviewContent(
      this._context,
      webviewView,
      "sidebar.js",
      "http://localhost:9000",
    );

    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.command === "openDocument") {
        this.openDocument(message.data);
      } else if (message.command === "fetchDuplicates") {
        this.setDirectories(message.data);
        this.fetchDuplicates();
      } else if (message.command === "fetchLocalization") {
        if (vscode.l10n.uri?.fsPath) {
          readFile(vscode.l10n.uri?.fsPath, "utf-8").then((localization) => {
            webviewView.webview.postMessage({
              command: message.command,
              localization,
            });
          });
        } else {
          webviewView.webview.postMessage({
            command: message.command,
            localization: undefined,
          });
        }
      }
    }, null);

    this._webviewView = webviewView;
  }

  fetchDuplicates() {
    const duplicateGroupsByType = findDuplicateGroupsByType(
      this._rootDirectory,
      this._excludedDirectories,
      this._excludedFiles,
    );

    this._webviewView?.webview.postMessage({ command: "fetchDuplicates", duplicateGroupsByType });
  }

  private setDirectories(data: {
    rootDirectory: string;
    excludedDirectories: string;
  }) {
    const currentWorkspace = vscode.workspace.workspaceFolders;
    const isDevelopment = process.env.NODE_ENV === "development";

    let workspaceDirectory = "";
    if (!isDevelopment) {
      if (currentWorkspace && currentWorkspace.length > 0) {
        workspaceDirectory = currentWorkspace[0].uri.fsPath;
      } else {
        vscode.window.showInformationMessage("No workspace folder is open");
        return;
      }
    }

    this._rootDirectory = isDevelopment
      ? data.rootDirectory
      : join(workspaceDirectory, data.rootDirectory);

    this._excludedDirectories =
      "node_modules,report,static,assets,bower_components,dist,out,build,eject"
        .split(",")
        .map((str) => str.trim())
        .concat(data.excludedDirectories.split(",").map((str) => str.trim()))
        .filter((str) => str !== "");

    this._excludedFiles = "package-lock.json,yarn.lock"
      .split(",")
      .map((str) => str.trim());
  }

  private openDocument(data: { treeObject: ITreeObject }) {
    // Open the document
    const item = data.treeObject;
    vscode.workspace.openTextDocument(item.filePath).then((document) => {
      // After opening the document, we set the cursor
      // and here we make use of the line property which makes imo the code easier to read
      vscode.window.showTextDocument(document).then((editor) => {
        let pos = new vscode.Position(item.line, item.character);
        // Set the cursor
        editor.selection = new vscode.Selection(pos, pos);
        // Here we set the focus of the opened editor
        editor.revealRange(new vscode.Range(pos, pos));
      });
    });
  }

  private getWebviewContent(
    context: ExtensionContext,
    webviewView: vscode.WebviewView,
    jsFile: string,
    localServerUrl: string,
  ) {
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
  }
}

const getNonce = () => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
