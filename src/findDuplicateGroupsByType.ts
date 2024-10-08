import { shouldExcludeFile, shouldExcludeFolder } from "./shouldExclude";
import * as fs from "fs";
import * as ts from "typescript";
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

export interface IDuplicateGroupsByType {
  css: IDuplicateGroup[];
  enum: IDuplicateGroup[];
  interface: IDuplicateGroup[];
  method: IDuplicateGroup[];
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

export const findDuplicateGroupsByType = (
  rootDirectory: string,
  excludedFolders: string[],
  excludedFiles: string[],
): IDuplicateGroupsByType => {
  const fileTypes = [".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".less"];
  const files = getFilesRecursively(
    rootDirectory,
    excludedFolders,
    excludedFiles,
    fileTypes,
  );
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

  const duplicateGroups = getDuplicateGroups(allParsedObjects);
  const duplicateGroupsByType = getDuplicateGroupsByType(duplicateGroups);
  return duplicateGroupsByType;
};

/** Returns a list of files */
const getFilesRecursively = (
  directory: string,
  excludedFolders: string[] = [],
  excludedFiles: string[] = [],
  fileTypes: string[],
): string[] => {
  let results: string[] = [];
  try {
    const list = fs.readdirSync(directory);
    list.forEach((filePath) => {
      filePath = path.join(directory, filePath);
      try {
        const stat = fs.statSync(filePath);
        if (
          stat?.isDirectory() &&
          !shouldExcludeFolder(filePath, excludedFolders)
        ) {
          results = results.concat(
            getFilesRecursively(
              filePath,
              excludedFolders,
              excludedFiles,
              fileTypes,
            ),
          );
        } else if (
          stat?.isFile() &&
          fileTypes.some((type) => filePath.endsWith(type)) &&
          !shouldExcludeFile(filePath, excludedFiles)
        ) {
          results.push(filePath);
        }
      } catch (e) {
        console.log("There was an error using statSync on", filePath, e);
      }
    });
  } catch (e) {
    console.log("There was an error using readdirSync on", directory, e);
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
      node.members.map((member, index) => {
        let assignedValue: string | number | undefined;

        if (member.initializer) {
          // Get the text of the initializer if it exists
          assignedValue = member.initializer.getText();
        } else if (index === 0) {
          // If the first member does not have an initializer, it is implicitly assigned to 0
          assignedValue = 0;
        } else {
          // If a subsequent member does not have an initializer, it is assigned one more than the previous member
          const previousMember = node.members[index - 1];
          if (previousMember.initializer) {
            const prevValue = eval(previousMember.initializer.getText()); // Not recommended for untrusted code!
            assignedValue =
              typeof prevValue === "number" ? prevValue + 1 : undefined;
          } else {
            assignedValue = index;
          }
        }

        properties = properties.concat(
          `name: ${member.name?.getText() ?? ""} assignedValue: ${assignedValue}`,
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
        // Exclude empty bodies { }
        properties =
          node.body && node.body.getText().length > 4
            ? node.body.getText()
            : "";
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

const getDuplicateGroupsByType = (
  duplicateGroups: IDuplicateGroup[],
): IDuplicateGroupsByType => {
  const duplicateGroupsByType: IDuplicateGroupsByType = {
    css: [],
    enum: [],
    interface: [],
    method: [],
  };

  duplicateGroups.map((group) => {
    if (group.duplicates[0].objectType === "InterfaceDeclaration") {
      duplicateGroupsByType.interface.push(group);
    } else if (group.duplicates[0].objectType === "EnumDeclaration") {
      duplicateGroupsByType.enum.push(group);
    } else if (group.duplicates[0].objectType === "CssRule") {
      duplicateGroupsByType.css.push(group);
    } else if (group.duplicates[0].objectType === "MethodDeclaration") {
      duplicateGroupsByType.method.push(group);
    }
  });

  return duplicateGroupsByType;
};
