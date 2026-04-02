import React, { ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from '../ui/Button';

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: ReactNode;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  icon
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#060f18]/60 backdrop-blur-sm animate-fade-in" 
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 hover:bg-[#edf4ff] rounded-full text-[#a0b4cb] transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#fff7f6] flex items-center justify-center text-[#a83836] mb-6 shadow-sm border border-[#a83836]/10">
            {icon || <AlertTriangle size={32} />}
          </div>

          <h3 className="text-xl font-bold text-[#213447] mb-2">{title}</h3>
          <p className="text-sm text-[#4e6175] leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              variant="danger" 
              onClick={onConfirm}
              fullWidth
            >
              {confirmLabel}
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancel}
              fullWidth
            >
              {cancelLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
