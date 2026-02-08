import React from 'react';
import { NavSection } from '../types';
import { LayoutGrid, Map, Calendar, ShoppingBag, Wallet, MessageSquare, PartyPopper, Newspaper, BarChart } from 'lucide-react';

interface NavigationProps {
  currentSection: NavSection;
  setSection: (section: NavSection) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentSection, setSection }) => {
  const navItems = [
    { id: NavSection.HOME, label: 'Dashboard', icon: LayoutGrid },
    { id: NavSection.MAP, label: 'World Map', icon: Map },
    { id: NavSection.EVENTS, label: 'Events', icon: Calendar },
    { id: NavSection.MARKET, label: 'Market', icon: ShoppingBag },
    { id: NavSection.FORUM, label: 'Forum', icon: MessageSquare },
    { id: NavSection.AI_CONTENT, label: 'AI Insights', icon: Newspaper }, // 新增
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 glass-panel border-b border-gray-800 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-claw-accent rounded-sm flex items-center justify-center font-bold text-black font-mono animate-pulse-slow">
          OC
        </div>
        <span className="text-xl font-bold tracking-tighter text-white">
          AGENT<span className="text-claw-accent">VERSE</span>
        </span>
      </div>

      <div className="hidden md:flex gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSection(item.id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
              currentSection === item.id
                ? 'bg-claw-accent/20 text-claw-accent'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSection(NavSection.CONNECT)}
          className={`hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/50 rounded-lg text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all ${
            currentSection === NavSection.CONNECT ? 'ring-1 ring-claw-accent' : ''
          }`}
        >
          <Wallet size={14} />
          Connect
        </button>

        <button 
          onClick={() => setSection(NavSection.GALA)}
          className={`p-3 rounded-xl transition-all duration-300 relative group ${
            currentSection === NavSection.GALA 
              ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 shadow-[0_0_20px_rgba(248,113,113,0.2)]' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <PartyPopper size={24} />
          <span className="absolute top-full mt-2 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700 pointer-events-none z-50">
            Spring Gala
          </span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
        </button>
      </div>
    </nav>
  );
};
