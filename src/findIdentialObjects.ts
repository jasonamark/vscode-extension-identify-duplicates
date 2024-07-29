import { shouldExcludeFolder } from "./shouldExcludeFolder";
import * as fs from "fs";
import * as ts from 'typescript';
import { exec as execCb } from "child_process";
import { promisify } from "util";
const exec = promisify(execCb);
import * as path from 'path';
const css = require('css');

export interface IParsedObject {
  filePath: string;
  lineNumber: number;
  objectType: string;
  name: string;
  properties: string;
}

export interface ITreeObject {
  filePath: string;
  lineNumber: number;
  objectType: string;
  name: string;
  start: number;
}

export interface IDuplicateGroup {
  duplicates: ITreeObject[]
}

export const findIdenticalObjects = (rootDirectory: string, excludedFolders: string[] = []): IDuplicateGroup[] => {
  const fileTypes = ['.ts']; // ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.less'];
  const files = getFilesRecursively(rootDirectory, excludedFolders, fileTypes);
  let allParsedObjects: IParsedObject[] = [];

  files.forEach((filePath) => {
    if (filePath.endsWith('.css') || filePath.endsWith('.scss') || filePath.endsWith('.less')) {
      allParsedObjects = allParsedObjects.concat(parseCSS(filePath));
    } 
		else {
      allParsedObjects = allParsedObjects.concat(parseJSOrTS(filePath));
    }
  });

  return getDuplicateGroups(allParsedObjects);
};

/** Returns a list of files */
const getFilesRecursively = (directory: string, excludedFolders: string[] = [], fileTypes: string[]): string[] => {
  let results: string[] = [];
  const list = fs.readdirSync(directory);
  list.forEach((filePath) => {
    filePath = path.join(directory, filePath);
    if (shouldExcludeFolder(filePath, excludedFolders)) {
      return;
    }

    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath, excludedFolders, fileTypes));
    } else if (fileTypes.some((type) => filePath.endsWith(type))) {
      results.push(filePath);
    }
  });

  return results;
};

const readFile = (filePath: string): string => {
  return fs.readFileSync(filePath, 'utf-8');
};

const parseCSS = (filePath: string): IParsedObject[] => {
  const content = readFile(filePath);
  const parsedObjects: IParsedObject[] = [];

  try {
    const parsed = css.parse(content, { source: filePath });
    const rules = parsed.stylesheet?.rules || [];
    rules.forEach((rule: any) => {
      if (rule.type === 'rule' && rule.selectors && rule.declarations) {
        const name = rule.selectors.join(', ');
        const properties = rule.declarations
          .filter((d: any) => d.type === 'declaration')
          .map((d: any) => `${d.property}: ${d.value}`)
          .sort()
          .join('; ');

        const start = rule.position?.start || { line: 0, column: 0 };
        parsedObjects.push({
          filePath,
          lineNumber: start.line - 1,
          objectType: 'CSS Rule',
          name,
          properties,
        });
      }
    });
  } catch (e) {
    console.log('parseCSS error: ', e)
  }
  return parsedObjects;
};

const parseJSOrTS = (filePath: string): IParsedObject[] => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
  const parsedObjects: IParsedObject[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node)) {
      let name = node.name.getText()
      let properties = '';
      node.members.map((member: any) => {
        properties = properties.concat(`name: ${member.name?.getText() ?? ''} type: ${member.type.getText() ?? ''} `)
      });
    
      // }

      // if (ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isEnumDeclaration(node) || ts.isVariableStatement(node)) {
      //   const name = (node as any).name ? (node as any).name.text : ((node as any).declarationList.declarations[0] as any).name.text;
      //   const properties: string = '';
        
      //   if (ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node)) {
      //     node.members.forEach(member => {
      //       if (ts.isPropertyDeclaration(member) || ts.isPropertySignature(member) || ts.isMethodDeclaration(member)) {
      //         properties.concat(member.name.getText());
      //       }
      //     });
      //   } else if (ts.isEnumDeclaration(node)) {
      //     node.members.forEach(member => {
      //       properties.concat(member.name.getText());
      //     });
      //   } else if (ts.isVariableStatement(node)) {
      //     node.declarationList.declarations.forEach(declaration => {
      //       if (declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer)) {
      //         declaration.initializer.properties.forEach(property => {
      //           if (ts.isPropertyAssignment(property)) {
      //             properties.concat(property.name.getText());
      //           }
      //         });
      //       }
      //     });
      //   }

      const { line,  } = sourceFile.getLineAndCharacterOfPosition(node.getStart());

      parsedObjects.push({
        filePath,
        lineNumber: line,
        objectType: ts.SyntaxKind[node.kind],
        name,
        properties
      });
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return parsedObjects;
};

const getDuplicateGroups = (parsedObjects: IParsedObject[]): IDuplicateGroup[] => {
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
          lineNumber: obj.lineNumber,
          objectType: obj.objectType,
          name: obj.name,
          start: obj.lineNumber,
        });
      });
      duplicateGroups.push({ duplicates })
    }
  });

  return duplicateGroups;
};