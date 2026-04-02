// src/components/ui/Toast.tsx
import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface ToastProps {
  title?: string;
  message: string;
  icon?: 'info' | 'success' | 'error';
  onClose?: () => void;
}

export default function Toast({ title, message, icon = 'info', onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const Icon = icon === 'success' ? CheckCircle : icon === 'error' ? AlertCircle : Info;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-toast">
      <div className="flex items-center gap-4 p-4 bg-white/90 backdrop-blur-xl border-l-4 border-[#0058cd] rounded-xl shadow-2xl max-w-sm">
        <div className="w-10 h-10 bg-[#e3efff] rounded-full flex items-center justify-center text-[#0058cd] shrink-0">
          <Icon size={20} />
        </div>
        <div className="flex-1">
          {title && <p className="text-sm font-semibold text-[#213447]">{title}</p>}
          <p className="text-xs text-[#4e6175] max-w-[200px]">{message}</p>
        </div>
        <button 
          onClick={handleClose}
          className="p-1 hover:bg-[#edf4ff] rounded-full text-[#a0b4cb] flex-shrink-0"
          aria-label="Close toast"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export interface ToastData {
  id: string;
  message: string;
  description?: string;
  type: 'info' | 'success' | 'error';
}

export interface ToastContainerProps {
  toasts: ToastData[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
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
            <button 
              onClick={() => removeToast(toast.id)} 
              className="text-[#697d92] hover:text-[#213447] p-1"
              aria-label="Remove notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
