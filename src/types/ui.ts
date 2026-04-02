import { Media } from './product';

export interface AttributeGroupUI {
  id: string;
  name: string;
  values: string[];
}

export interface VariantRowUI {
  id: string;
  sku: string;
  isSkuEdited?: boolean;
  price: number;
  inventoryQuantity: number;
  attributes: Record<string, string>;
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
