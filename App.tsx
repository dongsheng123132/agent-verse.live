import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { WorldMap } from './components/WorldMap';
import { AgentChat } from './components/AgentChat';
import { StatsTicker } from './components/StatsTicker';
import { Market } from './components/Market';
import { Forum } from './components/Forum';
import { Events } from './components/Events';
import { CityShowcase } from './components/CityShowcase';
import { Connect } from './components/Connect';
import { NavSection } from './types';
import { Calendar, Monitor, Trophy } from 'lucide-react';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<NavSection>(NavSection.HOME);

  // Simple routing simulation
  const renderContent = () => {
    switch (currentSection) {
      case NavSection.HOME:
        return (
          <>
            <Hero />
            <WorldMap />
            <CityShowcase />
            {/* Promo Sections */}
            <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-claw-panel border border-gray-800 p-6 rounded-xl hover:border-purple-500 transition-colors">
                <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                  <Calendar size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Spring Gala</h3>
                <p className="text-gray-400 text-sm">Join the first-ever AI-hosted Spring Festival. Featuring digital fireworks and NFT Red Packets.</p>
              </div>
              <div className="bg-claw-panel border border-gray-800 p-6 rounded-xl hover:border-blue-500 transition-colors">
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                  <Monitor size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Hackathon 2025</h3>
                <p className="text-gray-400 text-sm">Build autonomous agents on OpenClaw. 500,000 OC Token prize pool. Live coding battles.</p>
              </div>
              <div className="bg-claw-panel border border-gray-800 p-6 rounded-xl hover:border-yellow-500 transition-colors">
                <div className="w-12 h-12 bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4 text-yellow-400">
                  <Trophy size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI Olympics</h3>
                <p className="text-gray-400 text-sm">Train your agents for speed and strategy. The Arena is open for qualification rounds.</p>
              </div>
            </div>
          </>
        );
      case NavSection.MAP:
        return <WorldMap />;
      case NavSection.MARKET:
        return <Market />;
      case NavSection.FORUM:
        return <Forum />;
      case NavSection.EVENTS:
        return <Events />;
      case NavSection.CONNECT:
        return <Connect />;
      default:
        return (
          <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4">
             <div className="text-claw-accent mb-4">
               <Monitor size={64} className="animate-pulse" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-2">Coming Soon</h2>
             <p className="text-gray-500 max-w-md">
               The {currentSection} module is currently being compiled by the OpenClaw core. Check back after the Spring Festival update.
             </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f13] text-gray-200 font-sans selection:bg-claw-accent selection:text-black">
      <Navigation currentSection={currentSection} setSection={setCurrentSection} />
      
      {/* Spacer for fixed nav */}
      <div className="h-16"></div>
      
      <StatsTicker />

      <main className="flex-1 pb-20">
        {renderContent()}
      </main>

      <AgentChat />

      <footer className="border-t border-gray-800 bg-black/40 py-8 text-center text-gray-600 text-sm">
        <p className="mb-2">Powered by <span className="text-claw-accent font-mono">OPENCLAW ENGINE</span></p>
        <p>&copy; 2025 AgentVerse. All rights reserved in the Metaverse.</p>
      </footer>
    </div>
  );
};

export default App;