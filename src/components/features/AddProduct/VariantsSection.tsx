// src/components/features/AddProduct/VariantsSection.tsx
import React from 'react';
import Card, { CardHeader } from '../../ui/Card';
import { Layers, Info } from 'lucide-react';
import { Textarea } from '../../ui/Input';
import AttributeManager from '../ProductForm/AttributeManager';
import VariantActions from '../ProductForm/VariantActions';
import VariantTable from '../ProductForm/VariantTable';
import { AttributeGroupUI, VariantRowUI } from '../../../types/ui';
import { ValidationResult } from '../../../utils/validation';

interface VariantsSectionProps {
  attributes: AttributeGroupUI[];
  variants: VariantRowUI[];
  validation: ValidationResult;
  isStale: boolean;
  material: string;
  onUpdateMaterial: (val: string) => void;
  // Handlers from useProductState
  addAttribute: (name: string) => void;
  removeAttribute: (name: string) => void;
  addAttributeValue: (group: string, val: string) => void;
  removeValue: (group: string, val: string) => void;
  generateVariants: () => void;
  regenerateSkus: () => void;
  updatePrice: (idx: number, val: number) => void;
  updateStock: (idx: number, val: number) => void;
  updateSku: (idx: number, val: string) => void;
  removeVariant: (idx: number) => void;
}

export default function VariantsSection({
  attributes,
  variants,
  validation,
  isStale,
  material,
  onUpdateMaterial,
  addAttribute,
  removeAttribute,
  addAttributeValue,
  removeValue,
  generateVariants,
  regenerateSkus,
  updatePrice,
  updateStock,
  updateSku,
  removeVariant,
}: VariantsSectionProps) {
  
  // Determine which attributes are "active" (i.e. used in current variants)
  // This helps show deletion warnings in AttributeManager
  const activeAttributeNames = variants.length > 0 
    ? attributes.map(a => a.name.toLowerCase()) 
    : [];

  return (
    <div className="space-y-6" id="section-variants">
      {/* 1. Attribute Management */}
      <AttributeManager
        attributes={attributes}
        variantsCount={variants.length}
        activeAttributeNames={activeAttributeNames}
        onAddAttribute={addAttribute}
        onRemoveAttribute={removeAttribute}
        onAddValue={addAttributeValue}
        onRemoveValue={removeValue}
        isStale={isStale}
        onGenerate={generateVariants}
      />

      {/* 2. Actions (Generate/Auto-fill) */}
      <VariantActions
        attributes={attributes}
        hasVariants={variants.length > 0}
        onGenerate={generateVariants}
        onRegenerateSkus={regenerateSkus}
      />

      {/* 3. Variant Table */}
      <VariantTable
        variants={variants}
        attributes={attributes}
        validation={validation}
        onUpdatePrice={updatePrice}
        onUpdateStock={updateStock}
        onUpdateSku={updateSku}
        onRemoveVariant={removeVariant}
      />

      {/* 4. Material/Composition (Legacy from old JSX but kept for completeness) */}
      <Card className="animate-fade-slide-up">
        <CardHeader
          icon={Info}
          title="Material & Composition"
          subtitle="Specific details about what this product is made of"
        />
        <Textarea
          placeholder="e.g. 100% organic cotton shell, recycled polyester lining..."
          value={material}
          onChange={(e) => onUpdateMaterial(e.target.value)}
          rows={3}
          className="bg-[#f7f9ff]"
        />
      </Card>
    </div>
  );
}
