// src/components/features/AddProduct/MediaUploadSection.jsx
import React, { useCallback, useRef, useState } from 'react';
import Card, { CardHeader } from '../../ui/Card';
import Button from '../../ui/Button';
import { Upload, Image, X, Star, MoveRight } from 'lucide-react';

export default function MediaUploadSection({ data, onChange }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFiles = useCallback((files) => {
    const newImages = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file), // Used explicitly just for local browser preview capability
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        rawFile: file, // ** CRITICAL **: Saving the raw browser File object to be appended to FormData! 
        isPrimary: data.images.length === 0,
      }));
    onChange({ ...data, images: [...data.images, ...newImages] });
  }, [data, onChange]);

  const removeImage = (id) => {
    const filtered = data.images.filter(img => img.id !== id);
    if (filtered.length > 0 && !filtered.some(i => i.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    onChange({ ...data, images: filtered });
  };

  const setPrimary = (id) => {
    onChange({
      ...data,
      images: data.images.map(img => ({ ...img, isPrimary: img.id === id })),
    });
  };

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <Card className="animate-fade-slide-up delay-200">
      <CardHeader
        icon={Image}
        title="Media Upload"
        subtitle="Add high-quality images to showcase your product. First image becomes the cover."
      />

      {/* Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`upload-area rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${dragging ? 'drag-over' : ''}`}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${dragging ? 'bg-[#d9eaff] scale-110' : 'bg-[#edf4ff]'}`}>
          <Upload size={22} className="text-[#0058cd]" />
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

      {/* Image Grid */}
      {data.images.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-[#4e6175]">
              {data.images.length} image{data.images.length > 1 ? 's' : ''} added
            </p>
            <p className="text-xs text-[#4e6175]">
              <Star size={10} className="inline text-[#0058cd] mr-1" />
              = Cover image
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {data.images.map((img) => (
              <div
                key={img.id}
                className={`relative group rounded-xl overflow-hidden aspect-square bg-[#edf4ff] transition-all duration-200 ${img.isPrimary ? 'ring-2 ring-[#0058cd]' : ''}`}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); setPrimary(img.id); }}
                    title="Set as cover"
                    className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-[#0058cd] hover:bg-white"
                  >
                    <Star size={13} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                    title="Remove"
                    className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-[#a83836] hover:bg-white"
                  >
                    <X size={13} />
                  </button>
                </div>

                {/* Primary Badge */}
                {img.isPrimary && (
                  <div className="absolute top-1.5 left-1.5">
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-[#0058cd] rounded-md text-white text-[10px] font-semibold">
                      <Star size={8} /> Cover
                    </span>
                  </div>
                )}

                {/* File info */}
                <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all">
                  <p className="text-white text-[10px] truncate">{img.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* URL Input */}
      <div className="mt-4 flex gap-2">
        <input
          type="url"
          placeholder="Or paste an image URL..."
          className="flex-1 bg-[#edf4ff] rounded-xl px-3.5 py-2.5 text-sm text-[#213447] placeholder:text-[#a0b4cb] outline-none focus:ring-2 focus:ring-[rgba(0,88,205,0.2)] border border-transparent focus:border-[rgba(0,88,205,0.3)]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value.startsWith('http')) {
              onChange({
                ...data,
                images: [...data.images, {
                  id: crypto.randomUUID(),
                  url: e.target.value,
                  name: 'External Image',
                  size: '—',
                  isPrimary: data.images.length === 0,
                }],
              });
              e.target.value = '';
            }
          }}
        />
        <Button variant="secondary" size="md" icon={MoveRight}>Add URL</Button>
      </div>
    </Card>
  );
}
