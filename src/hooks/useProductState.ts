import { useState, useMemo } from 'react';
import { Product } from '../types/product';
import { AttributeGroupUI, VariantRowUI } from '../types/ui';
import { productInitialState } from '../state/productInitialState';
import { generateCombinations } from '../utils/generateCombinations';
import { generateSku } from '../utils/skuGenerator';
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

  const addAttribute = (name: string) => {
    setAttributes(prev => [...prev, { id: crypto.randomUUID(), name, values: [] }]);
    // Structural change: clear variants
    setVariants([]);
  };

  const removeAttribute = (name: string) => {
    setAttributes(prev => prev.filter(attr => attr.name !== name));
    setVariants([]);
  };

  const addAttributeValue = (attributeName: string, value: string) => {
    setAttributes(prev => prev.map(attr => 
      attr.name === attributeName 
        ? { ...attr, values: [...new Set([...attr.values, value])] }
        : attr
    ));
    // Note: Adding a value doesn't automatically clear variants, but they become stale.
    // User must click "Generate" to refresh.
  };

  const removeAttributeValue = (attributeName: string, value: string) => {
    setAttributes(prev => prev.map(attr => 
      attr.name === attributeName 
        ? { ...attr, values: attr.values.filter(v => v !== value) } 
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
    const newVariants: VariantRowUI[] = combinations.map(combo => ({
      id: crypto.randomUUID(),
      sku: generateSku(product.name || '', combo),
      price: 0,
      inventoryQuantity: 10,
      attributes: combo,
      isSkuEdited: false,
    }));
    setVariants(newVariants);
    setLastGeneratedSnapshot(getStableSnapshot(attributes));
  };

  const regenerateAllSkus = () => {
    setVariants(prev => prev.map(variant => {
      // If manually edited, skip regeneration unless we want a forced overwrite (not specified, so we skip)
      if (variant.isSkuEdited) return variant;
      
      return {
        ...variant,
        sku: generateSku(product.name || '', variant.attributes),
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
