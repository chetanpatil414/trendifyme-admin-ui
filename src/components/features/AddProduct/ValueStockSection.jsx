// src/components/features/AddProduct/ValueStockSection.jsx
import React from 'react';
import Card, { CardHeader, SectionDivider } from '../../ui/Card';
import Input from '../../ui/Input';
import { Select } from '../../ui/Input';
import { DollarSign, TrendingDown, Package, AlertCircle } from 'lucide-react';

const currencyOptions = [
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
  { value: 'GBP', label: '£ GBP' },
  { value: 'INR', label: '₹ INR' },
  { value: 'JPY', label: '¥ JPY' },
];

export default function ValueStockSection({ data, onChange, errors }) {
  const update = (field) => (e) => onChange({ ...data, [field]: e.target.value });

  const discount = data.price && data.comparePrice
    ? Math.round((1 - parseFloat(data.price) / parseFloat(data.comparePrice)) * 100)
    : null;

  const isLowStock = parseInt(data.stock) > 0 && parseInt(data.stock) <= parseInt(data.lowStockAlert || 10);

  return (
    <Card className="animate-fade-slide-up delay-300">
      <CardHeader
        icon={DollarSign}
        title="Value & Stock"
        subtitle="Set pricing, discount strategies, and inventory levels"
      />

      {/* Pricing */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            id="currency"
            label="Currency"
            options={currencyOptions}
            value={data.currency}
            onChange={update('currency')}
          />
          <Input
            id="sale-price"
            label="Sale Price"
            required
            type="number"
            placeholder="0.00"
            prefix={data.currency === 'EUR' ? '€' : data.currency === 'GBP' ? '£' : data.currency === 'INR' ? '₹' : '$'}
            value={data.price}
            onChange={update('price')}
            error={errors?.['value.price']}
          />
          <div>
            <Input
              id="compare-price"
              label="Compare-at Price"
              type="number"
              placeholder="0.00"
              prefix={data.currency === 'EUR' ? '€' : data.currency === 'GBP' ? '£' : data.currency === 'INR' ? '₹' : '$'}
              value={data.comparePrice}
              onChange={update('comparePrice')}
              error={errors?.['value.comparePrice']}
              hint="Must be higher than sale price"
            />
          </div>
        </div>

        {/* Discount Indicator */}
        {discount !== null && discount > 0 && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#d4f0e0]">
            <TrendingDown size={16} className="text-[#1a6b42]" />
            <p className="text-sm font-semibold text-[#1a6b42]">
              {discount}% discount applied
            </p>
            <span className="ml-auto text-xs text-[#1a6b42] bg-white/50 px-2 py-0.5 rounded-lg">
              Saving {data.currency === 'INR' ? '₹' : '$'}{(parseFloat(data.comparePrice) - parseFloat(data.price)).toFixed(2)}
            </span>
          </div>
        )}

        {/* Cost Price (optional) */}
        <Input
          id="cost-price"
          label="Cost Per Item (Internal)"
          type="number"
          placeholder="0.00"
          prefix="$"
          value={data.costPrice}
          onChange={update('costPrice')}
          hint="Your purchase price — not shown to customers. Used to calculate margin."
        />

        {data.price && data.costPrice && parseFloat(data.price) > parseFloat(data.costPrice) && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#edf4ff]">
            <div>
              <p className="text-xs text-[#4e6175]">Profit Margin</p>
              <p className="text-sm font-bold text-[#0058cd]">
                {Math.round((1 - parseFloat(data.costPrice) / parseFloat(data.price)) * 100)}%
              </p>
            </div>
            <div className="w-px h-8 bg-[#d9eaff]" />
            <div>
              <p className="text-xs text-[#4e6175]">Profit Per Item</p>
              <p className="text-sm font-bold text-[#213447]">
                ${(parseFloat(data.price) - parseFloat(data.costPrice)).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      <SectionDivider label="Inventory" />

      {/* Stock */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="stock-qty"
            label="Stock Quantity"
            required
            type="number"
            placeholder="0"
            value={data.stock}
            onChange={update('stock')}
            error={errors?.['value.stock']}
            suffix="units"
          />
          <Input
            id="low-stock-alert"
            label="Low Stock Alert At"
            type="number"
            placeholder="10"
            value={data.lowStockAlert}
            onChange={update('lowStockAlert')}
            suffix="units"
            hint="Get notified when stock falls below this threshold"
          />
        </div>

        {isLowStock && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#fff3d0]">
            <AlertCircle size={16} className="text-[#8a5a00]" />
            <p className="text-sm text-[#8a5a00] font-medium">
              Low stock warning — only {data.stock} units remaining
            </p>
          </div>
        )}

        {/* Shipping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="weight"
            label="Weight"
            type="number"
            placeholder="0.0"
            value={data.weight}
            onChange={update('weight')}
            suffix="kg"
          />
          <Input
            id="shipping-class"
            label="Dimensions (L × W × H)"
            placeholder="30 × 20 × 10"
            value={data.dimensions}
            onChange={update('dimensions')}
            suffix="cm"
          />
        </div>
      </div>
    </Card>
  );
}
