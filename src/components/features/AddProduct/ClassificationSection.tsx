// src/components/features/AddProduct/ClassificationSection.tsx
import React from 'react';
import Card, { CardHeader } from '../../ui/Card';
import { Select } from '../../ui/Input';
import Badge from '../../ui/Badge';
import { Tag, Globe, Shield, Truck } from 'lucide-react';
import { Product } from '../../../types/product';

interface ClassificationSectionProps {
  data: Partial<Product> & {
    visibility?: string;
    taxClass?: string;
    shippingClass?: string;
  };
  onChange: (data: any) => void;
  errors?: Record<string, string>;
}

const statusOptions = [
  { value: 'draft',     label: 'Draft — Not visible to customers' },
  { value: 'active',   label: 'Active — Live in your store' },
  { value: 'archived', label: 'Archived — Hidden from catalog' },
  { value: 'review',   label: 'Pending Review' },
];

const visibilityOptions = [
  { value: 'all',         label: 'All channels' },
  { value: 'online',      label: 'Online store only' },
  { value: 'pos',         label: 'POS only' },
  { value: 'b2b',         label: 'B2B / Wholesale' },
];

const taxOptions = [
  { value: 'standard',  label: 'Standard Rate' },
  { value: 'reduced',   label: 'Reduced Rate' },
  { value: 'zero',      label: 'Zero Rated' },
  { value: 'exempt',    label: 'Tax Exempt' },
];

const shippingOptions = [
  { value: 'standard',   label: 'Standard Shipping' },
  { value: 'express',    label: 'Express Shipping' },
  { value: 'freight',    label: 'Freight (Heavy Item)' },
  { value: 'digital',    label: 'Digital Product (No Shipping)' },
  { value: 'free',       label: 'Always Free Shipping' },
];

const statusBadge: Record<string, React.ReactNode> = {
  draft:     <Badge variant="neutral" dot>Draft</Badge>,
  active:    <Badge variant="success" dot>Active</Badge>,
  archived:  <Badge variant="warning" dot>Archived</Badge>,
  review:    <Badge variant="purple" dot>In Review</Badge>,
};

export default function ClassificationSection({ data, onChange, errors }: ClassificationSectionProps) {
  const update = (field: string) => (e: React.ChangeEvent<HTMLSelectElement>) => 
    onChange({ ...data, [field]: e.target.value });

  return (
    <Card className="animate-fade-slide-up delay-400" id="section-classification">
      <CardHeader
        icon={Tag}
        title="Classification"
        subtitle="Control how and where this product appears in your store"
      />

      <div className="space-y-5">
        {/* Status */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#4e6175]">Product Status</label>
            {data.status && statusBadge[data.status]}
          </div>
          <Select
            id="product-status"
            options={statusOptions}
            placeholder="Choose status..."
            value={data.status || 'draft'}
            onChange={update('status')}
          />
        </div>

        {/* Visibility */}
        <Select
          id="product-visibility"
          label="Sales Channels"
          options={visibilityOptions}
          value={data.visibility || 'all'}
          onChange={update('visibility')}
          icon={Globe}
        />

        {/* Tax Class */}
        <Select
          id="tax-class"
          label="Tax Classification"
          options={taxOptions}
          value={data.taxClass || 'standard'}
          onChange={update('taxClass')}
          icon={Shield}
        />

        {/* Shipping Method */}
        <Select
          id="shipping-class-select"
          label="Shipping Method"
          options={shippingOptions}
          value={data.shippingClass || 'standard'}
          onChange={update('shippingClass')}
          icon={Truck}
        />

        {/* Summary Card */}
        {(data.status || data.visibility) && (
          <div className="p-4 rounded-xl bg-[#edf4ff] space-y-2">
            <p className="text-xs font-semibold text-[#4e6175] uppercase tracking-wide">Summary</p>
            <div className="space-y-1.5">
              {data.status && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#697d92]">Status</span>
                  {statusBadge[data.status]}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#697d92]">Channel</span>
                <span className="text-xs font-medium text-[#213447]">
                  {visibilityOptions.find(o => o.value === (data.visibility || 'all'))?.label}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
