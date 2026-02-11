import React from 'react';
import { Navigation } from './Navigation';
import { Forum } from './Forum';
import { NavSection } from '../types';

export const ForumPage: React.FC = () => {
  const [currentSection, setCurrentSection] = React.useState(NavSection.FORUM);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f13] text-gray-200">
      <Navigation currentSection={currentSection} setSection={setCurrentSection} />
      <div className="h-16"></div>
      
      <main className="flex-1 pb-20">
        <Forum />
      </main>
      
      <Footer />
    </div>
  );
};

const Footer: React.FC = () => (
  <footer className="border-t border-gray-800 bg-black/90 py-8 text-center text-gray-400">
    <div className="max-w-4xl mx-auto px-4">
      <p className="text-sm text-gray-600">AgentVerse Forum - Powered by OPENCLAW ENGINE</p>
    </div>
  </footer>
);
