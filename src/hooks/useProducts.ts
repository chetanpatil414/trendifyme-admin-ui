// src/hooks/useProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/productService';
import { Product } from '../types/product';

interface PaginatedResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export function useProducts(initialPage = 0, initialSize = 10, initialSort: string[] = []) {
  const [data, setData] = useState<PaginatedResponse>({ content: [], totalElements: 0, totalPages: 0, number: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [sort, setSort] = useState(initialSort);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts({ page, size, sort });
      
      if (Array.isArray(response)) {
        setData({ content: response, totalElements: response.length, totalPages: 1, number: 0 });
      } else if (response && response.content) {
        setData(response);
      } else if (response && response.data) {
        setData({ 
          content: response.data, 
          totalElements: response.total || response.data.length, 
          totalPages: response.totalPages || 1, 
          number: page 
        });
      } else {
         setData({ content: [], totalElements: 0, totalPages: 0, number: 0 });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected networking error occurred');
      setData({ content: [], totalElements: 0, totalPages: 0, number: 0 });
    } finally {
      setLoading(false);
    }
  }, [page, size, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products: data.content,
    pagination: {
      currentPage: data.number !== undefined ? data.number : page,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      pageSize: size,
    },
    loading,
    error,
    actions: {
      setPage,
      setSize,
      setSort,
      refetch: fetchProducts
    }
  };
}
