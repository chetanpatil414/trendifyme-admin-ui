// src/components/features/AddProduct/ValueStockSection.tsx
import React from 'react';
import Card, { CardHeader, SectionDivider } from '../../ui/Card';
import Input, { Select } from '../../ui/Input';
import { DollarSign, TrendingDown, Package, AlertCircle } from 'lucide-react';
import { Product } from '../../../types/product';

interface ValueStockSectionProps {
  data: Partial<Product> & {
    price?: string;
    comparePrice?: string;
    costPrice?: string;
    stock?: string;
    currency?: string;
    lowStockAlert?: string;
    weight?: string;
    dimensions?: string;
  };
  onChange: (data: any) => void;
  errors?: Record<string, string>;
  hasVariants?: boolean;
}

const currencyOptions = [
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
  { value: 'GBP', label: '£ GBP' },
  { value: 'INR', label: '₹ INR' },
  { value: 'JPY', label: '¥ JPY' },
];

export default function ValueStockSection({ data, onChange, errors, hasVariants = false }: ValueStockSectionProps) {
  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => 
    onChange({ ...data, [field]: e.target.value });

  const discount = data.price && data.comparePrice
    ? Math.round((1 - parseFloat(data.price) / parseFloat(data.comparePrice)) * 100)
    : null;

  const isLowStock = parseInt(data.stock || '0') > 0 && parseInt(data.stock || '0') <= parseInt(data.lowStockAlert || '10');

  // If variants exist, price and stock are usually managed per-variant in the table.
  // However, we might still want to capture base settings or cost.
  
  return (
    <Card className="animate-fade-slide-up delay-300" id="section-value">
      <CardHeader
        icon={DollarSign}
        title="Value & Stock"
        subtitle={hasVariants ? "Global defaults used for variant generation" : "Set pricing, discount strategies, and inventory levels"}
      />

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            id="currency"
            label="Currency"
            options={currencyOptions}
            value={data.currency || 'USD'}
            onChange={update('currency')}
          />
          <Input
            id="sale-price"
            label="Base Price"
            required
            type="number"
            placeholder="0.00"
            prefix={data.currency === 'EUR' ? '€' : data.currency === 'GBP' ? '£' : data.currency === 'INR' ? '₹' : '$'}
            value={data.price || ''}
            onChange={update('price')}
            error={errors?.['price']}
          />
          <Input
            id="compare-price"
            label="Compare Price"
            type="number"
            placeholder="0.00"
            prefix={data.currency === 'EUR' ? '€' : data.currency === 'GBP' ? '£' : data.currency === 'INR' ? '₹' : '$'}
            value={data.comparePrice || ''}
            onChange={update('comparePrice')}
            error={errors?.['comparePrice']}
            hint="Must be higher"
          />
        </div>

        {discount !== null && discount > 0 && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#d4f0e0]">
            <TrendingDown size={16} className="text-[#1a6b42]" />
            <p className="text-sm font-semibold text-[#1a6b42]">
              {discount}% discount applied
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="cost-price"
            label="Cost Per Item"
            type="number"
            placeholder="0.00"
            prefix="$"
            value={data.costPrice || ''}
            onChange={update('costPrice')}
            hint="For margin calculation"
          />
          <Input
            id="stock-qty"
            label="Initial Stock"
            required
            type="number"
            placeholder="0"
            value={data.stock || ''}
            onChange={update('stock')}
            error={errors?.['stock']}
            suffix="units"
          />
        </div>
      </div>

      <SectionDivider label="Logistics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="weight"
          label="Weight"
          type="number"
          placeholder="0.0"
          value={data.weight || ''}
          onChange={update('weight')}
          suffix="kg"
        />
        <Input
          id="dimensions"
          label="Dimensions (L × W × H)"
          placeholder="30 × 20 × 10"
          value={data.dimensions || ''}
          onChange={update('dimensions')}
          suffix="cm"
        />
      </div>
    </Card>
  );
}
