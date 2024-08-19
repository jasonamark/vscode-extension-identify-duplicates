/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/extension.ts":
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
const path_1 = __webpack_require__(/*! path */ "path");
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
async function activate(context) {
    console.log('!! activate context.extensionUri', context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("identicalObjects", new SidebarWebviewProvider(context)));
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
class SidebarWebviewProvider {
    constructor(_context) {
        this._context = _context;
    }
    resolveWebviewView(webviewView, context) {
        this._view = webviewView;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [
                this._context.extensionUri
            ]
        };
        webviewView.webview.html = getWebviewContent(this._context, webviewView, "sidebar.js", "http://localhost:9000");
    }
}
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
const getWebviewContent = (context, webviewView, jsFile, localServerUrl) => {
    let scriptUrl = null;
    let cssUrl = null;
    const isProduction = context.extensionMode === vscode_1.ExtensionMode.Production;
    if (isProduction) {
        scriptUrl = webviewView.webview
            .asWebviewUri(vscode_1.Uri.file((0, path_1.join)(context.extensionPath, "dist", jsFile)))
            .toString();
    }
    else {
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


/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/extension.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map