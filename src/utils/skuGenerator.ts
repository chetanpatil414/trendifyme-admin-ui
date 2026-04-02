/**
 * Generates a SKU based on product name and attributes.
 * 
 * Rules:
 * - Product name prefix
 * - Uppercase
 * - Replace spaces with -
 */
export const generateSku = (productName: string, attributes: Record<string, string>): string => {
  const namePart = (productName || 'PROD').trim().toUpperCase().replace(/\s+/g, '-');
  
  // Extract attribute values, uppercase them, and replace spaces
  const attrParts = Object.values(attributes)
    .map(val => String(val).trim().toUpperCase().replace(/\s+/g, '-'));
  
  // Combine parts with dashes
  return [namePart, ...attrParts].filter(Boolean).join('-');
};
