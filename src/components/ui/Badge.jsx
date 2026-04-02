// src/components/ui/Badge.jsx
import React from 'react';

const variants = {
  default:  'bg-[#e3efff] text-[#0058cd]',
  success:  'bg-[#d4f0e0] text-[#1a6b42]',
  warning:  'bg-[#fff3d0] text-[#8a5a00]',
  danger:   'bg-[#fde8e8] text-[#a83836]',
  neutral:  'bg-[#edf4ff] text-[#4e6175]',
  primary:  'bg-[#0058cd] text-white',
  purple:   'bg-[#e1c8f8] text-[#6b5780]',
};

export default function Badge({ children, variant = 'default', size = 'md', dot = false, className = '' }) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variants[variant]} ${sizeClasses} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${variant === 'success' ? 'bg-[#1a6b42]' : variant === 'danger' ? 'bg-[#a83836]' : 'bg-current'}`} />}
      {children}
    </span>
  );
}
