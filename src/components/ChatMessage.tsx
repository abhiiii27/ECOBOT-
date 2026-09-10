import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  User,
  Leaf,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Recycle,
  Info
} from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  darkMode: boolean;
  onRegenerate?: () => void;
  onFeedback?: (messageId: string, type: 'like' | 'dislike') => void;
  onRetry?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  darkMode,
  onRegenerate,
  onFeedback,
  onRetry,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(message.feedback || null);

  const isUser = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      // Remove markdown symbols for speech readability
      const cleanText = message.text.replace(/[*_#`~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFeedbackClick = (type: 'like' | 'dislike') => {
    const nextFeedback = feedback === type ? null : type;
    setFeedback(nextFeedback);
    if (onFeedback) {
      onFeedback(message.id, type);
    }
  };

  // Helper to extract category highlight cards from text if present
  const extractStructuredCardData = (text: string) => {
    if (isUser) return null;

    const lower = text.toLowerCase();
    let binType: string | null = null;
    let recyclableStatus: string | null = null;
    let badgeColor: string = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

    if (lower.includes('blue bin') || lower.includes('recyclable') || lower.includes('dry waste')) {
      binType = '🔵 Dry / Recyclable Waste (Blue Bin)';
      badgeColor = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    } else if (lower.includes('green bin') || lower.includes('compost') || lower.includes('organic') || lower.includes('wet waste')) {
      binType = '🟢 Wet / Organic Waste (Green Bin)';
      badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    } else if (lower.includes('red bin') || lower.includes('hazardous') || lower.includes('chemical') || lower.includes('battery')) {
      binType = '🔴 Domestic Hazardous Waste (Red Bin)';
      badgeColor = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    } else if (lower.includes('e-waste') || lower.includes('electronic') || lower.includes('black bin')) {
      binType = '🖤 Electronic Waste (E-Waste)';
      badgeColor = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    } else if (lower.includes('residual') || lower.includes('non-recyclable') || lower.includes('trash bin')) {
      binType = '⚪ Residual / Non-Recyclable Waste';
      badgeColor = 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }

    if (lower.includes('✅ recyclable') || lower.includes('recyclable: yes') || (lower.includes('recyclable') && !lower.includes('non-recyclable'))) {
      recyclableStatus = '✅ Recyclable';
    } else if (lower.includes('❌ non-recyclable') || lower.includes('not recyclable')) {
      recyclableStatus = '❌ Non-Recyclable';
    } else if (lower.includes('🍃 compostable')) {
      recyclableStatus = '🍃 Compostable Organic';
    }

    if (!binType && !recyclableStatus) return null;

    return { binType, recyclableStatus, badgeColor };
  };

  const cardMeta = extractStructuredCardData(message.text);

  return (
    <div className={`flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl transition-all duration-200 my-3 ${
      isUser
        ? darkMode
          ? 'bg-[#253A23] text-white border border-[#314B2E] ml-6 sm:ml-16 shadow-sm'
          : 'bg-[#2D5A27] text-white ml-6 sm:ml-16 shadow-md'
        : darkMode
          ? 'bg-[#182717] border border-[#294226] text-[#E5E9E1] mr-4 sm:mr-12 shadow-sm'
          : 'bg-white border border-[#DDE4DC] text-[#1A2E19] mr-4 sm:mr-12 shadow-sm'
    }`}>
      
      {/* Avatar */}
      <div className="shrink-0">
        {isUser ? (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B4513] text-amber-100 flex items-center justify-center font-bold text-xs shadow-inner">
            <User className="w-5 h-5" />
          </div>
        ) : (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#2D5A27] text-white flex items-center justify-center font-bold text-xs shadow-md">
            <Leaf className="w-5 h-5 text-emerald-300" />
          </div>
        )}
      </div>

      {/* Message Content Area */}
      <div className="flex-1 min-w-0">
        
        {/* Header line: Sender & Timestamp */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-extrabold tracking-wider uppercase ${
              isUser
                ? 'text-emerald-100 opacity-90'
                : darkMode ? 'text-emerald-400' : 'text-[#2D5A27]'
            }`}>
              {isUser ? 'You' : 'EcoBuddy AI'}
            </span>

            {!isUser && (
              <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                message.isError
                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  : message.source === 'knowledge_fallback'
                    ? darkMode
                      ? 'bg-amber-900/20 text-amber-300 border-amber-700/30'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                    : darkMode
                      ? 'bg-[#253B23] text-emerald-300 border-[#294226]'
                      : 'bg-[#EBF2EA] text-[#2D5A27] border-[#D8DFD5]'
              }`}>
                {message.isError ? (
                  <>
                    <AlertCircle className="w-2.5 h-2.5" /> Notice
                  </>
                ) : message.source === 'knowledge_fallback' ? (
                  <>
                    <Leaf className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" /> Eco Knowledge
                  </>
                ) : (
                  <>
                    <Sparkles className="w-2.5 h-2.5 text-emerald-500" /> Gemini AI
                  </>
                )}
              </span>
            )}
          </div>

          <span className={`text-[10px] ${
            isUser
              ? 'text-emerald-200/80'
              : darkMode ? 'text-[#A1AD9E]' : 'text-[#7A8B78]'
          }`}>
            {message.timestamp}
          </span>
        </div>

        {/* User Image Attachment */}
        {message.imagePreview && (
          <div className="mb-3 rounded-2xl overflow-hidden border border-emerald-400/30 max-w-xs shadow-md">
            <img
              src={message.imagePreview}
              alt="Uploaded waste item for analysis"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Highlight Card Banner for Classification Responses */}
        {cardMeta && (
          <div className={`mb-3 p-3 sm:p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-2 ${
            darkMode ? 'bg-[#122011] border-[#253B23]' : 'bg-[#F2F6F1] border-[#DCE4DA]'
          }`}>
            <div className="flex items-center gap-2">
              <Recycle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-bold font-serif">
                {cardMeta.binType || 'Waste Disposal Classification'}
              </span>
            </div>
            {cardMeta.recyclableStatus && (
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cardMeta.badgeColor}`}>
                {cardMeta.recyclableStatus}
              </span>
            )}
          </div>
        )}

        {/* Rich Markdown Response Body */}
        <div className={`text-sm sm:text-base leading-relaxed prose max-w-none ${
          isUser
            ? 'text-white prose-invert'
            : darkMode
              ? 'text-[#E5E9E1] prose-invert'
              : 'text-[#1A2E19]'
        }`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="my-0.5">{children}</li>,
              strong: ({ children }) => <strong className="font-bold text-emerald-700 dark:text-emerald-300">{children}</strong>,
              code: ({ children }) => (
                <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                  darkMode ? 'bg-slate-800 text-emerald-300' : 'bg-slate-100 text-emerald-800'
                }`}>
                  {children}
                </code>
              )
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>

        {/* Actions Toolbar for AI Responses */}
        {!isUser && (
          <div className={`flex items-center justify-between gap-2 mt-4 pt-2.5 border-t text-xs ${
            darkMode ? 'border-[#294226]' : 'border-[#EAEFE8]'
          }`}>
            
            <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${
              darkMode ? 'text-[#A1AD9E]' : 'text-[#5A6D58]'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Disposal rules vary by local council</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              
              {/* Thumbs Up / Down Feedback */}
              <div className="flex items-center gap-0.5 border-r pr-2 border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => handleFeedbackClick('like')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    feedback === 'like'
                      ? 'bg-emerald-500/20 text-emerald-500'
                      : darkMode
                        ? 'text-[#A1AD9E] hover:text-white hover:bg-[#253B23]'
                        : 'text-[#5A6D58] hover:text-[#1A2E19] hover:bg-[#F2F6F1]'
                  }`}
                  title="Helpful response"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFeedbackClick('dislike')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    feedback === 'dislike'
                      ? 'bg-rose-500/20 text-rose-500'
                      : darkMode
                        ? 'text-[#A1AD9E] hover:text-white hover:bg-[#253B23]'
                        : 'text-[#5A6D58] hover:text-[#1A2E19] hover:bg-[#F2F6F1]'
                  }`}
                  title="Unhelpful response"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Text To Speech */}
              {'speechSynthesis' in window && (
                <button
                  type="button"
                  onClick={handleToggleSpeak}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isSpeaking
                      ? 'bg-[#2D5A27] text-white'
                      : darkMode
                        ? 'text-[#A1AD9E] hover:text-emerald-300 hover:bg-[#253B23]'
                        : 'text-[#5A6D58] hover:text-[#2D5A27] hover:bg-[#F2F6F1]'
                  }`}
                  title={isSpeaking ? 'Stop readout' : 'Read answer aloud'}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              )}

              {/* Regenerate or Retry Button */}
              {onRetry && message.isError ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Try Again
                </button>
              ) : onRegenerate ? (
                <button
                  type="button"
                  onClick={onRegenerate}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    darkMode
                      ? 'text-[#A1AD9E] hover:text-emerald-300 hover:bg-[#253B23]'
                      : 'text-[#5A6D58] hover:text-[#2D5A27] hover:bg-[#F2F6F1]'
                  }`}
                  title="Regenerate AI response"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              ) : null}

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopy}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  darkMode
                    ? 'text-[#A1AD9E] hover:text-emerald-300 hover:bg-[#253B23]'
                    : 'text-[#5A6D58] hover:text-[#2D5A27] hover:bg-[#F2F6F1]'
                }`}
                title="Copy response text"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] text-emerald-500 font-bold">Copied</span>
                  </>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
