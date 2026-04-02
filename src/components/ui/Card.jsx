// src/components/ui/Card.jsx
import React from 'react';

export default function Card({ children, className = '', noPad = false, glassHeader = false, ...props }) {
  return (
    <div
      className={`
        bg-white rounded-2xl card-shadow
        ${noPad ? '' : 'p-6'}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon: Icon, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between mb-6 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-[#edf4ff] flex items-center justify-center flex-shrink-0">
            <Icon size={18} className="text-[#0058cd]" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-[#213447] leading-tight">{title}</h3>
          {subtitle && <p className="text-xs text-[#4e6175] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-[rgba(160,180,203,0.3)]" />
      {label && <span className="text-xs text-[#4e6175] font-medium px-2">{label}</span>}
      <div className="flex-1 h-px bg-[rgba(160,180,203,0.3)]" />
    </div>
  );
}
