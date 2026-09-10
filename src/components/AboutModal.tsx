import React from 'react';
import { Leaf, Info, ShieldCheck, Sparkles, ExternalLink, X, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${
        darkMode
          ? 'bg-[#182717] border-[#294226] text-[#E5E9E1]'
          : 'bg-white border-[#DDE4DC] text-[#1A2E19]'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D5A27] text-white flex items-center justify-center font-bold shadow-md">
              <Leaf className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold font-serif">About EcoBuddy AI</h3>
              <p className={`text-xs ${darkMode ? 'text-[#A1AD9E]' : 'text-[#7A8B78]'}`}>
                Conversational Environmental Intelligence Platform
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              darkMode ? 'hover:bg-[#253B23] text-[#A1AD9E] hover:text-white' : 'hover:bg-[#F2F6F1] text-[#7A8B78] hover:text-black'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-4 text-xs leading-relaxed">
          <p className={`${darkMode ? 'text-[#C5CDC0]' : 'text-[#3E523B]'}`}>
            <strong>EcoBuddy AI</strong> is an intelligent SaaS conversational assistant designed to bridge the gap between daily consumer habits and practical environmental sustainability.
          </p>

          <div className={`p-4 rounded-2xl border space-y-2.5 ${
            darkMode ? 'bg-[#132012] border-[#253B23]' : 'bg-[#F8FAF7] border-[#E2E8E0]'
          }`}>
            <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> Core Capabilities
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-[11px] opacity-90">
              <li>Instant 5-Category Waste Segregation (Dry, Wet, Hazardous, E-Waste, Residual).</li>
              <li>Composting bin setup and organic ratio optimization guidance.</li>
              <li>Visual waste photo recognition powered by Gemini 3.6 Flash.</li>
              <li>Zero-waste habit swaps & plastic reduction strategies.</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 pt-2 text-[11px] font-semibold text-[#7A8B78] dark:text-[#8E9F8B]">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Built for a cleaner, zero-waste planet
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-[#2D5A27] hover:bg-[#23481F] text-white transition-colors shadow-sm cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
