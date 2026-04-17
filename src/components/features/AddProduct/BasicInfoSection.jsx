// src/components/features/AddProduct/BasicInfoSection.jsx
import React from 'react';
import Card, { CardHeader } from '../../ui/Card';
import Input, { Textarea, Select } from '../../ui/Input';
import { FileText } from 'lucide-react';

const categoryOptions = [
  { value: '1', label: 'T-Shirt' },
  { value: '2', label: 'Shirt' },
  { value: '3', label: 'Bottoms' }
];

const brandOptions = [
  { value: 'trendifyMe', label: 'TrendifyMe' },
  { value: 'other', label: 'Other / Custom' }
];

export default function BasicInfoSection({ data, onChange, errors }) {
  const update = (field) => (e) => onChange({ ...data, [field]: e.target.value });

  return (
    <Card className="animate-fade-slide-up">
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
          placeholder="e.g. Premium clothes"
          value={data.name}
          onChange={update('name')}
          error={errors?.['basic.name']}
          hint="Use a clear, descriptive name that customers will search for"
        />

        {/* Short Description */}
        <Textarea
          id="product-short-desc"
          label="Short Description"
          required
          placeholder="A compelling one-liner that summarizes the product's key value proposition..."
          value={data.shortDesc}
          onChange={update('shortDesc')}
          error={errors?.['basic.shortDesc']}
          rows={2}
          maxLength={160}
          hint="Displayed in product cards and search results"
        />

        {/* Full Description */}
        <Textarea
          id="product-description"
          label="Full Description"
          placeholder="Describe features, specifications, materials, use cases, and what makes this product stand out..."
          value={data.description}
          onChange={update('description')}
          error={errors?.['basic.description']}
          rows={5}
          maxLength={2000}
        />

        {/* Row: Category + Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            id="product-category"
            label="Category"
            required
            placeholder="Select a category..."
            options={categoryOptions}
            value={data.category}
            onChange={update('category')}
            error={errors?.['basic.category']}
          />
          <Select
            id="product-brand"
            label="Brand"
            placeholder="Select a brand..."
            options={brandOptions}
            value={data.brand}
            onChange={update('brand')}
            error={errors?.['basic.brand']}
          />
        </div>

        {/* Row: SKU + Barcode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="product-sku"
            label="SKU (Stock Keeping Unit)"
            placeholder="e.g. WH-PRO-BLK-001"
            value={data.sku}
            onChange={update('sku')}
            error={errors?.['basic.sku']}
            hint="Unique identifier for inventory tracking"
          />
          <Input
            id="product-barcode"
            label="Barcode / GTIN"
            placeholder="e.g. 0123456789012"
            value={data.barcode}
            onChange={update('barcode')}
            error={errors?.['basic.barcode']}
          />
        </div>

        {/* Tags */}
        <div>
          <Input
            id="product-tags"
            label="Tags"
            placeholder="Enter tags separated by commas"
            value={data.tags}
            onChange={update('tags')}
            error={errors?.['basic.tags']}
            hint="Improve searchability by adding relevant keywords"
          />
        </div>
      </div>
    </Card>
  );
}
