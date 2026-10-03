import { Media } from './product';
import { VariantAttributeCombo } from '../utils/generateCombinations';

export interface AttributeValueUI {
  optionId: number;
  value: string;
  displayValue: string;
}

export interface AttributeGroupUI {
  id: string;
  attributeId: number | null;
  name: string;
  displayName: string;
  values: AttributeValueUI[];
}

export interface VariantRowUI {
  id: string;
  sku: string;
  uniqueId?: string;
  isSkuEdited?: boolean;
  price: number;
  comparePrice?: number;
  inventoryQuantity: number;
  attributes: Record<string, VariantAttributeCombo>;
  image?: File | Media | null;
}

export interface ProductFormState {
  title: string;
  description: string;
  category: string;
  status: 'active' | 'draft' | 'archived';
  
  attributeGroups: AttributeGroupUI[];
  variants: VariantRowUI[];
  media: (File | Media)[];

  // Form-specific states
  isLoading: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
}
