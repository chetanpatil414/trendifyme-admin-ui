import { MappedPayload } from '../utils/payloadMapper';
import { Product } from '../types/product';

const ADMIN_API_URL = 'http://localhost:8080/api/admin';
const PUBLIC_API_URL = 'http://localhost:8080/api/products';

export interface GetProductsParams {
  page?: number;
  size?: number;
  sort?: string | string[];
}

/**
 * Creates a new product using Multipart/Form-Data.
 * The JSON product data is sent as a 'request' part with application/json type.
 * Binary images are sent as 'images' parts.
 */
export const createProduct = async (payload: MappedPayload): Promise<{ success: boolean; id: string }> => {
  try {
    const formData = new FormData();
    
    // 1. Append JSON part as an application/json Blob
    // This allows Spring Boot's @RequestPart to correctly parse the JSON structure.
    formData.append('request', new Blob([JSON.stringify(payload.request)], { 
      type: 'application/json' 
    }));
    
    // 2. Append multiple images using the same key 'images'
    // Spring Boot maps this to a MultipartFile[] images array.
    payload.images.forEach(image => {
      formData.append('images', image);
    });

    const response = await fetch(`${ADMIN_API_URL}/products`, {
      method: 'POST',
      // DO NOT set 'Content-Type': 'multipart/form-data' header.
      // Browser automatically calculates the boundary string.
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Product creation failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Service layer error creating product:', error);
    throw error;
  }
};

/**
 * Fetches a paginated and sorted list of products.
 */
export const getProducts = async ({ page = 0, size = 10, sort = [] }: GetProductsParams = {}): Promise<{ content: Product[], totalElements: number }> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    if (Array.isArray(sort)) {
      sort.forEach(s => params.append('sort', s));
    } else if (sort) {
      params.append('sort', sort);
    }

    const response = await fetch(`${PUBLIC_API_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Fetching products failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Service layer error fetching products:', error);
    throw error;
  }
};
