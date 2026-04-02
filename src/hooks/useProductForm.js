// src/hooks/useProductForm.js
import { useState, useCallback, useEffect } from 'react';
import { createProduct } from '../services/productService';

const initialState = {
  basic: {
    name: '',
    shortDesc: '',
    description: '',
    category: '',
    brand: '',
    sku: '',
    barcode: '',
    tags: '',
  },
  variants: {
    sizes: [],
    colors: [],
    material: '',
  },
  media: {
    images: [],
  },
  value: {
    price: '',
    comparePrice: '',
    costPrice: '',
    currency: 'USD',
    stock: '',
    lowStockAlert: '10',
    weight: '',
    dimensions: '',
  },
  classification: {
    status: 'draft',
    visibility: 'all',
    taxClass: 'standard',
    shippingClass: 'standard',
  },
};

export function useProductForm(onSuccess) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [toasts, setToasts] = useState([]);

  // Warn user exactly before leaving if form is dirty
  useEffect(() => {
    const isDirty = form.basic.name !== '' || form.basic.description !== '';
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [form]);

  const update = useCallback((section) => (data) => {
    setForm(prev => ({ ...prev, [section]: data }));
    // Clear errors for section when user starts interacting (optimistic UX)
    setErrors(prev => {
      const newErrs = { ...prev };
      Object.keys(newErrs).forEach(key => {
        if (key.startsWith(section)) delete newErrs[key];
      });
      return newErrs;
    });
  }, []);

  const addToast = useCallback((toast) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.basic.name.trim()) newErrors['basic.name'] = 'Product name is required';
    if (!form.basic.category) newErrors['basic.category'] = 'Category is required';
    if (!form.value.price) newErrors['value.price'] = 'Sale price is required';
    if (!form.value.stock) newErrors['value.stock'] = 'Stock quantity is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      addToast({ type: 'error', message: 'Validation failed', description: 'Please fill in all required fields highlighted in red.' });
      return;
    }

    setSubmitting(true);
    addToast({ type: 'info', message: 'Saving product...', description: 'Please wait while we publish your product to the backend.' });

    try {
      // Hit actual backend endpoint abstracting FormData
      await createProduct(form);

      addToast({
        type: 'success',
        message: 'Product Added Successfully!',
        description: `"${form.basic.name}" is now live in your store database.`,
        duration: 4000,
      });

      // Clear form securely so dirty state unmounts cleanly
      setForm(initialState);

      // Trigger redirect callback passing control back to AddProductPage
      if (onSuccess) {
        setTimeout(onSuccess, 1500); // 1.5s delay to let user see the success toast
      }
    } catch (error) {
      addToast({ type: 'error', message: 'API Request Failed', description: error.message || 'An unexpected error occurred while saving.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all form data? This cannot be undone.')) {
      setForm(initialState);
      setErrors({});
      addToast({ type: 'info', message: 'Form cleared', description: 'All fields have been reset.' });
    }
  };

  const completionScore = () => {
    let score = 0;
    if (form.basic.name) score += 20;
    if (form.basic.description) score += 10;
    if (form.basic.category) score += 10;
    if (form.media.images.length > 0) score += 20;
    if (form.value.price) score += 20;
    if (form.value.stock) score += 10;
    if (form.classification.status !== 'draft') score += 10;
    return score;
  };

  return {
    form,
    update,
    errors,
    submitting,
    toasts,
    removeToast,
    handleSubmit,
    handleReset,
    completionScore: completionScore(),
  };
}
