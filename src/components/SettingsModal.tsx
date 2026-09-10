import React from 'react';
import { Settings, Globe, Bot, Volume2, X, Check, Shield } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  darkMode: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  darkMode,
}) => {
  if (!isOpen) return null;

  const REGIONS = [
    { id: 'universal', name: 'Universal Standard', description: 'Standard international recycling & waste guidelines' },
    { id: 'north_america', name: 'North America (US & Canada)', description: 'EPA standards, resin codes #1-#7, single-stream focus' },
    { id: 'europe', name: 'European Union (EU)', description: 'Strict dual-system & green dot recycling guidelines' },
    { id: 'uk', name: 'United Kingdom (UK)', description: 'DEFRA council kerbside bin color standards' },
    { id: 'asia_pacific', name: 'Asia-Pacific', description: 'Multi-category wet, dry, e-waste & hazardous segregation' },
  ];

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
            <div className={`p-2.5 rounded-2xl ${
              darkMode ? 'bg-[#253B23] text-emerald-300' : 'bg-[#2D5A27]/10 text-[#2D5A27]'
            }`}>
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold font-serif">Application Preferences</h3>
              <p className={`text-xs ${darkMode ? 'text-[#A1AD9E]' : 'text-[#7A8B78]'}`}>
                Customize local municipality rules & AI model settings
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
        <div className="py-5 space-y-6 max-h-[65vh] overflow-y-auto scrollbar-none">
          
          {/* Municipality Presets */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2.5 text-[#2D5A27] dark:text-emerald-400">
              <Globe className="w-4 h-4" /> Municipality / Regional Preset
            </label>
            <div className="space-y-2">
              {REGIONS.map((r) => {
                const isSelected = settings.region === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, region: r.id })}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start justify-between cursor-pointer ${
                      isSelected
                        ? darkMode
                          ? 'bg-[#253B23] border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-[#EBF2EA] border-[#2D5A27] text-[#2D5A27] font-bold'
                        : darkMode
                          ? 'bg-[#132012] border-[#253B23] text-[#A1AD9E] hover:bg-[#1C2E1A]'
                          : 'bg-[#F8FAF7] border-[#E2E8E0] text-[#4A5D48] hover:bg-[#EEF3ED]'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{r.name}</p>
                      <p className="text-[11px] opacity-80 mt-0.5">{r.description}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Model Engine */}
          <div className={`p-4 rounded-2xl border ${
            darkMode ? 'bg-[#132012] border-[#253B23]' : 'bg-[#F8FAF7] border-[#E2E8E0]'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold">AI Intelligence Model</p>
                <p className={`text-[11px] ${darkMode ? 'text-[#A1AD9E]' : 'text-[#7A8B78]'}`}>
                  Powered by Google Gemini 3.6 Flash (Server-Side Key Encrypted)
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#2D5A27] hover:bg-[#23481F] text-white transition-colors shadow-sm cursor-pointer"
          >
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
};
