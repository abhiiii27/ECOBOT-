import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  darkMode: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Clear History',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  darkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-md rounded-2xl p-6 border shadow-2xl transition-all ${
        darkMode
          ? 'bg-[#1C2C1A] border-[#2D452A] text-[#E5E9E1]'
          : 'bg-white border-[#DDE2D9] text-[#1A2E19]'
      }`}>
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg text-[#7A8B78] hover:text-[#2D5A27] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif">{title}</h3>
            <p className="text-xs text-[#7A8B78] dark:text-[#A1AD9E]">Action cannot be undone</p>
          </div>
        </div>

        <p className="text-sm mb-6 leading-relaxed opacity-90">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              darkMode
                ? 'border-[#2D452A] text-[#A1AD9E] hover:bg-[#233821]'
                : 'border-[#DDE2D9] text-[#4A5D48] hover:bg-[#F2F4F0]'
            }`}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
