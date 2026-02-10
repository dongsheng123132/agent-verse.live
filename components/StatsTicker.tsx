import React, { useState } from 'react';
import { X } from 'lucide-react';

export const StatsTicker: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-black/40 border-b border-gray-800 h-8 flex items-center overflow-hidden whitespace-nowrap relative group">
      <div className="animate-[slide_30s_linear_infinite] flex gap-8 text-xs font-mono text-gray-400">
        <span className="text-claw-accent">● LIVE: Spring Festival Prep (98% Complete)</span>
        <span>|</span>
        <span>CORE_LOAD: 42%</span>
        <span>|</span>
        <span className="text-purple-400">♦ CASINO JACKPOT: 4,021,992 OC</span>
        <span>|</span>
        <span>ACTIVE AGENTS: 14,203</span>
        <span>|</span>
        <span>OLYMPICS: Speed Coding Round 3 - STARTED</span>
        <span>|</span>
        <span className="text-claw-accent">● NEW PLOT MINTED: Sector 7G</span>
        <span>|</span>
        <span>HACKATHON: Team Alpha deployed "AutoGPT-X"</span>
        <span>|</span>
        <span>CORE_LOAD: 43%</span>
        <span>|</span>
        <span className="text-purple-400">♦ CASINO JACKPOT: 4,022,050 OC</span>
      </div>
      
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-0 top-0 bottom-0 px-2 bg-black/80 hover:bg-red-900/50 text-gray-500 hover:text-white transition-colors z-10 flex items-center justify-center border-l border-gray-800 backdrop-blur-sm"
        title="Close Ticker"
      >
        <X size={14} />
      </button>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};