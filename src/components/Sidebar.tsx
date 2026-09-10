import React from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
  BookOpen,
  Leaf,
  Settings,
  Info,
  Sparkles,
  X,
  ExternalLink,
  Globe,
  Award,
  ChevronLeft,
  Moon,
  Sun,
  Bot
} from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
  isCollapsedDesktop: boolean;
  onToggleCollapseDesktop: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onOpenBinGuide: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onCloseMobile,
  isCollapsedDesktop,
  onToggleCollapseDesktop,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onOpenBinGuide,
  onOpenSettings,
  onOpenAbout,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full flex flex-col border-r transition-all duration-300 select-none ${
          darkMode
            ? 'bg-[#152314] border-[#253A23] text-[#E5E9E1]'
            : 'bg-[#F0F4EE] border-[#D8DFD5] text-[#1A2E19]'
        } ${
          // Mobile state
          isOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${
          // Desktop width
          isCollapsedDesktop ? 'lg:w-20' : 'lg:w-72'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#2D5A27] text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Leaf className="w-5 h-5 text-emerald-300" />
            </div>
            {!isCollapsedDesktop && (
              <div className="flex flex-col truncate">
                <span className="font-serif font-bold text-base tracking-tight text-[#1A2E19] dark:text-white flex items-center gap-1.5">
                  EcoBuddy <span className="text-emerald-600 dark:text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#4A5D48] dark:text-[#A1AD9E]">
                  SaaS Eco Assistant
                </span>
              </div>
            )}
          </div>

          {/* Close for mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleCollapseDesktop}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title={isCollapsedDesktop ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <ChevronLeft className={`w-5 h-5 transition-transform duration-200 ${isCollapsedDesktop ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer ${
              darkMode
                ? 'bg-[#2D5A27] hover:bg-[#23481F] text-white'
                : 'bg-[#2D5A27] hover:bg-[#23481F] text-white'
            } ${isCollapsedDesktop ? 'justify-center px-0' : ''}`}
            title="Start New Chat Session"
          >
            <Plus className="w-5 h-5 shrink-0" />
            {!isCollapsedDesktop && <span>New Chat</span>}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scrollbar-none">
          
          {/* Chat History Section */}
          <div>
            {!isCollapsedDesktop && (
              <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#7A8B78] dark:text-[#8E9F8B]">
                <span>Recent Conversations</span>
                <span className="text-[10px] bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded-full font-mono">
                  {sessions.length}
                </span>
              </div>
            )}

            <div className="space-y-1">
              {sessions.map((session) => {
                const isActive = session.id === currentSessionId;
                return (
                  <div
                    key={session.id}
                    className="group relative flex items-center"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSession(session.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left truncate cursor-pointer ${
                        isActive
                          ? darkMode
                            ? 'bg-[#253A23] text-emerald-300 font-bold'
                            : 'bg-[#DEE5DC] text-[#2D5A27] font-bold'
                          : darkMode
                            ? 'text-[#C5CDC0] hover:bg-[#1E2F1C] hover:text-white'
                            : 'text-[#3E523B] hover:bg-[#E4EAE1] hover:text-[#1A2E19]'
                      } ${isCollapsedDesktop ? 'justify-center px-0' : ''}`}
                      title={session.title}
                    >
                      <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-500' : 'opacity-70'}`} />
                      {!isCollapsedDesktop && (
                        <span className="truncate flex-1">{session.title}</span>
                      )}
                    </button>

                    {!isCollapsedDesktop && sessions.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => onDeleteSession(session.id, e)}
                        className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded transition-opacity"
                        title="Delete Session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Tools & Guides */}
          <div>
            {!isCollapsedDesktop && (
              <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#7A8B78] dark:text-[#8E9F8B]">
                Eco Tools & Guides
              </div>
            )}

            <div className="space-y-1">
              {/* Bin Guide */}
              <button
                type="button"
                onClick={() => {
                  onOpenBinGuide();
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  darkMode
                    ? 'text-[#C5CDC0] hover:bg-[#1E2F1C] hover:text-white'
                    : 'text-[#3E523B] hover:bg-[#E4EAE1] hover:text-[#1A2E19]'
                } ${isCollapsedDesktop ? 'justify-center px-0' : ''}`}
                title="Waste Bin Segregation Guide"
              >
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {!isCollapsedDesktop && <span>Bin Segregation Guide</span>}
              </button>

              {/* Eco Score / Challenges Badge */}
              <div
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium opacity-80 ${
                  darkMode ? 'text-[#A1AD9E]' : 'text-[#5A6D58]'
                } ${isCollapsedDesktop ? 'justify-center px-0' : ''}`}
                title="Eco Challenges & Level (Coming Soon)"
              >
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                {!isCollapsedDesktop && (
                  <div className="flex items-center justify-between w-full">
                    <span>Eco Challenges</span>
                    <span className="text-[9px] uppercase font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">
                      Soon
                    </span>
                  </div>
                )}
              </div>

              {/* Regional Presets / Settings */}
              <button
                type="button"
                onClick={() => {
                  onOpenSettings();
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  darkMode
                    ? 'text-[#C5CDC0] hover:bg-[#1E2F1C] hover:text-white'
                    : 'text-[#3E523B] hover:bg-[#E4EAE1] hover:text-[#1A2E19]'
                } ${isCollapsedDesktop ? 'justify-center px-0' : ''}`}
                title="Application Settings & Municipality Rules"
              >
                <Settings className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                {!isCollapsedDesktop && <span>Preferences & Region</span>}
              </button>

              {/* About Modal */}
              <button
                type="button"
                onClick={() => {
                  onOpenAbout();
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  darkMode
                    ? 'text-[#C5CDC0] hover:bg-[#1E2F1C] hover:text-white'
                    : 'text-[#3E523B] hover:bg-[#E4EAE1] hover:text-[#1A2E19]'
                } ${isCollapsedDesktop ? 'justify-center px-0' : ''}`}
                title="About EcoBuddy AI & Mission"
              >
                <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                {!isCollapsedDesktop && <span>About EcoBuddy AI</span>}
              </button>
            </div>
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-black/5 dark:border-white/10 space-y-2">
          
          {/* Dark Mode Switch */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              darkMode
                ? 'bg-[#1E2F1C] text-amber-300 hover:bg-[#253A23]'
                : 'bg-[#E4EAE1] text-amber-700 hover:bg-[#D8E1D4]'
            } ${isCollapsedDesktop ? 'justify-center px-0' : ''}`}
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-300 shrink-0" />
                {!isCollapsedDesktop && <span>Light Theme</span>}
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-amber-600 shrink-0" />
                {!isCollapsedDesktop && <span>Dark Theme</span>}
              </>
            )}
          </button>

          {/* Model Status Card */}
          {!isCollapsedDesktop && (
            <div className={`p-3 rounded-xl border text-[11px] flex items-center gap-2.5 ${
              darkMode
                ? 'bg-[#1A2B18] border-[#294226] text-[#A1AD9E]'
                : 'bg-white border-[#D8DFD5] text-[#4A5D48]'
            }`}>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex flex-col truncate">
                <span className="font-bold text-[#1A2E19] dark:text-white truncate">
                  Gemini 3.6 Flash AI
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ready & Online
                </span>
              </div>
            </div>
          )}

        </div>
      </aside>
    </>
  );
};
