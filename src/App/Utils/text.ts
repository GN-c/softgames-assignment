/**
 * Converts a camelCase string to a space-delimited string.
 * e.g. "AceOfShadows" -> "Ace Of Shadows"
 */
export function camelCaseToSpaces(str: string): string {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}
