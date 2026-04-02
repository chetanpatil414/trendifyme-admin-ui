// src/components/ui/Input.jsx
import React, { useState } from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  hint,
  required,
  prefix,
  suffix,
  icon: Icon,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-[#4e6175] flex items-center gap-1">
          {label}
          {required && <span className="text-[#0058cd]">*</span>}
        </label>
      )}
      <div className={`
        flex items-center gap-2 bg-white rounded-xl border px-3.5 py-2.5
        transition-all duration-200
        ${focused ? 'border-[rgba(0,88,205,0.4)] shadow-[0_0_0_3px_rgba(0,88,205,0.08)]' : 'border-[rgba(160,180,203,0.4)]'}
        ${error ? 'border-[#a83836] shadow-[0_0_0_3px_rgba(168,56,54,0.08)]' : ''}
      `}>
        {Icon && <Icon size={15} className="text-[#697d92] flex-shrink-0" />}
        {prefix && <span className="text-sm text-[#4e6175] flex-shrink-0">{prefix}</span>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent outline-none text-sm text-[#213447] placeholder:text-[#a0b4cb] min-w-0"
          {...props}
        />
        {suffix && <span className="text-sm text-[#4e6175] flex-shrink-0">{suffix}</span>}
      </div>
      {error && <p className="text-xs text-[#a83836] flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs text-[#4e6175]">{hint}</p>}
    </div>
  );
}

export function Textarea({
  label,
  id,
  placeholder,
  value,
  onChange,
  rows = 3,
  hint,
  error,
  required,
  className = '',
  maxLength,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const len = (value || '').length;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-[#4e6175] flex items-center gap-1">
          {label}
          {required && <span className="text-[#0058cd]">*</span>}
        </label>
      )}
      <div className={`
        bg-white rounded-xl border px-3.5 py-2.5
        transition-all duration-200
        ${focused ? 'border-[rgba(0,88,205,0.4)] shadow-[0_0_0_3px_rgba(0,88,205,0.08)]' : 'border-[rgba(160,180,203,0.4)]'}
        ${error ? 'border-[#a83836] shadow-[0_0_0_3px_rgba(168,56,54,0.08)]' : ''}
      `}>
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent outline-none text-sm text-[#213447] placeholder:text-[#a0b4cb] resize-none leading-relaxed"
          {...props}
        />
        {maxLength && (
          <div className="flex justify-end mt-1">
            <span className="text-xs text-[#4e6175]">{len}/{maxLength}</span>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-[#a83836] flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs text-[#4e6175]">{hint}</p>}
    </div>
  );
}

export function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder,
  required,
  error,
  hint,
  className = '',
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-[#4e6175] flex items-center gap-1">
          {label}
          {required && <span className="text-[#0058cd]">*</span>}
        </label>
      )}
      <div className={`
        relative bg-white rounded-xl border px-3.5 py-2.5
        transition-all duration-200
        ${focused ? 'border-[rgba(0,88,205,0.4)] shadow-[0_0_0_3px_rgba(0,88,205,0.08)]' : 'border-[rgba(160,180,203,0.4)]'}
        ${error ? 'border-[#a83836] shadow-[0_0_0_3px_rgba(168,56,54,0.08)]' : ''}
      `}>
        <select
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent outline-none text-sm text-[#213447] appearance-none cursor-pointer"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt =>
            typeof opt === 'string'
              ? <option key={opt} value={opt}>{opt}</option>
              : <option key={opt.value} value={opt.value}>{opt.label}</option>
          )}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="#697d92" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-[#a83836] flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs text-[#4e6175]">{hint}</p>}
    </div>
  );
}
