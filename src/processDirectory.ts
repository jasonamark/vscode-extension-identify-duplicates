import { shouldExcludeFolder } from "./shouldExcludeFolder";
import * as fs from "fs";
import * as nodePath from "path";
import { exec as execCb } from "child_process";
import { promisify } from "util";
const exec = promisify(execCb);

export interface IFileStat {
  name: string;
  path: string;
  value: number;
}

export const processDirectory = async (
  rootDirectory: string,
  excludedFolders: string[] = [],
) => {
  const getFileStats = async (path = "") => {
    const stats = await fs.statSync(`./${path}`);
    const name = path.split("/").filter(Boolean).slice(-1)[0];
    const size = stats.size;
    const relativePath = path.slice(rootDirectory.length + 1);
    return {
      name,
      path: relativePath,
      value: size,
    };
  };

  const addItemToTree = async (path = "", isFolder = true) => {
    try {
      if (isFolder) {
        const filesOrFolders = await fs.readdirSync(`./${path}`);
        const children: IFileStat[] = [];

        for (const fileOrFolder of filesOrFolders) {
          const fullPath = nodePath.join(path, fileOrFolder);
          if (shouldExcludeFolder(fullPath, excludedFolders)) {
            continue;
          }

          const info = fs.statSync(`./${fullPath}`);
          const stats = await addItemToTree(fullPath, info.isDirectory());
          if (stats) children.push(stats);
        }

        const stats = await getFileStats(path);
        return { ...stats, children };
      }

      if (shouldExcludeFolder(path, excludedFolders)) {
        return null;
      }
      const stats = getFileStats(path);
      return stats;
    } catch (e) {
      console.log("Issue trying to read file", path, e);
      return null;
    }
  };

  const tree = await addItemToTree(rootDirectory);

  return tree;
};