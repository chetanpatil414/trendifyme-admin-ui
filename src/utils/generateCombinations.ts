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
import { AttributeGroupUI, AttributeValueUI } from '../types/ui';

export interface VariantAttributeCombo {
  attributeId: number;
  optionId: number;
  value: string;
  displayValue: string;
  name: string; // original lowercase name for backward compatibility
}

export const generateCombinations = (attributes: AttributeGroupUI[]): Record<string, VariantAttributeCombo>[] => {
  if (attributes.length === 0) return [];

  // Filter out attributes with no selected values
  const validAttributes = attributes.filter(attr => attr.values.length > 0 && attr.attributeId !== null);
  if (validAttributes.length === 0) return [];

  return validAttributes.reduce((acc, attr) => {
    const key = attr.name.toLowerCase();
    
    if (acc.length === 0) {
      return attr.values.map(val => ({
        [key]: {
          attributeId: attr.attributeId!,
          optionId: val.optionId,
          value: val.value,
          displayValue: val.displayValue,
          name: key
        }
      }));
    }

    return acc.flatMap(item => 
      attr.values.map(val => ({
        ...item,
        [key]: {
          attributeId: attr.attributeId!,
          optionId: val.optionId,
          value: val.value,
          displayValue: val.displayValue,
          name: key
        }
      }))
    );
  }, [] as Record<string, VariantAttributeCombo>[]);
};
