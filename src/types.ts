export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  imagePreview?: string;
  categoryTag?: 'dry' | 'wet' | 'hazardous' | 'ewaste' | 'residual' | 'tip';
  feedback?: 'like' | 'dislike' | null;
  isError?: boolean;
  source?: 'gemini' | 'knowledge_fallback';
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

export interface AppSettings {
  region: string;
  aiModel: string;
  soundEffects: boolean;
  autoReadAloud: boolean;
}

export interface StarterPrompt {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  iconName: 'Recycle' | 'Sprout' | 'Flame' | 'Zap' | 'Droplets' | 'Trash2' | 'Globe';
}

export interface BinCategoryInfo {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
  examples: string[];
  tips: string;
}

