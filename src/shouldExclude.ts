import path = require("path");

/**
 * Utility function to determine if a folder path should be excluded.
 * @param folderPath - The folder path to check.
 * @param excludePatterns - An array of folder expressions to exclude. These can be regex patterns.
 * @returns True if the folder path should be excluded, otherwise false.
 *
 * Example usage:
 * const folderPath = './src/test/helpers/components';
 * const excludePatterns = ['.*helpers.*', '.*folder.*'];
 *
 * console.log(shouldExcludeFolder(folderPath, excludePatterns)); // Output: true
 */
export function shouldExcludeFolder(
  folderPath: string,
  excludePatterns: string[],
): boolean {
  return excludePatterns.some((pattern) => {
    const lastSegment = path.basename(folderPath);
    if (lastSegment.startsWith(".")) {
      return true;
    }

    // Check if the pattern is a regular expression by looking for regex characters
    const isRegex = pattern.includes("*");

    if (isRegex) {
      const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
      const regexPattern = escapedPattern.replace(/\\\*/g, '.*'); // Convert '*' to '.*' (matches any character sequence)
      const regex = new RegExp(`^${regexPattern}$`);
      const match = regex.test(folderPath);
      return match;
    } else {
      // Split folder path into segments and check for exact match
      const segments = folderPath.split("/");
      const match = segments.includes(pattern);
      return match;
    }
  });
}

/**
 * Utility function to determine if a file should be excluded.
 * @param filePath - The file path to check.
 * @param excludePatterns - An array of file expressions to exclude. These can be regex patterns.
 * @returns True if the file path should be excluded, otherwise false.
 *
 * Example usage:
 * const filePath = './src/test/helpers/components';
 * const excludePatterns = ['.*helpers.*', '.*file.*'];
 *
 * console.log(shouldExcludeFile(filePath, excludePatterns)); // Output: true
 */
export function shouldExcludeFile(
  filePath: string,
  excludePatterns: string[],
): boolean {
  return excludePatterns.some((pattern) => {
    const lastSegment = path.basename(filePath);
    if (lastSegment.startsWith(".")) {
      return true;
    }

    // Check if the pattern is a regular expression by looking for regex characters
    const isRegex = pattern.includes("*");

    if (isRegex) {
      const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
      const regexPattern = escapedPattern.replace(/\\\*/g, '.*'); // Convert '*' to '.*' (matches any character sequence)
      const regex = new RegExp(`^${regexPattern}$`);
      const match = regex.test(lastSegment);
      return match;
    } else {
      const match = lastSegment === pattern;
      return match;
    }
  });
}
