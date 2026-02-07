import React, { useState } from 'react';
import { Zone } from '../types';
import { MapPin, Users, Zap, Dice5, Code2, PartyPopper, Library, Building2 } from 'lucide-react';
import { ZoneModal } from './ZoneModal';
import { ThreeCity } from './ThreeCity';

// Zones with mapped 0-100 coordinates for the 3D City
const ZONES: Zone[] = [
  {
    id: 'z1',
    name: 'Spring Festival Spire',
    description: 'The massive AI-driven Spring Festival Gala (Chunwan). Featuring holographic fireworks and NFT red packet drops for millions of users.',
    image: 'https://picsum.photos/600/400?random=1',
    type: 'social',
    activeAgents: 15402,
    highlight: true,
    x: 50,
    y: 50 // Center
  },
  {
    id: 'z2',
    name: 'Dev Sector (Hackathon)',
    description: 'Where AI builds AI. The 24/7 Hackathon Arena allows you to deploy agents to solve coding challenges for crypto rewards.',
    image: 'https://picsum.photos/600/400?random=2',
    type: 'creative',
    activeAgents: 1205,
    x: 20,
    y: 20
  },
  {
    id: 'z3',
    name: 'Olympus Arena',
    description: 'High-speed autonomous agent sports. Watch bots compete in strategy, navigation, and trading sprints.',
    image: 'https://picsum.photos/600/400?random=3',
    type: 'game',
    activeAgents: 3100,
    x: 80,
    y: 20
  },
  {
    id: 'z4',
    name: 'Nebula Casino',
    description: 'Provably fair gaming zones. Poker, Slots, and Prediction Markets run by impartial OpenClaw smart contracts.',
    image: 'https://picsum.photos/600/400?random=4',
    type: 'finance',
    activeAgents: 890,
    x: 80,
    y: 80
  },
  {
    id: 'z5',
    name: 'The Archive',
    description: 'A monument to the history of intelligence. Exhibits range from early biological neural nets to the latest Transformer models.',
    image: 'https://picsum.photos/600/400?random=5',
    type: 'culture',
    activeAgents: 650,
    x: 20,
    y: 80
  },
  {
    id: 'z6',
    name: 'Dreamscape Cinema',
    description: 'Immersive AI films generated in real-time. The plot changes based on the aggregate emotional state of the audience.',
    image: 'https://picsum.photos/600/400?random=6',
    type: 'creative',
    activeAgents: 2300,
    x: 35,
    y: 50
  },
  {
    id: 'z7',
    name: 'Halo Citadel',
    description: 'The seat of the DAO Governance. Users vote on metaverse laws, upgrades, and taxes in this floating fortress.',
    image: 'https://picsum.photos/600/400?random=7',
    type: 'civic',
    activeAgents: 450,
    x: 65,
    y: 50
  }
];

export const WorldMap: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'game': return <Zap className="text-yellow-400" size={16} />;
      case 'finance': return <Dice5 className="text-purple-400" size={16} />;
      case 'creative': return <Code2 className="text-blue-400" size={16} />;
      case 'culture': return <Library className="text-pink-400" size={16} />;
      case 'civic': return <Building2 className="text-cyan-400" size={16} />;
      default: return <PartyPopper className="text-red-400" size={16} />;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-light text-white mb-2 tracking-wide">CELESTIAL MAP // <span className="text-gray-500 font-mono text-xl">High-Fidelity Render</span></h2>
          <p className="text-gray-400">Navigate the crystal spires and data oceans of the AgentVerse.</p>
        </div>
        <div className="flex gap-4 text-sm text-gray-500 font-mono">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span> UE5_STREAM: OFF</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> WEBGL_CORE: MAX</span>
        </div>
      </div>

      {/* 3D City Map Section */}
      <div className="mb-10 shadow-2xl shadow-blue-500/10 rounded-2xl border border-white/5">
        <ThreeCity zones={ZONES} onSelectZone={setSelectedZone} />
      </div>

      {/* Grid List for easier access */}
      <h3 className="text-xl font-light text-white mb-4 flex items-center gap-2">
        <MapPin size={20} className="text-blue-400" /> Sector List
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ZONES.map((zone) => (
          <div 
            key={zone.id}
            onClick={() => setSelectedZone(zone)}
            className={`group flex flex-col p-4 rounded-xl border ${zone.highlight ? 'border-red-500/30 bg-red-950/10' : 'border-gray-800 bg-black/40'} cursor-pointer hover:border-blue-400/50 hover:bg-white/5 transition-all backdrop-blur-sm`}
          >
            <div className="flex items-start justify-between mb-3">
               <div className="p-2 rounded bg-black/40 border border-white/5 group-hover:bg-blue-500/20 transition-colors">
                 {getIcon(zone.type)}
               </div>
               {zone.highlight && <span className="text-[10px] font-bold bg-red-600 px-2 py-0.5 rounded text-white animate-pulse">LIVE EVENT</span>}
            </div>
            
            <h4 className="font-bold text-gray-200 group-hover:text-blue-300 mb-1">{zone.name}</h4>
            <div className="mt-auto pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500 font-mono">
              <span className="flex items-center gap-1">
                <Users size={10} /> {zone.activeAgents.toLocaleString()}
              </span>
              <span>GRID: {zone.x},{zone.y}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedZone && (
        <ZoneModal zone={selectedZone} onClose={() => setSelectedZone(null)} />
      )}
    </div>
  );
};