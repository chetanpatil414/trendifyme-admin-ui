// src/services/productService.js

// ** DEAR DEVELOPER: Replace this URL with your actual backend API endpoint **
const ADMIN_API_URL = 'https://trendifyme-backend-service-0-0-2.onrender.com/api/admin';
const USER_API_URL = 'http://localhost:8080/api/products';

/**
 * Creates a new product by submitting formData to the backend API.
 * Uses multipart/form-data to support raw image uploads alongside JSON data.
 * 
 * @param {Object} productState The nested React state object containing product details
 * @returns {Promise<Object>} The API response payload
 */
export async function createProduct(productState) {
  try {
    const formData = new FormData();
    console.log("Product state:", productState);

    // 1. Append flat basic strings
    formData.append('name', productState.basic.name);
    formData.append('description', productState.basic.description);
    formData.append('shortDesc', productState.basic.shortDesc);
    formData.append('categoryId', productState.basic.category);
    formData.append('brand', productState.basic.brand);
    formData.append('sku', productState.basic.sku);
    formData.append('barcode', productState.basic.barcode);

    // 2. Append Arrays (Tags, Sizes, Colors)
    // Most backends accept repeated keys for arrays, or JSON stringified arrays.
    // Here we use JSON stringify for strict data preservation. Replace if your backend requires `tags[]`.
    const tags = productState.basic.tags.split(',').map(t => t.trim()).filter(Boolean);
    formData.append('tags', JSON.stringify(tags));
    formData.append('sizes', JSON.stringify(productState.variants.sizes));
    formData.append('colors', JSON.stringify(productState.variants.colors));
    formData.append('material', productState.variants.material);

    // 3. Append Values and Classifications
    formData.append('price', productState.value.price);
    formData.append('comparePrice', productState.value.comparePrice);
    formData.append('costPrice', productState.value.costPrice);
    formData.append('stock', productState.value.stock);
    formData.append('lowStockAlert', productState.value.lowStockAlert);

    formData.append('status', productState.classification.status);
    formData.append('visibility', productState.classification.visibility);

    // 4. Append Media Files (Multipart Binary)
    // The MediaUploadSection must attach the raw `File` blob to `rawFile` attribute.
    if (productState.media.images && productState.media.images.length > 0) {
      productState.media.images.forEach((img, index) => {
        if (img.rawFile) {
          // Send raw File buffer
          formData.append('images', img.rawFile);
        } else if (img.url && img.url.startsWith('http')) {
          // Send external URL string if users pasted a link
          formData.append(`imageUrls[${index}]`, img.url);
        }

        // Indicate which file/url is the primary cover photo
        if (img.isPrimary) {
          formData.append('primaryImageIndex', index.toString());
        }
      });
    }

    // --- EXECUTE NETWORK REQUEST ---

    // Developer note: Remove the IF statement to enforce strict fetching against real backend.
    // Right now, if the API_URL still contains dummy data, we simulate the request to avoid a CORS/Network crash during UI development.
    if (ADMIN_API_URL.includes('products')) {
      console.warn('Simulating API request because API_URL is still set to placeholder.');
      await new Promise(r => setTimeout(r, 1500)); // Simulate network latency
      if (!productState.basic.name) throw new Error('Backend simulation error: Form data is malformed.');
      return { success: true, message: 'Simulated creation successful', id: crypto.randomUUID() };
    }

    const response = await fetch(`${ADMIN_API_URL}/products`, {
      method: 'POST',
      // Note: We DO NOT set 'Content-Type': 'multipart/form-data'. 
      // The browser automatically sets it and generates the necessary boundary string when passing FormData!
      body: formData,
    });

    if (!response.ok) {
      // Attempt to parse explicit JSON error messages from the backend
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API request failed with status ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('Service layer error creating product:', error);
    throw error;
  }
}

/**
 * Fetches a paginated list of products from the backend API.
 * 
 * @param {Object} params Configuration object
 * @param {number} params.page The current page number (0-indexed)
 * @param {number} params.size Number of items per page
 * @param {string|string[]} params.sort Sorting criteria (e.g., 'price,ASC' or ['name,DESC'])
 * @returns {Promise<Object>} Paginated response payload 
 */
export async function getProducts({ page = 0, size = 10, sort = [] } = {}) {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    if (Array.isArray(sort)) {
      sort.forEach(s => params.append('sort', s));
    } else if (sort) {
      params.append('sort', sort);
    }

    const response = await fetch(`${'https://trendifyme-backend-service-0-0-2.onrender.com/api/products'}?${params.toString()}`, {
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
}
