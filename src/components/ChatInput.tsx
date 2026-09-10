import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  Mic,
  MicOff,
  X,
  Sparkles,
  AlertCircle,
  Paperclip
} from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string, imageBase64?: string, mimeType?: string) => void;
  isLoading: boolean;
  darkMode: boolean;
}

const QUICK_TOPICS = [
  '♻️ Pizza box disposal',
  '🌱 Composting guide',
  '🥤 Plastic bottle codes',
  '💧 Save water tips',
  '🔋 E-waste recycling',
];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  darkMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [fileError, setFileError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFileError('Please select a valid image file (JPG, PNG, WEBP).');
        return;
      }
      setImageMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;
    onSendMessage(inputText.trim(), selectedImage || undefined, imageMimeType);
    setInputText('');
    setSelectedImage(null);
    setFileError(null);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  return (
    <div className={`sticky bottom-0 z-20 border-t backdrop-blur-md transition-colors select-none ${
      darkMode
        ? 'bg-[#152314]/95 border-[#253A23]'
        : 'bg-white/95 border-[#D8DFD5] shadow-lg'
    }`}>
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3">
        
        {/* Quick Topic Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className={`text-[10px] uppercase tracking-wider font-bold shrink-0 flex items-center gap-1 mr-1 ${
            darkMode ? 'text-emerald-400' : 'text-[#2D5A27]'
          }`}>
            <Sparkles className="w-3 h-3" /> Quick Ask:
          </span>
          {QUICK_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendMessage(topic.replace(/^[^\s]+\s*/, ''))}
              disabled={isLoading}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                darkMode
                  ? 'bg-[#1E2F1C] hover:bg-[#253B23] text-[#E5E9E1] border border-[#294226]'
                  : 'bg-[#F0F4EE] hover:bg-[#E4EAE1] text-[#2D5A27] border border-[#D8DFD5]'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* File Type Error Alert */}
        {fileError && (
          <div className="mb-2 text-xs text-rose-500 font-semibold flex items-center justify-between bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
            <span>{fileError}</span>
            <button type="button" onClick={() => setFileError(null)} className="p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Selected Image Preview Thumbnail */}
        {selectedImage && (
          <div className="mb-2.5 relative inline-block">
            <img
              src={selectedImage}
              alt="Waste item thumbnail"
              className="w-16 h-16 object-cover rounded-xl border-2 border-[#2D5A27] shadow-md"
            />
            <button
              type="button"
              onClick={removeSelectedImage}
              className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 shadow hover:bg-rose-700 transition-colors"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Listening Indicator Banner */}
        {isListening && (
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Listening... Speak your environmental question now</span>
          </div>
        )}

        {/* Text Input Card */}
        <div className={`relative flex items-end gap-2 p-2 rounded-2xl border transition-all ${
          darkMode
            ? 'bg-[#182717] border-[#294226] focus-within:border-emerald-500/80 shadow-inner'
            : 'bg-[#F5F8F4] border-[#D8DFD5] focus-within:border-[#2D5A27] shadow-inner'
        }`}>
          
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              selectedImage
                ? 'bg-[#2D5A27] text-white'
                : darkMode
                  ? 'text-[#A1AD9E] hover:text-white hover:bg-[#253B23]'
                  : 'text-[#5A6D58] hover:text-[#2D5A27] hover:bg-white'
            }`}
            title="Upload photo of waste item for AI segregation analysis"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            disabled={isLoading}
            className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : darkMode
                  ? 'text-[#A1AD9E] hover:text-white hover:bg-[#253B23]'
                  : 'text-[#5A6D58] hover:text-[#2D5A27] hover:bg-white'
            }`}
            title={isListening ? 'Stop voice listening' : 'Speak question with voice microphone'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Multi-line Textarea */}
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask EcoBuddy anything..."
            rows={1}
            disabled={isLoading}
            className={`w-full bg-transparent resize-none outline-none text-sm sm:text-base py-1 px-1 max-h-32 ${
              darkMode ? 'text-[#E5E9E1] placeholder-[#7A8B78]' : 'text-[#1A2E19] placeholder-[#7A8B78]'
            }`}
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={(!inputText.trim() && !selectedImage) || isLoading}
            className={`p-2.5 rounded-xl shrink-0 font-bold transition-all shadow-md flex items-center justify-center cursor-pointer ${
              (!inputText.trim() && !selectedImage) || isLoading
                ? 'bg-[#D8DFD5] dark:bg-[#253B23] text-[#7A8B78] dark:text-[#5A6D58] cursor-not-allowed shadow-none'
                : 'bg-[#2D5A27] hover:bg-[#23481F] text-white shadow-[#2D5A27]/20 active:scale-95'
            }`}
            title="Send message to EcoBuddy AI"
          >
            <Send className="w-4 h-4" />
          </button>

        </div>

        {/* Footer Info Line */}
        <div className={`flex items-center justify-between text-[11px] mt-1.5 px-1 ${
          darkMode ? 'text-[#A1AD9E]' : 'text-[#7A8B78]'
        }`}>
          <span className="hidden sm:inline">Press Enter to send, Shift+Enter for newline</span>
          <span className="flex items-center gap-1 ml-auto font-medium">
            <AlertCircle className="w-3 h-3 text-[#2D5A27] dark:text-emerald-400" /> Powered by Gemini 3.6 Flash
          </span>
        </div>

      </div>
    </div>
  );
};
