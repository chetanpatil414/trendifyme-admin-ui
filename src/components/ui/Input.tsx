// src/components/ui/Input.tsx
import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, useState, ElementType } from 'react';

interface BaseInputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ElementType;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  errorMsg?: string;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseInputProps {}

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
  errorMsg,
  className = '',
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const errorId = id ? `${id}-error` : undefined;

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
          aria-invalid={!!errorMsg}
          aria-describedby={errorMsg ? errorId : undefined}
          {...props}
        />
        {suffix && <span className="text-sm text-[#4e6175] flex-shrink-0">{suffix}</span>}
      </div>
      {error && <p className="text-xs text-[#a83836] flex items-center gap-1">{error}</p>}
      {errorMsg && <p id={errorId} className="text-xs text-[#a83836] flex items-center gap-1 animate-fade-in">{errorMsg}</p>}
      {hint && !error && !errorMsg && <p className="text-xs text-[#4e6175]">{hint}</p>}
    </div>
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps {}

export function Textarea({
  label,
  id,
  placeholder,
  value,
  onChange,
  rows = 3,
  hint,
  error,
  errorMsg,
  required,
  className = '',
  maxLength,
  ...props
}: TextareaProps) {
  const [focused, setFocused] = useState(false);
  const errorId = id ? `${id}-error` : undefined;
  const len = String(value || '').length;

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
          aria-invalid={!!errorMsg}
          aria-describedby={errorMsg ? errorId : undefined}
          {...props}
        />
        {maxLength && (
          <div className="flex justify-end mt-1">
            <span className="text-xs text-[#4e6175]">{len}/{maxLength}</span>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-[#a83836] flex items-center gap-1">{error}</p>}
      {errorMsg && <p id={errorId} className="text-xs text-[#a83836] flex items-center gap-1 animate-fade-in">{errorMsg}</p>}
      {hint && !error && !errorMsg && <p className="text-xs text-[#4e6175]">{hint}</p>}
    </div>
  );
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseInputProps {
  options?: (string | SelectOption)[];
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
  errorMsg,
  hint,
  className = '',
  ...props
}: SelectProps) {
  const [focused, setFocused] = useState(false);
  const errorId = id ? `${id}-error` : undefined;

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
          aria-invalid={!!errorMsg}
          aria-describedby={errorMsg ? errorId : undefined}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt, i) =>
            typeof opt === 'string'
              ? <option key={`${opt}-${i}`} value={opt}>{opt}</option>
              : <option key={`${opt.value}-${i}`} value={opt.value}>{opt.label}</option>
          )}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="#697d92" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-[#a83836] flex items-center gap-1">{error}</p>}
      {errorMsg && <p id={errorId} className="text-xs text-[#a83836] flex items-center gap-1 animate-fade-in">{errorMsg}</p>}
      {hint && !error && !errorMsg && <p className="text-xs text-[#4e6175]">{hint}</p>}
    </div>
  );
}
