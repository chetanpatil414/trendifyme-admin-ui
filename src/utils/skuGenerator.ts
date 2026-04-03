/**
 * Sanitizes and normalizes text for SKUs.
 * Rules:
 * - Uppercase
 * - Trim
 * - Remove special characters (keep alphanumeric and existing dashes)
 * - Replace one or more spaces with a single dash
 */
const normalize = (text: string): string => {
  return (text || '')
    .trim()
    .toUpperCase()
    // Remove all characters that aren't A-Z, 0-9, or -
    .replace(/[^A-Z0-9\s-]/g, '')
    // Replace spaces with -
    .replace(/\s+/g, '-');
};

/**
 * Generates a random 7-digit numeric string.
 */
export const generate7DigitId = (): string => {
  // Generate a number between 1000000 and 9999999
  return Math.floor(1000000 + Math.random() * 9000000).toString();
};

/**
 * Generates a globally unique but readable SKU.
 * Format: <CATEGORY>-<COLOR?>-<SIZE>-<UNIQUE_ID>
 * 
 * @param categoryName - The name of the product category
 * @param attributes - Record of variant attributes (e.g. { Color: 'Red', Size: 'M' })
 * @param uniqueId - A pre-generated 7-digit ID unique to this variant
 */
export const generateSku = (
  categoryName: string, 
  attributes: Record<string, string>,
  uniqueId: string
): string => {
  const categoryPart = normalize(categoryName || 'PROD');
  
  // Find specific mandatory/optional attributes
  // Case-insensitive check for Color and Size
  const colorKey = Object.keys(attributes).find(k => k.toLowerCase() === 'color');
  const sizeKey = Object.keys(attributes).find(k => k.toLowerCase() === 'size');

  const colorPart = colorKey ? normalize(attributes[colorKey]) : '';
  const sizePart = sizeKey ? normalize(attributes[sizeKey]) : 'NA';

  // Assembly: [CATEGORY]-[COLOR?]-[SIZE]-[ID]
  return [categoryPart, colorPart, sizePart, uniqueId]
    .filter(Boolean)
    .join('-');
};
