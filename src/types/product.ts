export interface Attribute {
  key: string;
  value: string | number | boolean;
}

export interface Inventory {
  availableStock: number;
  lowStockAlert: number;
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
  barcode?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  currency: string;
  stock: number;
  inventory: Inventory;
  // Variants must support dynamic attributes, which are key-value based
  attributes: Record<string, string>;
  mediaIds?: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  slug?: string;
  categoryId: number;
  brand?: string;
  categoryName?: string;
  tags?: string[];
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  visibility: 'PUBLIC' | 'PRIVATE';
  isActive: boolean;
  skuSuffix?: string | null;
  price?: string;
  comparePrice?: string;
  stock?: string;
  variants: Variant[];
  media: Media[];
  images?: string[];
  // Product level attributes
  attributes: Attribute[];
  createdAt: string;
  updatedAt: string;
}
