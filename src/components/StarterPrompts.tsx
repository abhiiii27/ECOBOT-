import React from 'react';
import { StarterPrompt } from '../types';
import { Recycle, Sprout, Flame, Zap, Droplets, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

interface StarterPromptsProps {
  onSelectPrompt: (promptText: string) => void;
  darkMode: boolean;
}

const STARTER_PROMPTS: StarterPrompt[] = [
  {
    id: 'segregation',
    title: 'Waste Segregation Guide',
    description: 'Learn how to sort pizza boxes, coffee cups, packaging, and food wrappers.',
    category: 'Segregation',
    prompt: 'How do I correctly segregate everyday kitchen waste like pizza boxes, coffee cups, milk cartons, and plastic wrap?',
    iconName: 'Recycle',
  },
  {
    id: 'composting',
    title: 'Home Composting 101',
    description: 'Step-by-step beginner guide to odorless indoor or backyard composting.',
    category: 'Composting',
    prompt: 'What can and cannot go into a home compost pile? Give me a beginner-friendly setup guide.',
    iconName: 'Sprout',
  },
  {
    id: 'plastic',
    title: 'Plastic Reduction Swaps',
    description: 'Practical, low-cost zero-waste alternatives to single-use plastic items.',
    category: 'Sustainability',
    prompt: 'Give me 5 practical zero-waste swaps to reduce single-use plastic in my kitchen and bathroom.',
    iconName: 'Trash2',
  },
  {
    id: 'conservation',
    title: 'Water & Energy Saver',
    description: 'Simple household habits to cut water waste and lower electricity bills.',
    category: 'Conservation',
    prompt: 'What are the top 5 most effective habits to save water and energy at home?',
    iconName: 'Droplets',
  },
];

export const StarterPrompts: React.FC<StarterPromptsProps> = ({ onSelectPrompt, darkMode }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Recycle': return <Recycle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Sprout': return <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Trash2': return <Trash2 className="w-5 h-5 text-amber-700 dark:text-amber-400" />;
      case 'Droplets': return <Droplets className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      default: return <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      
      {/* Intro Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border mb-3 ${
          darkMode
            ? 'bg-[#233821] text-emerald-300 border-[#2D452A]'
            : 'bg-[#2D5A27]/10 text-[#2D5A27] border-[#2D5A27]/20'
        }`}>
          <ShieldCheck className="w-4 h-4 text-[#2D5A27] dark:text-emerald-400" />
          <span>EcoBuddy Environmental Assistant</span>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight ${
          darkMode ? 'text-[#E5E9E1]' : 'text-[#1A2E19]'
        }`}>
          How can I help you live greener today?
        </h2>
        <p className={`mt-2 text-sm max-w-lg mx-auto ${
          darkMode ? 'text-[#A1AD9E]' : 'text-[#4A5D48]'
        }`}>
          Ask any question about recycling, waste sorting, composting, or sustainability — or pick a starter topic below:
        </p>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STARTER_PROMPTS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectPrompt(item.prompt)}
            className={`group text-left p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
              darkMode
                ? 'bg-[#1C2C1A] hover:bg-[#233821] border-[#2D452A] hover:border-[#3D7236] text-[#E5E9E1] shadow-sm'
                : 'bg-white hover:bg-[#F2F4F0] border-[#DDE2D9] hover:border-[#2D5A27] text-[#1A2E19] shadow-sm hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-[#233821]' : 'bg-[#F2F4F0]'}`}>
                  {getIcon(item.iconName)}
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full ${
                  darkMode ? 'bg-[#233821] text-emerald-300' : 'bg-[#2D5A27]/10 text-[#2D5A27]'
                }`}>
                  {item.category}
                </span>
              </div>
              <h3 className={`font-bold text-base mb-1 font-serif ${
                darkMode ? 'text-[#E5E9E1]' : 'text-[#1A2E19]'
              }`}>
                {item.title}
              </h3>
              <p className={`text-xs leading-relaxed ${
                darkMode ? 'text-[#A1AD9E]' : 'text-[#4A5D48]'
              }`}>
                {item.description}
              </p>
            </div>

            <div className={`mt-4 flex items-center gap-1.5 text-xs font-bold group-hover:translate-x-1 transition-transform ${
              darkMode ? 'text-emerald-400' : 'text-[#2D5A27]'
            }`}>
              <span>Ask EcoBuddy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};
