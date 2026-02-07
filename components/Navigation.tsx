import React from 'react';
import { NavSection } from '../types';
import { LayoutGrid, Map, Calendar, ShoppingBag, Wallet, MessageSquare } from 'lucide-react';

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
      </div>
    </nav>
  );
};