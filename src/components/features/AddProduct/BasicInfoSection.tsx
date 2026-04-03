// src/components/features/AddProduct/BasicInfoSection.tsx
import React from 'react';
import Card, { CardHeader } from '../../ui/Card';
import Input, { Textarea, Select } from '../../ui/Input';
import { FileText } from 'lucide-react';
import { Product } from '../../../types/product';

interface BasicInfoSectionProps {
  data: Partial<Product>;
  onChange: (data: Partial<Product>) => void;
  errors?: Record<string, string>;
}

import { CATEGORY_OPTIONS } from '../../../constants/categories';

const brandOptions = [
  { value: 'trendifyMe', label: 'TrendifyMe' },
  { value: 'other', label: 'Other / Custom' }
];

export default function BasicInfoSection({ data, onChange, errors }: BasicInfoSectionProps) {
  const update = (field: keyof Product) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
    onChange({ ...data, [field]: e.target.value });

  return (
    <Card className="animate-fade-slide-up" id="section-basic">
      <CardHeader
        icon={FileText}
        title="Basic Information"
        subtitle="Enter the core details that identify your product in the catalog"
      />

      <div className="space-y-5">
        {/* Product Name */}
        <Input
          id="product-name"
          label="Product Name"
          required
          placeholder="e.g. Premium Wireless Noise-Cancelling Headphones"
          value={data.name || ''}
          onChange={update('name')}
          error={errors?.['name']}
          hint="Use a clear, descriptive name that customers will search for"
        />

        {/* Description */}
        <Textarea
          id="product-description"
          label="Full Description"
          placeholder="Describe features, specifications, materials, use cases, and what makes this product stand out..."
          value={data.description || ''}
          onChange={update('description')}
          error={errors?.['description']}
          rows={5}
          maxLength={2000}
        />

        {/* New Field: Short Description */}
        <Input
          id="product-short-description"
          label="Short Description"
          placeholder="A briefly summary for search results"
          value={data.shortDescription || ''}
          onChange={update('shortDescription')}
          error={errors?.['shortDescription']}
        />

        {/* New Field: Slug */}
        <Input
          id="product-slug"
          label="URL Slug"
          placeholder="e.g. premium-wireless-headphones"
          value={data.slug || ''}
          onChange={update('slug')}
          error={errors?.['slug']}
          hint="The unique part of the web address for this product"
        />

        {/* Row: Category + Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            id="product-category"
            label="Category"
            required
            placeholder="Select a category..."
            options={CATEGORY_OPTIONS}
            value={data.categoryId?.toString() || ''}
            onChange={(e) => onChange({ ...data, categoryId: parseInt(e.target.value) })}
            error={errors?.['categoryId']}
          />
          <Select
            id="product-brand"
            label="Brand"
            placeholder="Select a brand..."
            options={brandOptions}
            value={data.brand || ''}
            onChange={update('brand')}
            error={errors?.['brand']}
          />
        </div>
      </div>
    </Card>
  );
}
