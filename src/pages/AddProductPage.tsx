// src/pages/AddProductPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { ToastContainer, ToastData } from '../components/ui/Toast';
import BasicInfoSection from '../components/features/AddProduct/BasicInfoSection';
import VariantsSection from '../components/features/AddProduct/VariantsSection';
import MediaUploadSection from '../components/features/AddProduct/MediaUploadSection';
import ValueStockSection from '../components/features/AddProduct/ValueStockSection';
import ClassificationSection from '../components/features/AddProduct/ClassificationSection';
import { useProductState } from '../hooks/useProductState';
import {
  Save, RotateCcw, Eye, CheckCircle2,
  FileText, Layers, Image, DollarSign, Tag
} from 'lucide-react';
import { mapToApiPayload } from '../utils/payloadMapper';
import { createProduct } from '../services/productService';
import { ExtendedMedia } from '../components/features/AddProduct/MediaUploadSection';

const STEPS = [
  { id: 'basic', label: 'Basic Info', Icon: FileText },
  { id: 'variants', label: 'Variants', Icon: Layers },
  { id: 'media', label: 'Media', Icon: Image },
  { id: 'value', label: 'Value & Stock', Icon: DollarSign },
  { id: 'classification', label: 'Classification', Icon: Tag },
];

function CompletionMeter({ score }: { score: number }) {
  const color = score >= 80 ? '#1a6b42' : score >= 50 ? '#0058cd' : '#8a5a00';
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-[#4e6175]">Profile Completeness</p>
        <span className="text-xs font-bold" style={{ color }}>{score}%</span>
      </div>
      <div className="h-1.5 bg-[#e3efff] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${score}%`, background: `linear-gradient(90deg, #0058cd, #4784fd)` }}
        />
      </div>
    </div>
  );
}

function QuickNav({ activeSection, onJump }: { activeSection: string, onJump: (id: string) => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {STEPS.map((step) => (
        <button
          key={step.id}
          onClick={() => onJump(step.id)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-200 ${activeSection === step.id
              ? 'bg-[#d9eaff] text-[#0058cd]'
              : 'text-[#4e6175] hover:bg-[#edf4ff]'
            }`}
        >
          <step.Icon size={14} className={activeSection === step.id ? 'text-[#0058cd]' : 'text-[#697d92]'} />
          <span className="text-xs font-medium">{step.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default function AddProductPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // NEW HOOK
  const productState = useProductState();
  const { 
    product, attributes, variants, media, validation, isStale,
    setProduct, setMedia, addAttribute, removeAttribute, addAttributeValue, 
    removeAttributeValue, generateVariants, regenerateAllSkus, 
    updateVariantPrice, updateVariantStock, updateVariantSku, removeVariant 
  } = productState;

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const addToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message: msg, type }]);
  };

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const validateMedia = (images: ExtendedMedia[]) => {
    if (images.length === 0) {
      addToast('At least one product image is required.', 'error');
      return false;
    }
    // MIME Verification
    const invalidFiles = images.filter(img => img.rawFile && !img.rawFile.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      addToast('Only image files (PNG, JPG, WEBP) are allowed.', 'error');
      return false;
    }
    // Size Verification (10MB max per file - as per UI hint)
    const oversizedFiles = images.filter(img => img.rawFile && img.rawFile.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      addToast('Some images exceed the 10MB limit.', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validation.isValid) {
      addToast('Validation failed. Check variants and SKU uniqueness.', 'error');
      return;
    }

    if (!validateMedia(media)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = mapToApiPayload(product, variants, media);
      const result = await createProduct(payload);
      
      addToast('Product Published Successfully!', 'success');
      setTimeout(() => navigate('/products'), 1500);
    } catch (error: any) {
      console.error(error);
      addToast(error.message || 'Failed to publish product. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all changes?')) {
      window.location.reload();
    }
  };

  // Simplified completion for the migration (can be refined later)
  const score = (product.name ? 25 : 0) + (product.categoryId ? 25 : 0) + (variants.length > 0 ? 25 : 0) + (media.length > 0 ? 25 : 0);

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button variant="ghost" icon={Eye}>Preview</Button>
      <Button variant="outline" icon={RotateCcw} onClick={handleReset}>Reset</Button>
      <Button
        variant="primary"
        icon={isSubmitting ? undefined : Save}
        loading={isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? 'Publishing...' : 'Publish Product'}
      </Button>
    </div>
  );

  return (
    <Layout
      breadcrumbs={['Products', 'Add New Product']}
      headerActions={headerActions}
      activeNav="products"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-slide-up">
        {/* Page Title */}
        <div className="mb-8 overflow-hidden">
          <h1 className="text-2xl font-bold text-[#213447]">Add New Product</h1>
          <p className="text-sm text-[#4e6175] mt-1">Configure your product catalog with precision and clarity.</p>
        </div>

        <div className="flex gap-8 items-start">
          <div className="flex-1 min-w-0 space-y-8 pb-32">
            <BasicInfoSection 
              data={product} 
              onChange={(p) => setProduct(prev => ({ ...prev, ...p }))} 
            />

            <VariantsSection 
              attributes={attributes}
              variants={variants}
              validation={validation}
              isStale={isStale}
              material={""} // Material note state could be added to hook
              onUpdateMaterial={() => {}}
              addAttribute={addAttribute}
              removeAttribute={removeAttribute}
              addAttributeValue={addAttributeValue}
              removeValue={removeAttributeValue}
              generateVariants={generateVariants}
              regenerateSkus={regenerateAllSkus}
              updatePrice={updateVariantPrice}
              updateStock={updateVariantStock}
              updateSku={updateVariantSku}
              removeVariant={removeVariant}
            />

            <MediaUploadSection 
              data={{ images: media }}
              onChange={(data) => setMedia(data.images)}
            />

            <ValueStockSection 
              data={product as any}
              onChange={(p) => setProduct(prev => ({ ...prev, ...p }))}
              hasVariants={variants.length > 0}
            />

            <ClassificationSection 
              data={product as any}
              onChange={(p) => setProduct(prev => ({ ...prev, ...p }))}
            />
          </div>

          <div className="hidden xl:flex flex-col w-56 flex-shrink-0 sticky top-20 gap-4">
            <div className="bg-white rounded-2xl card-shadow p-4">
              <CompletionMeter score={score} />
              <QuickNav activeSection={activeSection} onJump={scrollToSection} />
            </div>
            
            <div className="bg-[#edf4ff] rounded-2xl p-4">
              <p className="text-xs font-semibold text-[#0058cd] mb-2 tracking-tight flex items-center gap-1.5">
                <CheckCircle2 size={12} />
                Quality Tip
              </p>
              <p className="text-xs text-[#4e6175] leading-relaxed">
                Unique SKUs and high-quality images improve SEO rankings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </Layout>
  );
}
