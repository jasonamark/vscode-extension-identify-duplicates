import * as vscode from "vscode";
import * as path from "path";
import { IDuplicateGroup, ITreeObject } from "./findIdentialObjects";

export class IdenticalObjectProvider
  implements vscode.TreeDataProvider<TreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    TreeItem | undefined | void
  > = new vscode.EventEmitter<TreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | void> =
    this._onDidChangeTreeData.event;

  data: TreeItem[] = [];

  constructor() {
    vscode.commands.registerCommand("identify-duplicates.openFile", (item) =>
      this.openFile(item),
    );
  }

  initData(duplicateGroups: IDuplicateGroup[]) {
    const cssItems: TreeItem[] = [];
    const enumItems: TreeItem[] = [];
    const interfaceItems: TreeItem[] = [];
    const methodItems: TreeItem[] = [];
    this.data = [];
    duplicateGroups.map((group) => {
      const objectsWithSameDeclarations = group.duplicates.map(
        (treeObject: ITreeObject) => {
          return new TreeItem(
            treeObject.name,
            [],
            treeObject.filePath,
            treeObject.line,
            treeObject.character,
          );
        },
      );
      if (group.duplicates[0].objectType === "InterfaceDeclaration") {
        interfaceItems.push(
          new TreeItem(group.duplicates[0].name, objectsWithSameDeclarations),
        );
      } else if (group.duplicates[0].objectType === "EnumDeclaration") {
        enumItems.push(
          new TreeItem(group.duplicates[0].name, objectsWithSameDeclarations),
        );
      } else if (group.duplicates[0].objectType === "CssRule") {
        cssItems.push(
          new TreeItem(group.duplicates[0].name, objectsWithSameDeclarations),
        );
      } else if (group.duplicates[0].objectType === "MethodDeclaration") {
        methodItems.push(
          new TreeItem(group.duplicates[0].name, objectsWithSameDeclarations),
        );
      }
    });
    if (cssItems.length) {
      this.data.push(new TreeItem("css", cssItems));
    }
    if (enumItems.length) {
      this.data.push(new TreeItem("enum", enumItems));
    }
    if (interfaceItems.length) {
      this.data.push(new TreeItem("interface", interfaceItems));
    }
    if (interfaceItems.length) {
      this.data.push(new TreeItem("method", methodItems));
    }
    if (this.data.length === 0) {
      this.data.push(new TreeItem("No Identical Objects Found", []));
    }
  }

  getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    element.command = {
      command: "identify-duplicates.openFile",
      title: "title",
      arguments: [element],
    };

    if (element.children?.length) {
      if (
        element.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed
      ) {
        element.iconPath = path.join(
          __filename,
          "..",
          "..",
          "resources",
          "icons",
          "default_folder.svg",
        );
      } else {
        element.iconPath = path.join(
          __filename,
          "..",
          "..",
          "resources",
          "icons",
          "default_folder_opened.svg",
        );
      }
    } else {
      let extension = path.extname(element.filePath).slice(1);
      if (extension === "ts" || extension === "tsx") {
        extension = "typescript";
      } else if (extension === "js" || extension === "jsx") {
        extension = "js";
      }
      element.iconPath = path.join(
        __filename,
        "..",
        "..",
        "resources",
        "icons",
        `file_type_${extension}.svg`,
      );
    }

    return element;
  }

  getChildren(
    element?: TreeItem | undefined,
  ): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }

  loadData(duplicateGroups: IDuplicateGroup[]): void {
    this.initData(duplicateGroups);
    this.refresh();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  updateItemState(item: TreeItem): void {
    // Hack to get the tree to refresh
    item.label += " ";
    item.collapsibleState =
      item.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.Collapsed;
    this.refresh();
  }

  openFile(item: TreeItem) {
    if (item.filePath === undefined) {
      return;
    }
    if (item.children?.length) {
      // Update the folder state
      this.updateItemState(item);
      return;
    }
    // Open the document
    vscode.workspace.openTextDocument(item.filePath).then((document) => {
      // After opening the document, we set the cursor
      // and here we make use of the line property which makes imo the code easier to read
      vscode.window.showTextDocument(document).then((editor) => {
        let pos = new vscode.Position(
          item.codePosition.line,
          item.codePosition.character,
        );
        // Set the cursor
        editor.selection = new vscode.Selection(pos, pos);
        // Here we set the focus of the opened editor
        editor.revealRange(new vscode.Range(pos, pos));
      });
    });
  }
}

class CodePosition {
  readonly line: number;
  readonly character: number;

  constructor(line: number, character: number) {
    this.line = line;
    this.character = character;
  }
}

export class TreeItem extends vscode.TreeItem {
  children: TreeItem[] | undefined;
  readonly filePath: string;
  readonly codePosition: CodePosition;

  constructor(
    text: string,
    children: TreeItem[],
    filePath = "",
    line = 0,
    character = 0,
  ) {
    const collapsibleState =
      children.length === 0
        ? vscode.TreeItemCollapsibleState.None
        : vscode.TreeItemCollapsibleState.Collapsed;
    super(text, collapsibleState);

    this.children = children;
    this.filePath = filePath;
    this.codePosition = new CodePosition(line, character);
  }
}
