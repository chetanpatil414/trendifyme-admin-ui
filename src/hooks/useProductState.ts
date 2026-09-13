import { useState, useMemo } from 'react';
import { Product } from '../types/product';
import { AttributeGroupUI, VariantRowUI } from '../types/ui';
import { productInitialState } from '../state/productInitialState';
import { generateCombinations } from '../utils/generateCombinations';
import { generateSku, generate7DigitId } from '../utils/skuGenerator';
import { CATEGORY_OPTIONS } from '../constants/categories';
import { validateProductForm } from '../utils/validation';
import { ExtendedMedia } from '../components/features/AddProduct/MediaUploadSection';

const deepSortKeys = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepSortKeys);
  
  return Object.keys(obj)
    .sort()
    .reduce((acc: any, key) => {
      acc[key] = deepSortKeys(obj[key]);
      return acc;
    }, {});
};

const getStableSnapshot = (attributes: AttributeGroupUI[]): string => {
  return JSON.stringify(deepSortKeys(attributes));
};

export const useProductState = () => {
  const [product, setProduct] = useState<Partial<Product>>(productInitialState.product);
  const [attributes, setAttributes] = useState<AttributeGroupUI[]>(productInitialState.attributes);
  const [variants, setVariants] = useState<VariantRowUI[]>(productInitialState.variants);
  const [media, setMedia] = useState<ExtendedMedia[]>([]);
  const [lastGeneratedSnapshot, setLastGeneratedSnapshot] = useState<string | null>(null);

  const addAttribute = (attributeId: number, name: string, displayName: string) => {
    setAttributes(prev => {
      if (prev.some(a => a.attributeId === attributeId)) return prev;
      return [...prev, { id: crypto.randomUUID(), attributeId, name, displayName, values: [] }];
    });
    // Structural change: clear variants
    setVariants([]);
  };

  const removeAttribute = (attributeId: number) => {
    setAttributes(prev => prev.filter(attr => attr.attributeId !== attributeId));
    setVariants([]);
  };

  const addAttributeValue = (attributeId: number, optionId: number, value: string, displayValue: string) => {
    setAttributes(prev => prev.map(attr => 
      attr.attributeId === attributeId 
        ? { 
            ...attr, 
            values: attr.values.some(v => v.optionId === optionId)
              ? attr.values
              : [...attr.values, { optionId, value, displayValue }] 
          }
        : attr
    ));
  };

  const removeAttributeValue = (attributeId: number, optionId: number) => {
    setAttributes(prev => prev.map(attr => 
      attr.attributeId === attributeId 
        ? { ...attr, values: attr.values.filter(v => v.optionId !== optionId) } 
        : attr
    ));
    // Structural change: clear variants if removed value affects them
    setVariants([]);
  };

  const updateVariantSku = (index: number, sku: string) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index 
        ? { ...variant, sku, isSkuEdited: true }
        : variant
    ));
  };

  const updateVariantPrice = (index: number, price: number) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, price: Math.max(0, price) } : variant
    ));
  };

  const updateVariantStock = (index: number, quantity: number) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, inventoryQuantity: Math.max(0, quantity) } : variant
    ));
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const clearVariants = () => setVariants([]);

  const generateVariants = () => {
    const combinations = generateCombinations(attributes);
    const categoryName = CATEGORY_OPTIONS.find(c => c.value === product.categoryId?.toString())?.label || 'PROD';
    
    // 1. Ensure we have a product-level suffix (generate once)
    const currentSuffix = product.skuSuffix || generate7DigitId();
    if (!product.skuSuffix) {
      setProduct(prev => ({ ...prev, skuSuffix: currentSuffix }));
    }

    // 2. Generate all variants using the same suffix and base defaults
    const basePrice = parseFloat(product.price || '0');
    const baseComparePrice = parseFloat(product.comparePrice || '0');
    const baseStock = parseInt(product.stock || '0');

    const newVariants: VariantRowUI[] = combinations.map(combo => {
      return {
        id: crypto.randomUUID(),
        uniqueId: currentSuffix,
        sku: generateSku(categoryName, combo, currentSuffix),
        price: basePrice,
        comparePrice: baseComparePrice > 0 ? baseComparePrice : undefined,
        inventoryQuantity: baseStock,
        attributes: combo,
        isSkuEdited: false,
      };
    });
    setVariants(newVariants);
    setLastGeneratedSnapshot(getStableSnapshot(attributes));
  };

  const regenerateAllSkus = () => {
    const categoryName = CATEGORY_OPTIONS.find(c => c.value === product.categoryId?.toString())?.label || 'PROD';
    const currentSuffix = product.skuSuffix || generate7DigitId();
    
    // If we didn't have a suffix, save it now
    if (!product.skuSuffix) {
      setProduct(prev => ({ ...prev, skuSuffix: currentSuffix }));
    }

    setVariants(prev => prev.map(variant => {
      // If manually edited, skip regeneration
      if (variant.isSkuEdited) return variant;
      
      return {
        ...variant,
        uniqueId: currentSuffix,
        sku: generateSku(categoryName, variant.attributes, currentSuffix),
      };
    }));
  };

  const validation = useMemo(() => validateProductForm(variants), [variants]);

  const isStale = useMemo(() => {
    if (!lastGeneratedSnapshot || variants.length === 0) return false;
    return lastGeneratedSnapshot !== getStableSnapshot(attributes);
  }, [lastGeneratedSnapshot, attributes, variants.length]);

  return {
    product,
    attributes,
    variants,
    media,
    validation,
    isStale,
    setProduct,
    setAttributes,
    setVariants,
    setMedia,
    addAttribute,
    removeAttribute,
    addAttributeValue,
    removeAttributeValue,
    generateVariants,
    updateVariantSku,
    updateVariantPrice,
    updateVariantStock,
    removeVariant,
    clearVariants,
    regenerateAllSkus,
  };
};
