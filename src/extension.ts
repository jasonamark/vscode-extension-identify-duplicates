"use strict";
import * as vscode from "vscode";
import { IdenticalObjectProvider } from "./identicalObjectProvider";
import { findIdenticalObjects } from "./findIdentialObjects";

export async function activate(context: vscode.ExtensionContext) {
  const duplicateObjectProvider = new IdenticalObjectProvider();
  const treeView = vscode.window.createTreeView("identicalObjects", {
    treeDataProvider: duplicateObjectProvider,
  });
  treeView.onDidExpandElement((e: any) => {
    duplicateObjectProvider.updateItemState(e.element);
  });
  treeView.onDidCollapseElement((e: any) => {
    duplicateObjectProvider.updateItemState(e.element);
  });
  vscode.window.registerTreeDataProvider(
    "identicalObjects",
    duplicateObjectProvider,
  );
  vscode.commands.registerCommand("identify-duplicates.refresh", () => {
    loadData();
  });

  loadData();

  async function loadData() {
    const currentWorkspace = vscode.workspace.workspaceFolders;
    let workspaceDirectory = "";
    if (context.extensionMode === vscode.ExtensionMode.Production) {
      if (currentWorkspace && currentWorkspace.length > 0) {
        workspaceDirectory = currentWorkspace[0].uri.fsPath;
      } else {
        vscode.window.showInformationMessage("No workspace folder is open");
        return;
      }
    }

    const rootDirectory =
      context.extensionMode === vscode.ExtensionMode.Development
        ? "/Users/jasonmark/Documents/REV/11Series"
        : workspaceDirectory;
    const excludedDirectories =
      "node_modules,report,static,assets,bower_components,dist,out,build,eject,package-lock.json,yarn.lock"
        .split(",")
        .map((str) => str.trim());

    const duplicateGroups = findIdenticalObjects(
      rootDirectory,
      excludedDirectories,
    );
    duplicateObjectProvider.loadData(duplicateGroups);
  }
}
