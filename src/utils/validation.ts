import { VariantRowUI } from '../types/ui';

export interface ValidationErrors {
  variants: Record<number, string[]>;
  general: string[]
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

/**
 * Validates the product form state and variant configurations.
 * 
 * Rules:
 * - SKU must be unique across all variants.
 * - Price must be greater than 0.
 * - Stock must be 0 or greater.
 * - At least 1 variant must be present.
 */
export const validateProductForm = (variants: VariantRowUI[]): ValidationResult => {
  const errors: ValidationErrors = {
    variants: {},
    general: []
  };

  // Rule: At least 1 variant
  if (variants.length === 0) {
    errors.general.push('At least one variant must be present.');
  }

  // Tracking SKUs for uniqueness check
  const skuMap = new Map<string, number[]>(); // SKU string -> Array of indices

  variants.forEach((variant, index) => {
    const variantErrors: string[] = [];

    // Rule: SKU uniqueness (populate map for later check)
    const sku = variant.sku.trim().toUpperCase();
    if (sku) {
      if (!skuMap.has(sku)) {
        skuMap.set(sku, []);
      }
      skuMap.get(sku)?.push(index);
    } else {
      variantErrors.push('SKU is required.');
    }

    // Rule: Price > 0
    if (variant.price <= 0) {
      variantErrors.push('Price must be greater than 0.');
    }

    // Rule: Stock >= 0
    if (variant.inventoryQuantity < 0) {
      variantErrors.push('Stock cannot be negative.');
    }

    if (variantErrors.length > 0) {
      errors.variants[index] = variantErrors;
    }
  });

  // SKU Uniqueness final check
  skuMap.forEach((indices, sku) => {
    if (indices.length > 1) {
      indices.forEach(index => {
        if (!errors.variants[index]) {
          errors.variants[index] = [];
        }
        if (!errors.variants[index].includes(`Duplicate SKU: ${sku}`)) {
          errors.variants[index].push(`Duplicate SKU: ${sku}`);
        }
      });
    }
  });

  const isValid = errors.general.length === 0 && Object.keys(errors.variants).length === 0;

  return {
    isValid,
    errors
  };
};
