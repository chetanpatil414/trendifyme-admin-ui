// src/pages/AddProductPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { ToastContainer } from '../components/ui/Toast';
import BasicInfoSection from '../components/features/AddProduct/BasicInfoSection';
import VariantsSection from '../components/features/AddProduct/VariantsSection';
import MediaUploadSection from '../components/features/AddProduct/MediaUploadSection';
import ValueStockSection from '../components/features/AddProduct/ValueStockSection';
import ClassificationSection from '../components/features/AddProduct/ClassificationSection';
import { useProductForm } from '../hooks/useProductForm';
import {
  Save, RotateCcw, Eye, CheckCircle2,
  FileText, Layers, Image, DollarSign, Tag
} from 'lucide-react';

const STEPS = [
  { id: 'basic', label: 'Basic Info', Icon: FileText },
  { id: 'variants', label: 'Variants', Icon: Layers },
  { id: 'media', label: 'Media', Icon: Image },
  { id: 'value', label: 'Value & Stock', Icon: DollarSign },
  { id: 'classification', label: 'Classification', Icon: Tag },
];

function CompletionMeter({ score }) {
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
      <p className="text-[10px] text-[#697d92] mt-1">
        {score < 50 ? 'Add more details to improve discoverability' :
          score < 80 ? 'Looking good! A few more fields to go' :
            'Great product profile!'}
      </p>
    </div>
  );
}

function QuickNav({ activeSection, onJump }) {
  return (
    <nav className="flex flex-col gap-1">
      {STEPS.map((step, i) => (
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
  const { form, update, errors, submitting, toasts, removeToast, handleSubmit, handleReset, completionScore } = useProductForm(() => navigate('/products'));
  const [activeSection, setActiveSection] = React.useState('basic');

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="md" icon={Eye}>Preview</Button>
      <Button variant="outline" size="md" icon={RotateCcw} onClick={handleReset}>Reset</Button>
      <Button
        variant="primary"
        size="md"
        icon={submitting ? undefined : Save}
        loading={submitting}
        onClick={handleSubmit}
      >
        {submitting ? 'Publishing...' : 'Publish Product'}
      </Button>
    </div>
  );

  return (
    <Layout
      breadcrumbs={['Products', 'Add New Product']}
      headerActions={headerActions}
      activeNav="products"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Title */}
        <div className="mb-8 animate-fade-slide-up">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#213447] leading-tight">Add New Product</h1>
              <p className="text-sm text-[#4e6175] mt-1">
                Configure your product catalog with precision and clarity.
              </p>
            </div>
            {/* Mobile save button */}
            <div className="flex lg:hidden gap-2">
              <Button
                variant="primary"
                size="sm"
                icon={Save}
                loading={submitting}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-start">

          {/* ── Main Form Column ─────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6">

            <div id="section-basic">
              <BasicInfoSection data={form.basic} onChange={update('basic')} errors={errors} />
            </div>

            <div id="section-variants">
              <VariantsSection data={form.variants} onChange={update('variants')} errors={errors} />
            </div>

            <div id="section-media">
              <MediaUploadSection data={form.media} onChange={update('media')} errors={errors} />
            </div>

            <div id="section-value">
              <ValueStockSection data={form.value} onChange={update('value')} errors={errors} />
            </div>

            <div id="section-classification">
              <ClassificationSection data={form.classification} onChange={update('classification')} errors={errors} />
            </div>

            {/* Bottom Action Bar */}
            <div className="sticky bottom-6 z-10">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl card-shadow p-4 flex items-center justify-between gap-4 border border-[rgba(160,180,203,0.15)]">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#edf4ff] flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-[#0058cd]" />
                  </div>
                  <p className="text-xs text-[#4e6175]">
                    <span className="font-semibold text-[#213447]">{completionScore}% complete</span> — {completionScore < 80 ? 'add more details before publishing' : 'ready to publish!'}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Button variant="ghost" size="md" onClick={handleReset}>Discard</Button>
                  <Button variant="secondary" size="md">Save Draft</Button>
                  <Button
                    variant="primary"
                    size="md"
                    icon={submitting ? undefined : Save}
                    loading={submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? 'Publishing...' : 'Publish Product'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ─────────────────────────────────────── */}
          <div className="hidden xl:flex flex-col w-56 flex-shrink-0 sticky top-20 gap-4">

            {/* Completion Meter */}
            <div className="bg-white rounded-2xl card-shadow p-4 animate-slide-in-left">
              <CompletionMeter score={completionScore} />
              <QuickNav activeSection={activeSection} onJump={scrollToSection} />
            </div>

            {/* Tips */}
            <div className="bg-[#edf4ff] rounded-2xl p-4 animate-slide-in-left delay-100">
              <p className="text-xs font-semibold text-[#0058cd] mb-2">💡 Pro Tips</p>
              <ul className="space-y-2">
                {[
                  'Use 4–8 high-quality images for best conversion',
                  'Products with compare prices get 23% more clicks',
                  'Add 5+ tags to improve search visibility',
                ].map((tip, i) => (
                  <li key={i} className="flex gap-2 text-xs text-[#4e6175] leading-relaxed">
                    <span className="text-[#0058cd] font-bold flex-shrink-0">·</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </Layout>
  );
}
