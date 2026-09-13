import React from 'react';
import { Trash2, AlertCircle, Tag, DollarSign, Box } from 'lucide-react';
import Input from '../../ui/Input';
import Badge from '../../ui/Badge';
import { VariantRowUI, AttributeGroupUI } from '../../../types/ui';

interface VariantCardProps {
  variant: VariantRowUI;
  attributes: AttributeGroupUI[];
  errors: string[];
  onUpdatePrice: (price: number) => void;
  onUpdateStock: (stock: number) => void;
  onUpdateSku: (sku: string) => void;
  onRemove: () => void;
}

export default function VariantCard({
  variant,
  attributes,
  errors,
  onUpdatePrice,
  onUpdateStock,
  onUpdateSku,
  onRemove,
}: VariantCardProps) {
  const hasErrors = errors.length > 0;
  const errorMsg = errors.join(', ');

  return (
    <div 
      className={`
        p-5 rounded-2xl border transition-all duration-200 bg-white
        ${hasErrors ? 'border-[#a83836] shadow-[0_0_15px_rgba(168,56,54,0.05)]' : 'border-[#edf4ff] hover:shadow-md'}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2 max-w-[80%]">
          {attributes.map(attr => {
            const val = variant.attributes[attr.name.toLowerCase()];
            return val ? (
              <Badge key={attr.id} variant="neutral" size="sm">
                <span className="opacity-60 mr-1">{attr.name}:</span>
                <span className="font-bold">{val.displayValue}</span>
              </Badge>
            ) : null;
          })}
        </div>
        <button
          onClick={onRemove}
          className="w-11 h-11 flex items-center justify-center text-[#a0b4cb] hover:text-[#a83836] hover:bg-[#fff7f6] rounded-xl transition-colors shrink-0"
          aria-label="Delete variant"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            id={`${variant.id}-sku`}
            label="SKU Code"
            icon={Tag}
            value={variant.sku}
            onChange={(e) => onUpdateSku(e.target.value)}
            placeholder="e.g. TSHIRT-RED-M"
            errorMsg={errors.find(e => e.toLowerCase().includes('sku'))}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id={`${variant.id}-price`}
            type="number"
            label="Price"
            prefix="$"
            value={variant.price}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onUpdatePrice(isNaN(val) ? 0 : val);
            }}
            errorMsg={errors.find(e => e.toLowerCase().includes('price'))}
            // Ensure inputs are large enough for touch targets
            style={{ minHeight: '44px' }}
          />
          <Input
            id={`${variant.id}-stock`}
            type="number"
            label="Stock"
            icon={Box}
            value={variant.inventoryQuantity}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              onUpdateStock(isNaN(val) ? 0 : val);
            }}
            errorMsg={errors.find(e => e.toLowerCase().includes('stock') || e.toLowerCase().includes('inventory'))}
            style={{ minHeight: '44px' }}
          />
        </div>

        {hasErrors && (
          <div className="mt-2 p-3 bg-[#fff7f6] rounded-lg border border-[#a83836]/10 flex items-center gap-2">
            <AlertCircle size={14} className="text-[#a83836] shrink-0" />
            <p className="text-[11px] text-[#a83836] font-medium leading-tight">
              {errorMsg}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
