import React, { useState } from 'react';
import {
  IMAGE_LAYOUT,
  SECTION_OPTIONS,
  SECTION_LABELS,
  type BannerFormData,
} from './bannerFormConfig';
import Input, { Select, Textarea } from '../../ui/Input';
import Button from '../../ui/Button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface BannerFormProps {
  initial?: Partial<BannerFormData>;
  onSubmit: (data: BannerFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

function ImageUploadField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    // Use object URL for preview — actual upload URL to be pasted manually
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#4e6175]">{label}</label>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden aspect-video bg-[#edf4ff]">
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onChange('')}
              className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center text-red-500 hover:bg-white"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          className={`rounded-xl border-2 border-dashed p-6 flex flex-col items-center gap-2 transition-all duration-200 ${
            dragOver ? 'border-[#0058cd] bg-[#d9eaff]' : 'border-[rgba(160,180,203,0.4)] bg-[#f8fbff]'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-[#edf4ff] flex items-center justify-center">
            <ImageIcon size={18} className="text-[#0058cd]" />
          </div>
          <p className="text-xs text-[#4e6175] text-center">
            Drag & drop or paste an image URL below
          </p>
        </div>
      )}
      <Input
        placeholder="Paste image URL..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        hint={hint}
      />
    </div>
  );
}

export default function BannerForm({
  initial = {},
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = 'Save Banner',
}: BannerFormProps) {
  const [form, setForm] = useState<BannerFormData>({
    section: 'HERO',
    title: '',
    subtitle: '',
    desktopImageUrl: '',
    mobileImageUrl: '',
    ctaText: '',
    redirectUrl: '',
    displayOrder: 0,
    isActive: true,
    startDate: '',
    endDate: '',
    ...initial,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BannerFormData, string>>>({});

  const set = <K extends keyof BannerFormData>(key: K, val: BannerFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const validate = (): boolean => {
    const errs: Partial<Record<keyof BannerFormData, string>> = {};
    if (!form.section) errs.section = 'Section is required';
    if (!form.desktopImageUrl) errs.desktopImageUrl = 'Desktop image URL is required';
    if (form.displayOrder < 0) errs.displayOrder = 'Display order must be ≥ 0';
    if (form.startDate && form.endDate && form.startDate >= form.endDate) {
      errs.endDate = 'End date must be after start date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Section + Active */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          id="banner-section"
          label="Section"
          required
          value={form.section}
          onChange={(e) => set('section', e.target.value as BannerFormData['section'])}
          options={SECTION_OPTIONS}
          placeholder="Select section"
          error={errors.section}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#4e6175]">Status</label>
          <div className="flex items-center gap-3 bg-white rounded-xl border border-[rgba(160,180,203,0.4)] px-3.5 py-2.5 h-[42px]">
            <button
              type="button"
              role="switch"
              aria-checked={form.isActive}
              onClick={() => set('isActive', !form.isActive)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                form.isActive ? 'bg-[#0058cd]' : 'bg-[#d1dce8]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  form.isActive ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-sm text-[#213447]">{form.isActive ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </div>

      {/* Title + Subtitle */}
      <Input
        id="banner-title"
        label="Title"
        placeholder="e.g. Summer Collection"
        value={form.title}
        onChange={(e) => set('title', e.target.value)}
      />
      <Input
        id="banner-subtitle"
        label="Subtitle"
        placeholder="e.g. Up to 40% Off"
        value={form.subtitle}
        onChange={(e) => set('subtitle', e.target.value)}
      />

      {/* Images */}
      <ImageUploadField
        label="Desktop Image URL *"
        value={form.desktopImageUrl}
        onChange={(url) => set('desktopImageUrl', url)}
        hint={IMAGE_LAYOUT[form.section]?.desktop}
      />
      {errors.desktopImageUrl && (
        <p className="text-xs text-[#a83836] -mt-3">{errors.desktopImageUrl}</p>
      )}

      <ImageUploadField
        label="Mobile Image URL (optional)"
        value={form.mobileImageUrl || ''}
        onChange={(url) => set('mobileImageUrl', url)}
        hint={IMAGE_LAYOUT[form.section]?.mobile}
      />

      {/* CTA + Redirect */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="banner-cta"
          label="CTA Text"
          placeholder="e.g. Shop Now"
          value={form.ctaText}
          onChange={(e) => set('ctaText', e.target.value)}
        />
        <Input
          id="banner-redirect"
          label="Redirect URL"
          placeholder="/products?category=summer"
          value={form.redirectUrl}
          onChange={(e) => set('redirectUrl', e.target.value)}
        />
      </div>

      {/* Display Order */}
      <Input
        id="banner-display-order"
        label="Display Order"
        type="number"
        min={0}
        value={String(form.displayOrder)}
        onChange={(e) => set('displayOrder', parseInt(e.target.value) || 0)}
        hint="Lower numbers appear first"
        error={errors.displayOrder}
      />

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="banner-start-date"
          label="Start Date (optional)"
          type="datetime-local"
          value={form.startDate || ''}
          onChange={(e) => set('startDate', e.target.value)}
        />
        <Input
          id="banner-end-date"
          label="End Date (optional)"
          type="datetime-local"
          value={form.endDate || ''}
          onChange={(e) => set('endDate', e.target.value)}
          error={errors.endDate}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 border-t border-[rgba(160,180,203,0.2)]">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
