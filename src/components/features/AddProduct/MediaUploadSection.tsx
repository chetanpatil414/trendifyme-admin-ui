// src/components/features/AddProduct/MediaUploadSection.tsx
import React, { useCallback, useRef, useState } from 'react';
import Card, { CardHeader } from '../../ui/Card';
import Button from '../../ui/Button';
import { Upload, Image as ImageIcon, X, Star, MoveRight } from 'lucide-react';
import { Media } from '../../../types/product';

export interface ExtendedMedia extends Media {
  name: string;
  size: string;
  rawFile?: File;
}

interface MediaUploadSectionProps {
  data: { images: ExtendedMedia[] };
  onChange: (data: { images: ExtendedMedia[] }) => void;
  errors?: Record<string, string>;
}

export default function MediaUploadSection({ data, onChange, errors }: MediaUploadSectionProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: ExtendedMedia[] = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        type: 'image',
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        rawFile: file,
        isPrimary: data.images.length === 0,
      }));
    onChange({ ...data, images: [...data.images, ...newImages] });
  }, [data, onChange]);

  const removeImage = (id: string) => {
    const filtered = data.images.filter(img => img.id !== id);
    if (filtered.length > 0 && !filtered.some(i => i.isPrimary)) {
      filtered[0] = { ...filtered[0], isPrimary: true };
    }
    onChange({ ...data, images: filtered });
  };

  const setPrimary = (id: string) => {
    onChange({
      ...data,
      images: data.images.map(img => ({ ...img, isPrimary: img.id === id })),
    });
  };

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <Card className="animate-fade-slide-up delay-200" id="section-media">
      <CardHeader
        icon={ImageIcon}
        title="Media Upload"
        subtitle="Add high-quality images to showcase your product. First image becomes the cover."
      />

      {dragging && <div className="fixed inset-0 bg-[#0058cd]/10 backdrop-blur-sm z-50 pointer-events-none border-4 border-dashed border-[#0058cd]" />}

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`upload-area rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${dragging ? 'bg-[#d9eaff] border-[#0058cd]' : 'border-dashed border-2 border-[#edf4ff]'}`}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${dragging ? 'bg-[#0058cd] text-white scale-110' : 'bg-[#edf4ff] text-[#0058cd]'}`}>
          <Upload size={22} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#213447]">
            {dragging ? 'Drop images here' : 'Drag & drop product images'}
          </p>
          <p className="text-xs text-[#4e6175] mt-1">
            or <span className="text-[#0058cd] font-medium">browse files</span> — PNG, JPG, WEBP up to 10MB each
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {data.images.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-[#4e6175]">
              {data.images.length} image{data.images.length > 1 ? 's' : ''} added
            </p>
            <p className="text-xs text-[#4e6175] flex items-center gap-1">
              <Star size={10} className="text-[#0058cd] fill-[#0058cd]" />
              = Cover image
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {data.images.map((img) => (
              <div
                key={img.id}
                className={`relative group rounded-xl overflow-hidden aspect-square bg-[#edf4ff] transition-all duration-200 ${img.isPrimary ? 'ring-2 ring-[#0058cd]' : 'ring-1 ring-[#edf4ff]'}`}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setPrimary(img.id); }}
                    className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center text-[#0058cd] hover:bg-white shadow-sm"
                    aria-label="Set as primary"
                  >
                    <Star size={14} className={img.isPrimary ? 'fill-[#0058cd]' : ''} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                    className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center text-[#a83836] hover:bg-white shadow-sm"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>

                {img.isPrimary && (
                  <div className="absolute top-1.5 left-1.5">
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-[#0058cd] rounded-md text-white text-[10px] font-semibold shadow-sm">
                      <Star size={8} className="fill-white" /> Cover
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <input
          type="url"
          placeholder="Or paste an image URL..."
          className="flex-1 bg-[#edf4ff] rounded-xl px-3.5 py-2.5 text-sm text-[#213447] placeholder:text-[#a0b4cb] outline-none border border-transparent focus:border-[rgba(0,88,205,0.3)] transition-all"
          onKeyDown={(e) => {
            const target = e.target as HTMLInputElement;
            if (e.key === 'Enter' && target.value.startsWith('http')) {
              onChange({
                ...data,
                images: [...data.images, {
                  id: crypto.randomUUID(),
                  url: target.value,
                  type: 'image',
                  name: 'External Image',
                  size: '—',
                  isPrimary: data.images.length === 0,
                }],
              });
              target.value = '';
            }
          }}
        />
        <Button variant="secondary" icon={MoveRight}>Add URL</Button>
      </div>
    </Card>
  );
}
