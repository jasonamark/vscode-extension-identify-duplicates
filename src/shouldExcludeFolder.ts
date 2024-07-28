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
    // Check if the pattern is a regular expression by looking for regex characters
    const isRegex = pattern.includes('*');
        
    if (isRegex) {
      const regex = new RegExp(pattern);
      const match = regex.test(folderPath);
      return match;
    } else {
      // Split folder path into segments and check for exact match
      const segments = folderPath.split('/');
      const match = segments.includes(pattern);
      return match;
    }
  });
}
