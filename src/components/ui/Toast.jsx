// src/components/ui/Toast.jsx
import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Toast({ title, message, icon = 'info', onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-toast">
      <div className="flex items-center gap-4 p-4 bg-white/90 backdrop-blur-xl border-l-4 border-primary rounded-xl shadow-2xl max-w-sm">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-on-surface">{title}</p>
          <p className="text-xs text-on-surface-variant max-w-[200px]">{message}</p>
        </div>
        <button 
          onClick={handleClose}
          className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant/40 flex-shrink-0"
          aria-label="Close toast"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => {
        let Icon = Info;
        let borderColor = 'border-[#0058cd]';
        let bgIcon = 'bg-[#e3efff]';
        let textIcon = 'text-[#0058cd]';
        
        if (toast.type === 'success') {
          Icon = CheckCircle;
          borderColor = 'border-[#1a6b42]';
          bgIcon = 'bg-[#e8f5ed]';
          textIcon = 'text-[#1a6b42]';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderColor = 'border-[#a83836]';
          bgIcon = 'bg-[#fff7f6]';
          textIcon = 'text-[#a83836]';
        }

        return (
          <div key={toast.id} className={`pointer-events-auto flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border-l-4 ${borderColor} animate-toast`}>
            <div className={`w-8 h-8 rounded-full ${bgIcon} flex items-center justify-center ${textIcon} shrink-0`}>
              <Icon size={16} />
            </div>
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm font-semibold text-[#213447]">{toast.message}</p>
              {toast.description && <p className="text-xs text-[#4e6175] mt-0.5">{toast.description}</p>}
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-[#697d92] hover:text-[#213447] p-1">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
