import React from 'react';
import { AlertCircle, Trash2, Package, Inbox } from 'lucide-react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Card from '../../ui/Card';
import { VariantRowUI, AttributeGroupUI } from '../../../types/ui';
import VariantCard from './VariantCard';
import { ValidationResult } from '../../../utils/validation';

interface VariantTableProps {
  variants: VariantRowUI[];
  attributes: AttributeGroupUI[];
  validation: ValidationResult;
  onUpdatePrice: (index: number, price: number) => void;
  onUpdateStock: (index: number, stock: number) => void;
  onUpdateSku: (index: number, sku: string) => void;
  onRemoveVariant: (index: number) => void;
}

export default function VariantTable({
  variants,
  attributes,
  validation,
  onUpdatePrice,
  onUpdateStock,
  onUpdateSku,
  onRemoveVariant,
}: VariantTableProps) {
  if (variants.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center animate-fade-slide-up">
        <div className="w-16 h-16 rounded-3xl bg-[#edf4ff] flex items-center justify-center text-[#0058cd] mb-6">
          <Inbox size={32} />
        </div>
        <h4 className="text-lg font-bold text-[#213447] mb-2">No variants generated yet</h4>
        <p className="text-sm text-[#4e6175] max-w-sm">
          Add attribute groups and values above, then click "Generate Variants" to populate this table.
        </p>
      </Card>
    );
  }

  return (
    <Card noPad className="overflow-hidden border border-[#edf4ff]">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#f7f9ff] border-b border-[#edf4ff]">
              <th className="px-6 py-4 text-[10px] font-bold text-[#697d92] uppercase tracking-wider w-16">Status</th>
              {attributes.map(attr => (
                <th key={attr.id} className="px-6 py-4 text-[10px] font-bold text-[#697d92] uppercase tracking-wider">
                  {attr.name}
                </th>
              ))}
              <th className="px-6 py-4 text-[10px] font-bold text-[#697d92] uppercase tracking-wider min-w-[200px]">SKU</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#697d92] uppercase tracking-wider w-32">Price ($)</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#697d92] uppercase tracking-wider w-32">Stock</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#697d92] uppercase tracking-wider w-16 text-center text-xs">Action</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant, idx) => {
              const rowErrors = validation.errors.variants[idx] || [];
              const hasErrors = rowErrors.length > 0;

              return (
                <tr 
                  key={variant.id} 
                  className={`
                    border-b border-[#edf4ff] hover:bg-[#fcfdff] transition-colors
                    ${hasErrors ? 'bg-[#fff7f6]/40' : ''}
                  `}
                  data-testid={`variant-row-${idx}`}
                >
                  <td className="px-6 py-4">
                    {hasErrors ? (
                      <div className="relative group">
                        <AlertCircle size={18} className="text-[#a83836] animate-pulse" />
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-[#060f18] text-white text-[10px] p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                          {rowErrors.map((err, i) => <div key={i}>{err}</div>)}
                        </div>
                      </div>
                    ) : (rowErrors.length === 0 && variant.sku) ? (
                      <Badge variant="success" size="sm" dot>Ready</Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">Draft</Badge>
                    )}
                  </td>
                  
                  {attributes.map(attr => (
                    <td key={attr.id} className="px-6 py-4">
                      <span className="text-sm font-medium text-[#213447]">
                        {variant.attributes[attr.name.toLowerCase()] || '-'}
                      </span>
                    </td>
                  ))}

                  <td className="px-6 py-4">
                    <div className="relative">
                      <Input
                        value={variant.sku}
                        onChange={(e) => onUpdateSku(idx, e.target.value)}
                        placeholder="SKU Code"
                        errorMsg={rowErrors.find(e => e.toLowerCase().includes('sku'))}
                        className="w-full"
                        data-testid={`variant-sku-${idx}`}
                      />
                      {variant.isSkuEdited && (
                        <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center p-0.5 bg-[#e1c8f8] rounded-full" title="Manually edited">
                          <Badge variant="purple" size="sm" dot className="px-0 py-0 h-2 w-2" children={undefined} />
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        onUpdatePrice(idx, isNaN(val) ? 0 : Math.max(0, val));
                      }}
                      errorMsg={rowErrors.find(e => e.toLowerCase().includes('price'))}
                      className="w-full"
                      data-testid={`variant-price-${idx}`}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <Input
                      type="number"
                      min="0"
                      value={variant.inventoryQuantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        onUpdateStock(idx, isNaN(val) ? 0 : Math.max(0, val));
                      }}
                      errorMsg={rowErrors.find(e => e.toLowerCase().includes('stock') || e.toLowerCase().includes('inventory'))}
                      className="w-full"
                      data-testid={`variant-stock-${idx}`}
                    />
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onRemoveVariant(idx)}
                      className="p-2 text-[#a0b4cb] hover:text-[#a83836] transition-colors rounded-lg hover:bg-[#fff7f6]"
                      aria-label="Delete variant"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked View */}
      <div className="block md:hidden p-4 space-y-4 bg-[#fcfdff]">
        {variants.map((variant, idx) => (
          <VariantCard
            key={variant.id}
            variant={variant}
            attributes={attributes}
            errors={validation.errors.variants[idx] || []}
            onUpdatePrice={(price) => onUpdatePrice(idx, price)}
            onUpdateStock={(stock) => onUpdateStock(idx, stock)}
            onUpdateSku={(sku) => onUpdateSku(idx, sku)}
            onRemove={() => onRemoveVariant(idx)}
          />
        ))}
      </div>
      
      <div className="px-6 py-4 bg-[#fcfdff] border-t border-[#edf4ff] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package size={16} className="text-[#697d92]" />
          <span className="text-xs font-semibold text-[#213447]">
            {variants.length} Variant{variants.length !== 1 ? 's' : ''} Generated
          </span>
        </div>
        <p className="text-[10px] text-[#697d92] italic lg:block hidden">
          Tip: Use tab key to navigate quickly between fields.
        </p>
      </div>
    </Card>
  );
}
