import React, { useState, useEffect, useRef } from 'react';
import { Message, ChatSession, AppSettings } from './types';
import { sendChatMessage } from './services/api';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LoadingIndicator } from './components/LoadingIndicator';
import { BinGuideModal } from './components/BinGuideModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { ConfirmModal } from './components/ConfirmModal';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('ecobuddy_theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('ecobuddy_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    return {
      region: 'universal',
      aiModel: 'gemini-3.6-flash',
      soundEffects: true,
      autoReadAloud: false,
    };
  });

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('ecobuddy_sessions_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse chat sessions:', e);
      }
    }
    // Default initial session
    return [
      {
        id: 'session-default',
        title: 'New Eco Conversation',
        createdAt: new Date().toISOString(),
        messages: [],
      },
    ];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'session-default';
  });

  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);
  const [isSidebarCollapsedDesktop, setIsSidebarCollapsedDesktop] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [isBinGuideOpen, setIsBinGuideOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Active chat session
  const currentSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];
  const messages = currentSession?.messages || [];

  // Save theme & settings
  useEffect(() => {
    localStorage.setItem('ecobuddy_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('ecobuddy_settings', JSON.stringify(settings));
  }, [settings]);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('ecobuddy_sessions_v2', JSON.stringify(sessions));
  }, [sessions]);

  // Auto scroll to bottom on new message or loading state
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Start new chat thread
  const handleNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Eco Conversation',
      createdAt: new Date().toISOString(),
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setErrorMessage(null);
  };

  // Delete session thread
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      handleConfirmClear();
      return;
    }
    const filtered = sessions.filter((s) => s.id !== sessionId);
    setSessions(filtered);
    if (currentSessionId === sessionId) {
      setCurrentSessionId(filtered[0].id);
    }
  };

  // Handle user sending a message
  const handleSendMessage = async (text: string, imageBase64?: string, mimeType?: string) => {
    setErrorMessage(null);

    const userMessageId = `msg-${Date.now()}`;
    const userMsg: Message = {
      id: userMessageId,
      sender: 'user',
      text: text || 'Please analyze this waste item photo.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imagePreview: imageBase64,
    };

    // Auto title thread from first prompt if default title
    const sessionTitle =
      currentSession.messages.length === 0
        ? text.length > 28
          ? `${text.substring(0, 28)}...`
          : text
        : currentSession.title;

    // Update active session messages
    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionId
          ? {
              ...s,
              title: sessionTitle,
              messages: [...s.messages, userMsg],
            }
          : s
      )
    );

    setIsLoading(true);

    try {
      const historyPayload = currentSession.messages
        .slice(-10)
        .map((m) => ({ sender: m.sender, text: m.text }));

      const replyText = await sendChatMessage({
        message: text,
        history: historyPayload,
        imageBase64,
        mimeType,
      });

      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? { ...s, messages: [...s.messages, assistantMsg] }
            : s
        )
      );
    } catch (err: any) {
      console.error('EcoBuddy Chat Error:', err);
      setErrorMessage(
        err.message || 'Unable to connect to EcoBuddy AI. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate response for last user prompt
  const handleRegenerate = async () => {
    if (messages.length === 0 || isLoading) return;

    // Find last user message
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.sender === 'user');
    if (lastUserIndex === -1) return;

    const actualIndex = messages.length - 1 - lastUserIndex;
    const lastUserMessage = messages[actualIndex];

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const historyPayload = messages
        .slice(0, actualIndex)
        .slice(-10)
        .map((m) => ({ sender: m.sender, text: m.text }));

      const replyText = await sendChatMessage({
        message: lastUserMessage.text,
        history: historyPayload,
        imageBase64: lastUserMessage.imagePreview,
      });

      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Replace or append response
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== currentSessionId) return s;
          const newMsgs = [...s.messages];
          if (newMsgs[newMsgs.length - 1]?.sender === 'assistant') {
            newMsgs[newMsgs.length - 1] = assistantMsg;
          } else {
            newMsgs.push(assistantMsg);
          }
          return { ...s, messages: newMsgs };
        })
      );
    } catch (err: any) {
      console.error('Regenerate Error:', err);
      setErrorMessage(err.message || 'Failed to regenerate response.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle message feedback
  const handleFeedback = (messageId: string, type: 'like' | 'dislike') => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== currentSessionId) return s;
        return {
          ...s,
          messages: s.messages.map((m) =>
            m.id === messageId
              ? { ...m, feedback: m.feedback === type ? null : type }
              : m
          ),
        };
      })
    );
  };

  // Clear current thread
  const handleConfirmClear = () => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionId ? { ...s, title: 'New Eco Conversation', messages: [] } : s
      )
    );
    setErrorMessage(null);
    setIsConfirmClearOpen(false);
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-200 ${
      darkMode ? 'bg-[#121E12] text-[#E5E9E1]' : 'bg-[#F2F4F0] text-[#1A2E19]'
    }`}>
      
      {/* Left Sidebar */}
      <Sidebar
        isOpen={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
        isCollapsedDesktop={isSidebarCollapsedDesktop}
        onToggleCollapseDesktop={() => setIsSidebarCollapsedDesktop((prev) => !prev)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onOpenBinGuide={() => setIsBinGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        
        {/* Navigation Header */}
        <Header
          onToggleSidebarMobile={() => setIsSidebarOpenMobile(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
          onClearChat={() => setIsConfirmClearOpen(true)}
          onOpenBinGuide={() => setIsBinGuideOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          hasMessages={messages.length > 0}
        />

        {/* Scrollable Chat Area */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 flex flex-col scrollbar-none">
          <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col justify-between">
            
            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm flex items-center justify-between gap-3 animate-fade-in shadow-sm shrink-0">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="p-1 hover:bg-rose-500/20 rounded-lg text-xs font-semibold underline shrink-0 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Empty Welcome Screen vs Message List */}
            {messages.length === 0 ? (
              <WelcomeScreen
                onSelectPrompt={(prompt) => handleSendMessage(prompt)}
                darkMode={darkMode}
              />
            ) : (
              <div className="space-y-4 pb-4">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    darkMode={darkMode}
                    onRegenerate={msg.sender === 'assistant' ? handleRegenerate : undefined}
                    onFeedback={handleFeedback}
                  />
                ))}

                {/* Loading State */}
                {isLoading && <LoadingIndicator darkMode={darkMode} />}

                <div ref={messagesEndRef} />
              </div>
            )}

          </div>
        </main>

        {/* Sticky Chat Input Bar */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          darkMode={darkMode}
        />

      </div>

      {/* Bin Segregation Modal */}
      <BinGuideModal
        isOpen={isBinGuideOpen}
        onClose={() => setIsBinGuideOpen(false)}
        darkMode={darkMode}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        darkMode={darkMode}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        darkMode={darkMode}
      />

      {/* Confirm Clear Conversation Modal */}
      <ConfirmModal
        isOpen={isConfirmClearOpen}
        title="Clear Current Conversation?"
        message="This will reset the current chat thread with EcoBuddy AI. You can start fresh with new questions."
        confirmLabel="Clear Thread"
        onConfirm={handleConfirmClear}
        onCancel={() => setIsConfirmClearOpen(false)}
        darkMode={darkMode}
      />

    </div>
  );
}
