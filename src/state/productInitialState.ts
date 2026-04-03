import { Product } from '../types/product';
import { AttributeGroupUI, VariantRowUI } from '../types/ui';

export interface ProductState {
  product: Partial<Product>;
  attributes: AttributeGroupUI[];
  variants: VariantRowUI[];
}

export const productInitialState: ProductState = {
  product: {
    name: '',
    description: '',
    categoryId: 0,
    status: 'DRAFT',
    visibility: 'PUBLIC',
    isActive: true,
  },
  attributes: [],
  variants: [],
};
