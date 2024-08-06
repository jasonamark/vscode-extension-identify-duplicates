import * as fs from "fs";
import * as path from "path";

/**
 * Determines if the given path is a file or a folder and returns the file extension if it's a file.
 * @param filePath - The path to check.
 * @returns A promise that resolves to an object containing the type and the file extension (if applicable).
 */
export async function determinePathType(
  filePath: string,
): Promise<{ type: "file" | "folder" | "unknown"; extension?: string }> {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        if (err.code === "ENOENT") {
          resolve({ type: "unknown" });
        } else {
          reject(err);
        }
        return;
      }
      if (stats.isFile()) {
        const extension = path.extname(filePath);
        resolve({ type: "file", extension });
      } else if (stats.isDirectory()) {
        resolve({ type: "folder" });
      } else {
        resolve({ type: "unknown" });
      }
    });
  });
}
