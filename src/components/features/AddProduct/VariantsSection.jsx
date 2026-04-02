// src/components/features/AddProduct/VariantsSection.jsx
import React, { useState } from 'react';
import Card, { CardHeader } from '../../ui/Card';
import Button from '../../ui/Button';
import { Layers, Plus, X, Check } from 'lucide-react';

const SIZE_GROUPS = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  shoes: ['6', '7', '8', '9', '10', '11', '12', '13'],
  generic: ['One Size'],
};

const COLORS = [
  { label: 'Midnight Black', hex: '#1a1a2e' },
  { label: 'Pearl White', hex: '#f8f8f8' },
  { label: 'Ocean Blue', hex: '#0058cd' },
  { label: 'Forest Green', hex: '#1a6b42' },
  { label: 'Crimson Red', hex: '#a83836' },
  { label: 'Warm Sand', hex: '#c8a97a' },
  { label: 'Slate Gray', hex: '#697d92' },
  { label: 'Rose Gold', hex: '#d4a5a0' },
];

export default function VariantsSection({ data, onChange }) {
  const [activeGroup, setActiveGroup] = useState('clothing');
  const [customColor, setCustomColor] = useState('');
  const [customSize, setCustomSize] = useState('');

  const toggleSize = (size) => {
    const next = data.sizes.includes(size)
      ? data.sizes.filter(s => s !== size)
      : [...data.sizes, size];
    onChange({ ...data, sizes: next });
  };

  const toggleColor = (color) => {
    const exists = data.colors.find(c => c.hex === color.hex);
    const next = exists
      ? data.colors.filter(c => c.hex !== color.hex)
      : [...data.colors, color];
    onChange({ ...data, colors: next });
  };

  const addCustomColor = () => {
    if (!customColor.trim()) return;
    const newColor = { label: customColor, hex: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0') };
    onChange({ ...data, colors: [...data.colors, newColor] });
    setCustomColor('');
  };

  const addCustomSize = () => {
    if (!customSize.trim() || data.sizes.includes(customSize.toUpperCase())) return;
    onChange({ ...data, sizes: [...data.sizes, customSize.toUpperCase()] });
    setCustomSize('');
  };

  return (
    <Card className="animate-fade-slide-up delay-100">
      <CardHeader
        icon={Layers}
        title="Variants & Sizes"
        subtitle="Define color options and size availability for this product"
      />

      {/* Size Group Tabs */}
      <div className="mb-5">
        <p className="text-xs font-medium text-[#4e6175] mb-3">Size Guide</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {Object.keys(SIZE_GROUPS).map(group => (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 capitalize ${activeGroup === group
                ? 'bg-[#0058cd] text-white shadow-sm'
                : 'bg-[#edf4ff] text-[#4e6175] hover:bg-[#d9eaff]'
                }`}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Size Chips */}
        <div className="flex flex-wrap gap-2">
          {SIZE_GROUPS[activeGroup].map(size => {
            const isSelected = data.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`
                  w-12 h-10 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center
                  ${isSelected
                    ? 'bg-[#0058cd] text-white shadow-sm scale-105'
                    : 'bg-[#edf4ff] text-[#4e6175] hover:bg-[#d9eaff]'
                  }
                `}
              >
                {isSelected ? <Check size={14} /> : size}
              </button>
            );
          })}

          {/* Custom Size Input */}
          <div className="flex gap-1">
            <input
              type="text"
              value={customSize}
              onChange={e => setCustomSize(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomSize()}
              placeholder="Other"
              className="w-16 h-10 rounded-xl bg-[#edf4ff] border border-transparent focus:border-[rgba(0,88,205,0.4)] px-2 text-xs text-[#213447] outline-none text-center"
            />
            <button
              onClick={addCustomSize}
              className="w-10 h-10 rounded-xl bg-[#edf4ff] text-[#697d92] hover:bg-[#d9eaff] hover:text-[#0058cd] flex items-center justify-center transition-all"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {data.sizes.length > 0 && (
          <p className="text-xs text-[#4e6175] mt-2">
            Selected: <span className="text-[#0058cd] font-medium">{data.sizes.join(', ')}</span>
          </p>
        )}
      </div>

      {/* Color Picker */}
      <div>
        <p className="text-xs font-medium text-[#4e6175] mb-3">Color Options</p>
        <div className="flex flex-wrap gap-3">
          {COLORS.map(color => {
            const isSelected = data.colors.find(c => c.hex === color.hex);
            return (
              <button
                key={color.hex}
                onClick={() => toggleColor(color)}
                title={color.label}
                className={`
                  relative w-9 h-9 rounded-full transition-all duration-200
                  ${isSelected ? 'ring-2 ring-offset-2 ring-[#0058cd] scale-110' : 'hover:scale-110'}
                `}
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check size={14} className="text-white drop-shadow" />
                  </span>
                )}
              </button>
            );
          })}

          {/* Custom Color */}
          <div className="relative">
            <input
              type="color"
              className="w-9 h-9 rounded-full cursor-pointer border-2 border-dashed border-[#a0b4cb] p-0.5"
              title="Pick custom color"
              onChange={e => toggleColor({ label: 'Custom', hex: e.target.value })}
            />
          </div>
        </div>

        {data.colors.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {data.colors.map(c => (
              <span key={c.hex} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#edf4ff] text-xs text-[#213447]">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.hex }} />
                {c.label}
                <button onClick={() => toggleColor(c)} className="text-[#697d92] hover:text-[#a83836]">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Material / Notes */}
      <div className="mt-5 p-4 rounded-xl bg-[#edf4ff]">
        <p className="text-xs font-medium text-[#4e6175] mb-2">Material / Composition Notes</p>
        <textarea
          rows={2}
          value={data.material}
          onChange={e => onChange({ ...data, material: e.target.value })}
          placeholder="e.g. 100% organic cotton shell, recycled polyester lining..."
          className="w-full bg-transparent outline-none text-sm text-[#213447] placeholder:text-[#a0b4cb] resize-none"
        />
      </div>
    </Card>
  );
}
