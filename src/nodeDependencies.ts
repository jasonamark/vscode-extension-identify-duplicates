import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class DepNodeProvider implements vscode.TreeDataProvider<TreeItem> {

	// private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
	// readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;

	onDidChangeTreeData?: vscode.Event<TreeItem|null|undefined>|undefined;

	data: TreeItem[];

	constructor(private workspaceRoot: string | undefined) {
		this.data = [new TreeItem('cars', [
      new TreeItem(
          'Ford', [new TreeItem('Fiesta'), new TreeItem('Focus'), new TreeItem('Mustang')]),
      new TreeItem(
          'BMW', [new TreeItem('320'), new TreeItem('X3'), new TreeItem('X5')])
    ])];
	}

	// refresh(): void {
	// 	this._onDidChangeTreeData.fire();
	// }

	getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: TreeItem|undefined): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }

	// getTreeItem(element: Dependency): vscode.TreeItem {
	// 	return element;
	// }

	// getChildren(element?: Dependency): Thenable<Dependency[]> {
	// 	if (!this.workspaceRoot) {
	// 		vscode.window.showInformationMessage('No dependency in empty workspace');
	// 		return Promise.resolve([]);
	// 	}

	// 	if (element) {
	// 		return Promise.resolve(this.getDepsInPackageJson(path.join('/Users/jasonmark/Documents/LEX/lobo', 'node_modules', element.label, 'package.json')));
	// 		// return Promise.resolve(this.getDepsInPackageJson(path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')));
	// 	} else {
	// 		const packageJsonPath = path.join('/Users/jasonmark/Documents/LEX/lobo', 'package.json'); // path.join(this.workspaceRoot, 'package.json');
	// 		if (this.pathExists(packageJsonPath)) {
	// 			return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
	// 		} else {
	// 			vscode.window.showInformationMessage('Workspace has no package.json');
	// 			return Promise.resolve([]);
	// 		}
	// 	}
	}

	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */
// 	private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
// 		const workspaceRoot = '/Users/jasonmark/Documents/LEX/lobo'; // this.workspaceRoot;
// 		if (this.pathExists(packageJsonPath) && workspaceRoot) {
// 			const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// 			const toDep = (moduleName: string, version: string): Dependency => {
// 				if (this.pathExists(path.join(workspaceRoot, 'node_modules', moduleName))) {
// 					return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.Collapsed);
// 				} else {
// 					return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None, {
// 						command: 'extension.openPackageOnNpm',
// 						title: '',
// 						arguments: [moduleName]
// 					});
// 				}
// 			};

// 			const deps = packageJson.dependencies
// 				? Object.keys(packageJson.dependencies).map(dep => toDep(dep, packageJson.dependencies[dep]))
// 				: [];
// 			const devDeps = packageJson.devDependencies
// 				? Object.keys(packageJson.devDependencies).map(dep => toDep(dep, packageJson.devDependencies[dep]))
// 				: [];

// 			console.log('!! deps', deps);

// 			return deps.concat(devDeps);
// 		} else {
// 			return [];
// 		}
// 	}

// 	private pathExists(p: string): boolean {
// 		try {
// 			fs.accessSync(p);
// 		} catch (err) {
// 			return false;
// 		}

// 		return true;
// 	}
// }

// export class Dependency extends vscode.TreeItem {

// 	constructor(
// 		public readonly label: string,
// 		private readonly version: string,
// 		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
// 		public readonly command?: vscode.Command
// 	) {
// 		super(label, collapsibleState);

// 		this.tooltip = `${this.label}-${this.version}`;
// 		this.description = this.version;
// 	}

// 	iconPath = {
// 		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
// 		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
// 	};

// 	contextValue = 'dependency';
// }

export class TreeItem extends vscode.TreeItem {
  children: TreeItem[]|undefined;

  constructor(label: string, children?: TreeItem[]) {
    super(
        label,
        children === undefined ? vscode.TreeItemCollapsibleState.None :
                                 vscode.TreeItemCollapsibleState.Expanded);
    this.children = children;
  }
}