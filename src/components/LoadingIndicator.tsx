import React, { useState, useEffect } from 'react';
import { Leaf, Sparkles } from 'lucide-react';

interface LoadingIndicatorProps {
  darkMode: boolean;
}

const LOADING_STATUSES = [
  'EcoBuddy is analyzing your request...',
  'Checking material recyclability & resin codes...',
  'Gathering eco-friendly disposal guidelines...',
  'Formulating practical green action tips...',
];

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ darkMode }) => {
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % LOADING_STATUSES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border my-2 max-w-md animate-pulse ${
      darkMode
        ? 'bg-slate-900/90 border-emerald-900/50 text-slate-200'
        : 'bg-white border-emerald-100 text-slate-800 shadow-sm'
    }`}>
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20 shrink-0">
        <Leaf className="w-4 h-4 animate-spin" />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1">
          <Sparkles className="w-3 h-3 animate-bounce" />
          <span>EcoBuddy AI Thinking</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 transition-all">
          {LOADING_STATUSES[statusIdx]}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  );
};
