import { ITree } from "./types";

/**
 * Converts bytes to a more readable format (KB, MB, GB, etc.) without decimal places.
 * @param bytes - The number of bytes to convert.
 * @returns The formatted string representing the bytes in a shorter unit.
 */
export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const formattedSize = Math.floor(bytes / Math.pow(k, i));

  return `${formattedSize} ${sizes[i]}`;
}

export function setHighlightedFiles(
  chartData: ITree,
  searchFiles: string,
): ITree {
  // Split the searchFiles string into individual parts
  const parts = searchFiles.split(",").map((part) => part.trim());

  // Recursive function to update the chartData
  function updateNode(node: ITree): ITree {
    // Check if the node's name matches any of the regex patterns or contains the part
    const highlight = parts[0].length
      ? parts.some((part) => {
          try {
            const regex = new RegExp(escapeSpecialCharacters(part));
            return regex.test(node.name);
          } catch {
            return node.name.includes(part);
          }
        })
      : false;

    // Update the node's highlighted property
    const updatedNode: ITree = {
      ...node,
      highlight,
      children: node.children?.map(updateNode), // Recursively update children
    };

    return updatedNode;
  }

  // Start the update from the root of the chartData
  return updateNode(chartData);
}

function escapeSpecialCharacters(wildcard: string): string {
  // Escape special characters and replace * with .* to form a regex pattern
  return wildcard
    .replace(/[-\/\\^$+?.()|[\]{}]/g, "\\$&") // Escape special characters
    .replace(/\*/g, ".*"); // Replace * with .*
}
