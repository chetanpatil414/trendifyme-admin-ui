export interface Attribute {
  key: string;
  value: string | number | boolean;
}

export interface Inventory {
  sku: string;
  quantity: number;
  trackQuantity: boolean;
  lowStockThreshold?: number;
}

export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video';
  altText?: string;
  isPrimary?: boolean;
}

export interface Variant {
  id: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: Inventory;
  // Variants must support dynamic attributes, which are key-value based
  attributes: Record<string, string>;
  mediaIds?: string[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'draft' | 'archived';
  variants: Variant[];
  media: Media[];
  // Product level attributes
  attributes: Attribute[];
  createdAt: string;
  updatedAt: string;
}
