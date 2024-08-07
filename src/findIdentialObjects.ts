import { shouldExcludeFolder } from "./shouldExcludeFolder";
import * as fs from "fs";
import * as ts from "typescript";
import { exec as execCb } from "child_process";
import { promisify } from "util";
const exec = promisify(execCb);
import * as path from "path";
const css = require("css");

export interface IParsedObject {
  filePath: string;
  line: number;
  character: number;
  objectType: string;
  name: string;
  properties: string;
}

export interface ITreeObject {
  filePath: string;
  line: number;
  character: number;
  objectType: string;
  name: string;
}

export interface IDuplicateGroup {
  duplicates: ITreeObject[];
}

const lifecycleMethods = new Set([
  // React lifecycle methods
  "constructor",
  "componentDidMount",
  "componentDidUpdate",
  "componentWillUnmount",
  "render",
  "shouldComponentUpdate",
  "getDerivedStateFromProps",
  "getSnapshotBeforeUpdate",
  "componentDidCatch",
  // Angular lifecycle hooks
  "ngOnInit",
  "ngOnChanges",
  "ngDoCheck",
  "ngAfterContentInit",
  "ngAfterContentChecked",
  "ngAfterViewInit",
  "ngAfterViewChecked",
  "ngOnDestroy",
]);

export const findIdenticalObjects = (
  rootDirectory: string,
  excludedFolders: string[] = [],
): IDuplicateGroup[] => {
  const fileTypes = [".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".less"];
  const files = getFilesRecursively(rootDirectory, excludedFolders, fileTypes);
  let allParsedObjects: IParsedObject[] = [];

  files.forEach((filePath) => {
    if (
      filePath.endsWith(".css") ||
      filePath.endsWith(".scss") ||
      filePath.endsWith(".less")
    ) {
      allParsedObjects = allParsedObjects.concat(parseCSS(filePath));
    } else {
      allParsedObjects = allParsedObjects.concat(parseJSOrTS(filePath));
    }
  });

  return getDuplicateGroups(allParsedObjects);
};

/** Returns a list of files */
const getFilesRecursively = (
  directory: string,
  excludedFolders: string[] = [],
  fileTypes: string[],
): string[] => {
  let results: string[] = [];
  try {
    const list = fs.readdirSync(directory);
    list.forEach((filePath) => {
      filePath = path.join(directory, filePath);
      if (shouldExcludeFolder(filePath, excludedFolders)) {
        return;
      }
  
      try {
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
          results = results.concat(
            getFilesRecursively(filePath, excludedFolders, fileTypes),
          );
        } else if (fileTypes.some((type) => filePath.endsWith(type))) {
          results.push(filePath);
        }
      } catch (e) {
        // console.log('There was an error using statSync on', filePath);
      }
    });
  } catch (e) {
    // console.log('There was an error using readdirSync on', directory);
  }
  
  return results;
};

const readFile = (filePath: string): string => {
  return fs.readFileSync(filePath, "utf-8");
};

const parseCSS = (filePath: string): IParsedObject[] => {
  const content = readFile(filePath);
  const parsedObjects: IParsedObject[] = [];

  try {
    const parsed = css.parse(content, { source: filePath });
    const rules = parsed.stylesheet?.rules || [];
    rules.forEach((rule: any) => {
      if (rule.type === "rule" && rule.selectors && rule.declarations) {
        const name = rule.selectors.join(", ");
        const properties = rule.declarations
          .filter((d: any) => d.type === "declaration")
          .map((d: any) => `${d.property}: ${d.value}`)
          .sort()
          .join("; ");

        const start = rule.position?.start || { line: 0, column: 0 };
        parsedObjects.push({
          filePath,
          line: start.line - 1,
          character: name.length + 2,
          objectType: "CssRule",
          name,
          properties,
        });
      }
    });
  } catch (e) {
    // console.log('parseCSS error: ', e)
  }
  return parsedObjects;
};

const parseJSOrTS = (filePath: string): IParsedObject[] => {
  const content = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  const parsedObjects: IParsedObject[] = [];

  const visit = (node: ts.Node) => {
    let name = "";
    let properties = "";
    if (ts.isEnumDeclaration(node)) {
      name = node.name?.getText();
      node.members.map((member: any) => {
        properties = properties.concat(
          `name: ${member.name?.getText() ?? ""} kind: ${member.kind}`,
        );
      });
    }
    if (ts.isInterfaceDeclaration(node)) {
      name = node.name?.getText();
      node.members.map((member: any) => {
        properties = properties.concat(
          `name: ${member.name?.getText() ?? ""} type: ${member.type.getText() ?? ""}`,
        );
      });
    }
    if (ts.isMethodDeclaration(node)) {
      name = node.name?.getText();
      if (!lifecycleMethods.has(name)) {
        properties = node.body ? node.body.getText() : "";
      }
    }

    if (name.length && properties.length) {
      const bodyStart = getObjectBodyStart(node, sourceFile);
      const { character, line } =
        sourceFile.getLineAndCharacterOfPosition(bodyStart);
      parsedObjects.push({
        filePath,
        line: line,
        character: character,
        objectType: ts.SyntaxKind[node.kind],
        name,
        properties,
      });
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return parsedObjects;
};

const getObjectBodyStart = (
  node: ts.Node,
  sourceFile: ts.SourceFile,
): number => {
  if (
    ts.isMethodDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isEnumDeclaration(node)
  ) {
    // Find the position of the opening curly brace
    const nodeText = node.getText(sourceFile);
    const openBraceIndex = nodeText.indexOf("{");
    if (openBraceIndex !== -1) {
      return node.getStart(sourceFile) + openBraceIndex + 1; // +1 to get inside the braces
    }
  }
  return node.getStart(sourceFile);
};

const getDuplicateGroups = (
  parsedObjects: IParsedObject[],
): IDuplicateGroup[] => {
  const duplicateGroups: IDuplicateGroup[] = [];
  const propertyMap: Map<string, IParsedObject[]> = new Map();

  parsedObjects.forEach((obj) => {
    if (!propertyMap.has(obj.properties)) {
      propertyMap.set(obj.properties, []);
    }
    propertyMap.get(obj.properties)!.push(obj);
  });

  propertyMap.forEach((objects) => {
    if (objects.length > 1) {
      const duplicates: ITreeObject[] = [];
      objects.forEach((obj) => {
        duplicates.push({
          filePath: obj.filePath,
          line: obj.line,
          character: obj.character,
          objectType: obj.objectType,
          name: obj.name,
        });
      });
      duplicateGroups.push({ duplicates });
    }
  });

  return duplicateGroups;
};
