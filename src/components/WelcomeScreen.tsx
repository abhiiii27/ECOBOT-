import React from 'react';
import {
  Leaf,
  Sparkles,
  Recycle,
  Sprout,
  Droplets,
  Globe,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot
} from 'lucide-react';

interface WelcomeScreenProps {
  onSelectPrompt: (promptText: string) => void;
  darkMode: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectPrompt, darkMode }) => {
  const SUGGESTION_CARDS = [
    {
      id: 'pizza-box',
      icon: <Recycle className="w-5 h-5 text-amber-500" />,
      title: 'Pizza Box Disposal',
      subtitle: 'Greasy vs. Clean Cardboard',
      prompt: 'Where should I throw a pizza box? Explain how grease affects cardboard recycling.',
      tag: 'Waste Segregation',
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
    {
      id: 'composting-start',
      icon: <Sprout className="w-5 h-5 text-emerald-500" />,
      title: 'Composting Beginner',
      subtitle: 'Indoor & Garden Setup',
      prompt: 'How do I start composting at home? What items can and cannot go into compost?',
      tag: 'Organic & Soil',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'shampoo-bottles',
      icon: <Zap className="w-5 h-5 text-teal-500" />,
      title: 'Shampoo & Plastics',
      subtitle: 'Resin Codes & Rinsing',
      prompt: 'Can shampoo bottles be recycled? Do I need to remove pump lids or rinse them?',
      tag: 'Plastic Recycling',
      badgeBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    },
    {
      id: 'water-saving',
      icon: <Droplets className="w-5 h-5 text-sky-500" />,
      title: 'Water Saving Tips',
      subtitle: 'Top 5 Household Habits',
      prompt: 'What are the top 5 practical ways to save water at home every day?',
      tag: 'Resource Conservation',
      badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    },
    {
      id: 'carbon-footprint',
      icon: <Globe className="w-5 h-5 text-indigo-500" />,
      title: 'Carbon Footprint 101',
      subtitle: 'Simple Personal Guide',
      prompt: 'Explain what a carbon footprint is and give 3 easy steps to reduce mine.',
      tag: 'Sustainability',
      badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto my-auto py-8 sm:py-12 px-4 animate-fade-in text-center">
      
      {/* Brand Hero Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border mb-6 shadow-sm ${
        darkMode
          ? 'bg-[#1E2F1C] text-emerald-300 border-[#2D452A]'
          : 'bg-[#E8EFE6] text-[#2D5A27] border-[#D0DDD0]'
      }`}>
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>EcoBuddy AI Assistant</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
      </div>

      {/* Hero Title */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-[#2D5A27] text-white flex items-center justify-center font-bold shadow-lg shadow-[#2D5A27]/20">
          <Leaf className="w-7 h-7 text-emerald-300" />
        </div>
        <h1 className={`text-3xl sm:text-4xl font-extrabold font-serif tracking-tight ${
          darkMode ? 'text-[#E5E9E1]' : 'text-[#1A2E19]'
        }`}>
          EcoBuddy <span className="text-emerald-600 dark:text-emerald-400">AI</span>
        </h1>
      </div>

      {/* Subheading */}
      <h2 className={`text-lg sm:text-xl font-bold mb-3 ${
        darkMode ? 'text-emerald-300' : 'text-[#2D5A27]'
      }`}>
        Your Personal Environmental Assistant
      </h2>

      {/* Description */}
      <p className={`max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-8 ${
        darkMode ? 'text-[#A1AD9E]' : 'text-[#4A5D48]'
      }`}>
        Ask anything about waste segregation, recycling, composting, plastic reduction, water conservation, or sustainable living. Upload a waste item photo or choose a prompt below to begin!
      </p>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-left">
        {SUGGESTION_CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectPrompt(card.prompt)}
            className={`group p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
              darkMode
                ? 'bg-[#182717] hover:bg-[#20331E] border-[#294226] hover:border-emerald-500/50 text-[#E5E9E1] shadow-sm'
                : 'bg-white hover:bg-[#F2F6F1] border-[#DDE4DC] hover:border-[#2D5A27] text-[#1A2E19] shadow-sm hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${
                  darkMode ? 'bg-[#253B23]' : 'bg-[#EAEFE8]'
                }`}>
                  {card.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${card.badgeBg}`}>
                  {card.tag}
                </span>
              </div>

              <h3 className={`font-bold text-sm mb-1 font-serif ${
                darkMode ? 'text-[#E5E9E1]' : 'text-[#1A2E19]'
              }`}>
                {card.title}
              </h3>

              <p className={`text-xs ${
                darkMode ? 'text-[#A1AD9E]' : 'text-[#5A6D58]'
              }`}>
                {card.subtitle}
              </p>
            </div>

            <div className={`mt-4 pt-2.5 border-t flex items-center justify-between text-xs font-bold transition-all ${
              darkMode ? 'border-[#294226] text-emerald-400' : 'border-[#EAEFE8] text-[#2D5A27]'
            }`}>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Ask EcoBuddy
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};
