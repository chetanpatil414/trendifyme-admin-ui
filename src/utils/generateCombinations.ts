/**
 * Generates a Cartesian product of attribute values.
 * 
 * Input Example:
 * [
 *   { name: "Color", values: ["Red", "Blue"] },
 *   { name: "Size", values: ["M", "L"] }
 * ]
 * 
 * Output Example:
 * [
 *   { color: "Red", size: "M" },
 *   { color: "Red", size: "L" },
 *   { color: "Blue", size: "M" },
 *   { color: "Blue", size: "L" }
 * ]
 */
export const generateCombinations = (attributes: { name: string; values: string[] }[]): Record<string, string>[] => {
  if (attributes.length === 0) return [];

  // Filter out attributes with no values to avoid empty results
  const validAttributes = attributes.filter(attr => attr.values.length > 0);
  if (validAttributes.length === 0) return [];

  return validAttributes.reduce((acc, attr) => {
    const key = attr.name.toLowerCase();
    
    if (acc.length === 0) {
      return attr.values.map(val => ({ [key]: val }));
    }

    return acc.flatMap(item => 
      attr.values.map(val => ({
        ...item,
        [key]: val
      }))
    );
  }, [] as Record<string, string>[]);
};
