import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { BinCategoryInfo } from '../types';

interface BinGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

const BINS_DATA: BinCategoryInfo[] = [
  {
    id: 'dry',
    name: '🔵 Dry / Recyclable Waste',
    color: 'border-blue-500 text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-800',
    badgeBg: 'bg-blue-500',
    badgeText: 'text-white',
    icon: '🔵',
    examples: [
      'Clean paper, newspapers & books',
      'Cardboard boxes & paper bags',
      'Rigid plastic bottles (#1 PET, #2 HDPE, #5 PP)',
      'Aluminum cans & tin containers',
      'Glass bottles & clean jars'
    ],
    tips: 'Always rinse food residue from containers before recycling!'
  },
  {
    id: 'wet',
    name: '🟢 Wet / Organic Waste',
    color: 'border-emerald-500 text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    badgeBg: 'bg-emerald-500',
    badgeText: 'text-white',
    icon: '🟢',
    examples: [
      'Vegetable & fruit peels',
      'Leftover cooked food & scraps',
      'Coffee grounds & tea leaves',
      'Eggshells & nutshells',
      'Garden leaves & flowers'
    ],
    tips: 'Ideal for home composting or municipal organic waste bin.'
  },
  {
    id: 'hazardous',
    name: '🔴 Domestic Hazardous Waste',
    color: 'border-rose-500 text-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    borderColor: 'border-rose-200 dark:border-rose-800',
    badgeBg: 'bg-rose-500',
    badgeText: 'text-white',
    icon: '🔴',
    examples: [
      'Household batteries (AA, AAA, Li-ion)',
      'Fluorescent bulbs & tube lights',
      'Paint cans & thinners',
      'Insecticides & chemical cleaners',
      'Expired medicines & syringes'
    ],
    tips: 'Do NOT throw into regular trash! Take to dedicated hazardous collection centers.'
  },
  {
    id: 'ewaste',
    name: '🖤 Electronic Waste (E-Waste)',
    color: 'border-purple-500 text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-200 dark:border-purple-800',
    badgeBg: 'bg-purple-500',
    badgeText: 'text-white',
    icon: '🖤',
    examples: [
      'Old smartphones, tablets & laptops',
      'Chargers, cables & power banks',
      'Broken headphones & speakers',
      'Computer motherboards & RAM',
      'Small household appliances'
    ],
    tips: 'E-waste contains valuable metals and toxic elements; recycle via certified e-waste centers.'
  }
];

export const BinGuideModal: React.FC<BinGuideModalProps> = ({
  isOpen,
  onClose,
  darkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${
        darkMode
          ? 'bg-[#1C2C1A] border-[#2D452A] text-[#E5E9E1]'
          : 'bg-white border-[#DDE2D9] text-[#1A2E19]'
      }`}>
        
        {/* Modal Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${
          darkMode ? 'border-[#2D452A]' : 'border-[#DDE2D9]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${
              darkMode ? 'bg-[#233821] text-emerald-300' : 'bg-[#2D5A27]/10 text-[#2D5A27]'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif">
                Waste Segregation Cheatsheet
              </h3>
              <p className={`text-xs ${darkMode ? 'text-[#A1AD9E]' : 'text-[#7A8B78]'}`}>
                EcoBuddy AI Quick Segregation & Disposal Reference
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              darkMode
                ? 'text-[#A1AD9E] hover:text-white hover:bg-[#233821]'
                : 'text-[#7A8B78] hover:text-[#1A2E19] hover:bg-[#F2F4F0]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          {BINS_DATA.map((bin) => (
            <div
              key={bin.id}
              className={`p-4 rounded-2xl border transition-all ${
                darkMode ? 'bg-[#121E12] border-[#2D452A]' : 'bg-[#F2F4F0] border-[#DDE2D9]'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-base font-serif">
                <span>{bin.name}</span>
              </div>

              <ul className="space-y-1.5 text-xs mb-3">
                {bin.examples.map((ex, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 opacity-90">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#2D5A27] dark:text-emerald-400" />
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>

              <div className={`flex items-center gap-1.5 text-[11px] font-semibold p-2.5 rounded-xl border ${
                darkMode
                  ? 'bg-[#1C2C1A] border-[#2D452A] text-[#E5E9E1]'
                  : 'bg-white border-[#DDE2D9] text-[#1A2E19]'
              }`}>
                <Info className="w-3.5 h-3.5 shrink-0 text-[#2D5A27] dark:text-emerald-400" />
                <span>{bin.tips}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`pt-4 border-t flex items-center justify-between text-xs ${
          darkMode ? 'border-[#2D452A]' : 'border-[#DDE2D9]'
        }`}>
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Note: Local municipality rules take precedence.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold bg-[#2D5A27] hover:bg-[#23481F] text-white transition-colors shadow-sm cursor-pointer"
          >
            Got it!
          </button>
        </div>

      </div>
    </div>
  );
};
