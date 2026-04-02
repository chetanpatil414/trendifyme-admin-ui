import React, { useState } from 'react';
import { RefreshCw, Play, Info } from 'lucide-react';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import ConfirmationModal from '../../ui/ConfirmationModal';
import { AttributeGroupUI } from '../../../types/ui';

interface VariantActionsProps {
  attributes: AttributeGroupUI[];
  hasVariants: boolean;
  onGenerate: () => void;
  onRegenerateSkus: () => void;
}

export default function VariantActions({
  attributes,
  hasVariants,
  onGenerate,
  onRegenerateSkus
}: VariantActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canGenerate = attributes.length > 0 && attributes.every(a => a.values.length > 0);

  const handleRegenerateClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmRegenerate = () => {
    onRegenerateSkus();
    setIsModalOpen(false);
  };

  return (
    <Card className="mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[#213447]">Variant Generation</h3>
          <p className="text-xs text-[#4e6175] mt-1">
            {canGenerate 
              ? "Generate all possible combinations of attributes below." 
              : "Add attribute groups and values to enable generation."}
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="primary"
              onClick={onGenerate}
              disabled={!canGenerate}
              icon={Play}
              fullWidth
            >
              Generate Variants
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleRegenerateClick}
              disabled={!hasVariants}
              icon={RefreshCw}
              fullWidth
            >
              Auto-fill SKU
            </Button>
          </div>
          
          {!canGenerate && (
            <div className="flex items-center gap-1.5 px-2 text-[10px] font-medium text-[#4e6175] animate-fade-slide-up">
              <Info size={12} className="text-[#0058cd]" />
              <span>Add at least one value to each attribute group to generate variants.</span>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Regenerate SKUs?"
        message="Regenerating SKUs will overwrite your manual changes for all variants that haven't been locked. Are you sure you want to continue?"
        confirmLabel="Regenerate ALL"
        cancelLabel="Keep Current"
        onConfirm={handleConfirmRegenerate}
        onCancel={() => setIsModalOpen(false)}
      />
    </Card>
  );
}
