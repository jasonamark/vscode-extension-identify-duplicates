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

function escapeSpecialCharacters(wildcard: string): string {
  // Escape special characters and replace * with .* to form a regex pattern
  return wildcard
    .replace(/[-\/\\^$+?.()|[\]{}]/g, "\\$&") // Escape special characters
    .replace(/\*/g, ".*"); // Replace * with .*
}
