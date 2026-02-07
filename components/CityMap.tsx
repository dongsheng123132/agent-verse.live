import React, { useState } from 'react';
import { Zone } from '../types';
import { MapPin } from 'lucide-react';

interface CityMapProps {
  zones: Zone[];
  onSelectZone: (zone: Zone) => void;
}

export const CityMap: React.FC<CityMapProps> = ({ zones, onSelectZone }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[600px] bg-[#020204] overflow-hidden rounded-2xl border border-gray-800 group">
      
      {/* HUD Overlays */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="flex items-center gap-2 text-claw-accent font-mono text-sm tracking-widest mb-1">
          <div className="w-2 h-2 bg-claw-accent animate-pulse"></div>
          CITY_GRID_VIEW // SECTOR_01
        </div>
        <div className="text-[10px] text-gray-500 font-mono">
          ORTHOGRAPHIC PROJECTION ACTIVATED
        </div>
      </div>

      {/* 3D Scene Container */}
      <div className="absolute inset-0 perspective-1000 flex items-center justify-center pt-20">
        
        {/* The Tilted City Plane */}
        <div 
          className="relative w-[120%] h-[120%] transform rotate-x-60 preserve-3d transition-transform duration-700 ease-out"
          style={{ transform: 'rotateX(60deg) rotateZ(0deg) scale(1.2)' }}
        >
          {/* Neon Grid Floor */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.15)_1px,transparent_1px)] bg-[size:60px_60px] shadow-[0_0_100px_rgba(0,255,157,0.1)_inset]"></div>
          
          {/* Moving Scanline */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-claw-accent/10 to-transparent h-[20%] w-full animate-[scan_4s_linear_infinite] pointer-events-none"></div>

          {/* Zones / Buildings */}
          {zones.map((zone) => {
            const isHovered = hoveredId === zone.id;
            
            return (
              <div
                key={zone.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer"
                style={{ 
                  left: `${zone.x}%`, 
                  top: `${zone.y}%`,
                  zIndex: Math.floor(zone.y) // Simple Z-sorting
                }}
                onMouseEnter={() => setHoveredId(zone.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectZone(zone)}
              >
                {/* The Vertical "Building" Pillar */}
                <div className="relative preserve-3d group-hover:scale-110 transition-transform">
                  
                  {/* Base Glow Ring */}
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-2 border-dashed ${zone.highlight ? 'border-red-500 animate-spin-slow' : 'border-claw-accent/30'} transform scale-y-50`}></div>
                  
                  {/* 3D Pillar Body (Constructed of CSS faces) */}
                  <div className="relative flex flex-col items-center">
                     {/* Floating Label (Always faces camera roughly) */}
                     <div 
                        className={`absolute -top-16 whitespace-nowrap px-3 py-1 rounded bg-black/80 border ${zone.highlight ? 'border-red-500 text-red-400' : 'border-claw-accent text-claw-accent'} text-xs font-bold tracking-wider transform transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0 scale-110' : 'opacity-0 translate-y-4 scale-90'}`}
                     >
                        {zone.name}
                     </div>

                     {/* The Pin/Icon */}
                     <div className={`relative z-10 w-10 h-10 flex items-center justify-center ${zone.highlight ? 'bg-red-600' : 'bg-claw-panel'} border-2 ${isHovered ? 'border-white' : 'border-gray-600'} rounded-lg shadow-[0_0_30px_rgba(0,255,157,0.3)] transform transition-transform ${isHovered ? '-translate-y-4' : ''}`}>
                        <MapPin size={20} className={zone.highlight ? 'text-white' : 'text-claw-accent'} />
                     </div>

                     {/* The "Beam" going down */}
                     <div className={`w-1 h-12 bg-gradient-to-t ${zone.highlight ? 'from-red-500/50' : 'from-claw-accent/50'} to-transparent`}></div>
                     
                     {/* Ground contact point */}
                     <div className={`w-3 h-3 rounded-full ${zone.highlight ? 'bg-red-500' : 'bg-claw-accent'} blur-sm`}></div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(500%); opacity: 0; }
        }
        .rotate-x-60 {
          transform: rotateX(60deg);
        }
      `}</style>
    </div>
  );
};