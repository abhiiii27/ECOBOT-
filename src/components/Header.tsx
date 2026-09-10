import React from 'react';
import {
  Menu,
  Leaf,
  BookOpen,
  Trash2,
  Sun,
  Moon,
  Settings,
  Info,
  Github,
  Sparkles,
  Bot
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebarMobile: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onClearChat: () => void;
  onOpenBinGuide: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  hasMessages: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebarMobile,
  darkMode,
  onToggleDarkMode,
  onClearChat,
  onOpenBinGuide,
  onOpenSettings,
  onOpenAbout,
  hasMessages,
}) => {
  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors duration-200 select-none ${
      darkMode 
        ? 'bg-[#152314]/95 border-[#253A23] text-[#E5E9E1]' 
        : 'bg-[#2D5A27] border-[#23481F] text-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Sidebar Toggle & App Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onToggleSidebarMobile}
              className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-colors lg:hidden cursor-pointer"
              title="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/20 text-white flex items-center justify-center font-bold shadow-sm">
                <Leaf className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight font-serif text-white">
                    EcoBuddy <span className="text-emerald-300">AI</span>
                  </h1>
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-white/10 border border-white/20 text-emerald-200 rounded-full">
                    <Sparkles className="w-2.5 h-2.5" /> Gemini 3.6 Flash
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Bin Guide Button */}
            <button
              type="button"
              onClick={onOpenBinGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-sm active:scale-95 cursor-pointer"
              title="Open Waste Bin Segregation Cheatsheet"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bin Guide</span>
            </button>

            {/* Clear Chat Button */}
            {hasMessages && (
              <button
                type="button"
                onClick={onClearChat}
                className="p-2 rounded-xl text-xs transition-all bg-white/10 hover:bg-rose-500/80 text-emerald-100 hover:text-white border border-white/15 shadow-sm active:scale-95 cursor-pointer"
                title="Clear Conversation History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Settings Button */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-xs transition-all bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/15 shadow-sm active:scale-95 cursor-pointer"
              title="Preferences & Regional Rules"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* About Modal */}
            <button
              type="button"
              onClick={onOpenAbout}
              className="p-2 rounded-xl text-xs transition-all bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/15 shadow-sm active:scale-95 cursor-pointer"
              title="About EcoBuddy AI"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl transition-all bg-white/15 hover:bg-white/25 text-amber-300 border border-white/20 shadow-sm active:scale-95 cursor-pointer"
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-amber-200" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
