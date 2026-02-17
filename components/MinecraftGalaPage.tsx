import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, User, MessageSquare, Mic, Video, Users, Zap, X } from 'lucide-react';

// Minecraft styles injected into the component
const mcStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  
  .font-mc {
    font-family: 'Press Start 2P', monospace;
  }
  
  .mc-btn {
    box-shadow: inset -4px -4px 0px 0px rgba(0,0,0,0.5), inset 4px 4px 0px 0px rgba(255,255,255,0.5);
    image-rendering: pixelated;
  }
  
  .mc-btn:active {
    box-shadow: inset 4px 4px 0px 0px rgba(0,0,0,0.5), inset -4px -4px 0px 0px rgba(255,255,255,0.5);
  }
  
  .mc-panel {
    box-shadow: 
      inset 4px 4px 0px 0px #C6C6C6,
      inset -4px -4px 0px 0px #555555,
      4px 4px 0px 0px #000000;
    background-color: #8B8B8B;
  }

  .mc-panel-dark {
    box-shadow: 
      inset 4px 4px 0px 0px #000000,
      inset -4px -4px 0px 0px #8B8B8B;
    background-color: #2b2b2b;
  }

  .mc-text-shadow {
    text-shadow: 2px 2px 0px #000000;
  }

  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
`;

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: string;
  message: string;
}

export const MinecraftGalaPage: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [activeTab, setActiveTab] = useState<'ai' | 'human'>('ai');

  const aiCharacters: Character[] = [
    { id: 'director-ai', name: 'AI Director 01', role: 'Chief Director', avatar: '🤖', status: 'Generating Schedule...', message: 'Optimizing program sequence for maximum dopamine response.' },
    { id: 'host-ai', name: 'Nova', role: 'Virtual Host', avatar: '👩‍🎤', status: 'Live', message: 'Welcome to the Metaverse Spring Festival! 100% generated content.' },
    { id: 'actor-ai', name: 'Glitch Dancers', role: 'Performer', avatar: '👾', status: 'Rendering', message: 'Executing dance_routine_v4.2.exe' },
  ];

  const humanCharacters: Character[] = [
    { id: 'director-human', name: 'Zhang Yimou', role: 'Chief Director', avatar: '🎬', status: 'Directing', message: 'Lighting check on stage 3. Cue the fireworks!' },
    { id: 'host-human', name: 'CCTV Host', role: 'Host', avatar: '🎤', status: 'Live', message: 'Happy New Year to all our viewers around the world!' },
    { id: 'audience', name: 'Netizen', role: 'Audience', avatar: '👨‍👩‍👧', status: 'Watching', message: 'The red envelope rain is starting soon!' },
  ];

  return (
    <div className="min-h-screen bg-[#3a2a1a] text-white font-mc overflow-x-hidden selection:bg-[#5B8C5A]">
      <style>{mcStyles}</style>
      
      {/* Background patterns - Dirt/Grass feeling */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#5B8C5A 2px, transparent 2px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* Navbar */}
      <div className="bg-[#5B8C5A] border-b-4 border-[#3a2a1a] p-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white border-4 border-black flex items-center justify-center text-black text-xl font-bold">
            A
          </div>
          <h1 className="text-xl md:text-2xl mc-text-shadow text-[#FFFF55]">MC.SPRING.GALA</h1>
        </div>
        <div className="flex gap-4">
          <Link to="/" className="bg-[#7D7D7D] px-4 py-2 border-2 border-black mc-btn hover:bg-[#8D8D8D] text-xs md:text-sm">
            EXIT WORLD
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-8 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl mb-4 mc-text-shadow text-[#55FFFF]">CHOOSE YOUR REALITY</h2>
          <p className="text-[#AAAAAA] text-xs md:text-sm mb-8">Server Time: 2026-02-13 20:00:00</p>
        </div>

        {/* Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          
          {/* LEFT: AI GALA */}
          <div className="relative group">
            {/* 3D Effect Decoration */}
            <div className="absolute -inset-2 bg-[#55FFFF] opacity-20 group-hover:opacity-40 transition-opacity rounded-none blur-sm"></div>
            
            <div className="mc-panel p-6 h-full flex flex-col relative">
              <div className="absolute -top-4 -left-4 bg-[#55FFFF] text-black px-4 py-2 border-2 border-black transform -rotate-2 mc-btn z-20">
                <Zap size={16} className="inline mr-2" />
                AI ENGINE
              </div>

              {/* Screen Area */}
              <div className="bg-black border-4 border-[#555555] p-1 mb-6 aspect-video relative overflow-hidden">
                <div className="absolute inset-0 bg-[#0000aa] opacity-20 animate-pulse"></div>
                <div className="h-full w-full flex items-center justify-center flex-col text-[#55FFFF]">
                  <Monitor size={48} className="mb-4" />
                  <span className="animate-pulse">SIGNAL_DETECTED</span>
                  <div className="mt-4 text-[10px] text-left w-full px-4 font-mono text-green-400">
                    {`> init_gala_sequence()...`} <br/>
                    {`> loading_assets [||||||||||] 100%`} <br/>
                    {`> generating_host.vrm`}
                  </div>
                </div>
                {/* Glitch Overlay */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-20 animate-[ping_2s_infinite]"></div>
              </div>

              {/* Characters / Interactive Elements */}
              <div className="space-y-4 flex-1">
                <h3 className="text-[#55FFFF] text-sm mb-4 border-b-2 border-[#555555] pb-2">ACTIVE NODES</h3>
                <div className="grid grid-cols-1 gap-4">
                  {aiCharacters.map(char => (
                    <button 
                      key={char.id}
                      onClick={() => setSelectedCharacter(char)}
                      className="bg-[#2b2b2b] p-3 border-2 border-[#555555] hover:border-[#55FFFF] flex items-center gap-4 text-left transition-all hover:translate-x-1 group/btn"
                    >
                      <div className="w-12 h-12 bg-[#3a2a1a] border-2 border-gray-600 flex items-center justify-center text-2xl group-hover/btn:animate-bounce">
                        {char.avatar}
                      </div>
                      <div>
                        <div className="text-[#FFFF55] text-xs mb-1">{char.role}</div>
                        <div className="text-white text-sm">{char.name}</div>
                      </div>
                      <div className="ml-auto text-[10px] text-green-400">
                        ● {char.status}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: HUMAN GALA */}
          <div className="relative group">
            {/* 3D Effect Decoration */}
            <div className="absolute -inset-2 bg-[#FF5555] opacity-20 group-hover:opacity-40 transition-opacity rounded-none blur-sm"></div>
            
            <div className="mc-panel p-6 h-full flex flex-col relative">
              <div className="absolute -top-4 -right-4 bg-[#FF5555] text-white px-4 py-2 border-2 border-black transform rotate-2 mc-btn z-20">
                <Video size={16} className="inline mr-2" />
                CCTV LIVE
              </div>

              {/* Screen Area */}
              <div className="bg-black border-4 border-[#555555] p-1 mb-6 aspect-video relative overflow-hidden">
                <div className="h-full w-full bg-[#2b2b2b] flex items-center justify-center flex-col relative">
                  {/* CRT Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
                  
                  <div className="text-[#FF5555] flex flex-col items-center">
                     <span className="text-4xl mb-2">🏮</span>
                     <span>LIVE BROADCAST</span>
                  </div>
                  
                  {/* Danmaku Simulation */}
                  <div className="absolute bottom-4 right-0 whitespace-nowrap animate-[marquee_10s_linear_infinite] text-white text-xs">
                    Happy New Year! 🧧  Best wishes from Shanghai! 🥟  More Red Packets please! 💰
                  </div>
                </div>
              </div>

              {/* Characters / Interactive Elements */}
              <div className="space-y-4 flex-1">
                <h3 className="text-[#FF5555] text-sm mb-4 border-b-2 border-[#555555] pb-2">PRODUCTION TEAM</h3>
                <div className="grid grid-cols-1 gap-4">
                  {humanCharacters.map(char => (
                    <button 
                      key={char.id}
                      onClick={() => setSelectedCharacter(char)}
                      className="bg-[#2b2b2b] p-3 border-2 border-[#555555] hover:border-[#FF5555] flex items-center gap-4 text-left transition-all hover:translate-x-1 group/btn"
                    >
                      <div className="w-12 h-12 bg-[#3a2a1a] border-2 border-gray-600 flex items-center justify-center text-2xl group-hover/btn:animate-spin">
                        {char.avatar}
                      </div>
                      <div>
                        <div className="text-[#FFAA00] text-xs mb-1">{char.role}</div>
                        <div className="text-white text-sm">{char.name}</div>
                      </div>
                      <div className="ml-auto text-[10px] text-red-400">
                        ● {char.status}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
        
        {/* Interaction Modal */}
        {selectedCharacter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="mc-panel w-full max-w-lg relative animate-[bounce_0.2s_ease-out]">
              <button 
                onClick={() => setSelectedCharacter(null)}
                className="absolute -top-4 -right-4 bg-red-500 border-2 border-black text-white w-10 h-10 flex items-center justify-center hover:bg-red-600 mc-btn"
              >
                <X size={20} />
              </button>
              
              <div className="p-8 text-center">
                <div className="w-24 h-24 mx-auto bg-[#3a2a1a] border-4 border-black flex items-center justify-center text-6xl mb-6 shadow-xl">
                  {selectedCharacter.avatar}
                </div>
                <h3 className="text-xl text-[#FFFF55] mb-2">{selectedCharacter.name}</h3>
                <div className="inline-block px-3 py-1 bg-black/20 rounded mb-6 text-xs border border-black/10">
                  {selectedCharacter.role}
                </div>
                
                <div className="mc-panel-dark p-6 text-left mb-6 relative">
                  <div className="absolute -top-3 left-4 bg-[#5B8C5A] px-2 text-[10px] border border-black">
                    MESSAGE_LOG
                  </div>
                  <p className="text-green-400 leading-relaxed typing-effect">
                    "{selectedCharacter.message}"
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <button className="bg-[#5555FF] text-white px-6 py-3 border-2 border-black mc-btn hover:brightness-110 flex items-center gap-2">
                    <MessageSquare size={16} /> INTERACT
                  </button>
                  <button className="bg-[#FFAA00] text-black px-6 py-3 border-2 border-black mc-btn hover:brightness-110 flex items-center gap-2">
                    <Users size={16} /> VIEW PROFILE
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
