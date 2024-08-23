"use strict";
import * as vscode from "vscode";
import { SidebarWebviewProvider } from "./sidebarWebviewProvider";

export async function activate(context: vscode.ExtensionContext) {
  const sidebarWebViewProvider = new SidebarWebviewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "identicalObjects",
      sidebarWebViewProvider,
    ),
  );

  vscode.commands.registerCommand("identify-duplicates.refresh", () => {
    sidebarWebViewProvider.fetchDuplicates();
  });
}
