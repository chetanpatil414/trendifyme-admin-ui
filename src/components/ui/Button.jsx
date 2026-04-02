// src/components/ui/Button.jsx
import React from 'react';

const variants = {
  primary: 'btn-primary-gradient text-white font-semibold shadow-sm hover:shadow-md active:scale-[0.98]',
  secondary: 'bg-[#d9eaff] text-[#213447] hover:bg-[#e3efff] font-medium',
  ghost: 'text-[#0058cd] hover:bg-[#edf4ff] font-medium',
  danger: 'bg-[#a83836] text-white hover:bg-[#8a2c2a] font-semibold',
  outline: 'border border-[rgba(160,180,203,0.4)] text-[#213447] hover:bg-[#edf4ff] font-medium',
};

const sizes = {
  sm:  'px-3 py-1.5 text-xs rounded-lg',
  md:  'px-4 py-2.5 text-sm rounded-xl',
  lg:  'px-6 py-3 text-sm rounded-xl',
  xl:  'px-8 py-3.5 text-base rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `.trim()}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin-custom" />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
      {iconRight && !loading && <iconRight size={16} />}
    </button>
  );
}
