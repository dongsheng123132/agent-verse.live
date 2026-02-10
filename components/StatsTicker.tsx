import React from 'react';

export const StatsTicker: React.FC = () => {
  return (
    <div className="w-full bg-black/40 border-b border-gray-800 h-8 flex items-center overflow-hidden whitespace-nowrap">
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
      <style>{`
        @keyframes slide {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};