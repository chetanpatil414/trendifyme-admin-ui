import { Product, Variant } from '../types/product';
import { VariantRowUI } from '../types/ui';
import { ExtendedMedia } from '../components/features/AddProduct/MediaUploadSection';

export interface MappedPayload {
  request: {
    product: Partial<Product>;
    media: { images: any[] };
    variants: any[];
  };
  images: File[];
}

/**
 * Maps the frontend UI state to the backend-expected Multipart/Form-Data "request" JSON blob
 * and extract high-quality raw image files for the "images" part.
 */
export const mapToApiPayload = (
  product: Partial<Product>,
  variants: VariantRowUI[],
  media: ExtendedMedia[] = []
): MappedPayload => {
  const images: File[] = [];
  
  // 1. Map Media to API format and extract raw files
  // Find the primary/cover image metadata to send in the singular JSON field
  const primaryMedia = media.find(m => m.isPrimary) || media[0];
  
  const mappedMedia = primaryMedia ? {
    id: primaryMedia.id,
    url: primaryMedia.url,
    type: primaryMedia.type,
    altText: primaryMedia.name,
    isPrimary: true
  } : null;

  // Still collect all raw binary files for the MultipartFile[] images part
  media.forEach(m => {
    if (m.rawFile) {
      images.push(m.rawFile);
    }
  });

  const productComparePrice = parseFloat(product.comparePrice || '0');

  // 2. Map Variants to API format
  const apiVariants = variants.map(v => {
    const comparePrice =
      v.comparePrice ?? (productComparePrice > 0 ? productComparePrice : undefined);

    return {
    sku: v.sku,
    price: v.price,
    comparePrice: comparePrice && comparePrice > 0 ? comparePrice : undefined,
    stock: v.inventoryQuantity,
    currency: 'INR',
    attributes: Object.values(v.attributes).map(attr => ({
      attributeId: attr.attributeId,
      optionId: attr.optionId
    })),
    inventory: {
      availableStock: v.inventoryQuantity,
      lowStockAlert: 5
    }
  };
  });

  // 3. Assemble the JSON part of the payload
  const request = {
    product: {
      name: product.name || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      slug: product.slug || '',
      brand: product.brand || 'Other',
      categoryId: Number(product.categoryId) || 1,
      status: product.status || 'DRAFT',
      visibility: product.visibility || 'PUBLIC',
      isActive: product.isActive ?? true,
      tags: product.tags || [],
      skuSuffix: product.skuSuffix || null,
    },
    media: {
      images: mappedMedia ? [mappedMedia] : []
    },
    variants: apiVariants,
  };

  return { request, images };
};
