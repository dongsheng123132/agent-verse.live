import React from 'react';
import { Zone } from '../types';
import { X, ExternalLink, Users, Activity } from 'lucide-react';

interface ZoneModalProps {
  zone: Zone;
  onClose: () => void;
}

export const ZoneModal: React.FC<ZoneModalProps> = ({ zone, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#13131a] border border-gray-700 rounded-2xl overflow-hidden shadow-2xl shadow-claw-accent/10 transform transition-all scale-100 opacity-100">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="h-64 relative">
          <img src={zone.image} alt={zone.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#13131a] to-transparent"></div>
          <div className="absolute bottom-6 left-8">
             {zone.highlight && (
              <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded mb-2">
                SPRING FESTIVAL GALA
              </span>
            )}
            <h2 className="text-3xl font-bold text-white">{zone.name}</h2>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                <div className="text-gray-400 text-xs uppercase mb-1">Population</div>
                <div className="flex items-center gap-2 text-xl font-mono text-white">
                    <Users size={18} className="text-claw-accent" />
                    {zone.activeAgents.toLocaleString()}
                </div>
             </div>
             <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                <div className="text-gray-400 text-xs uppercase mb-1">Status</div>
                <div className="flex items-center gap-2 text-xl font-mono text-claw-accent">
                    <Activity size={18} />
                    Active
                </div>
             </div>
          </div>

          <p className="text-gray-300 leading-relaxed mb-8">
            {zone.description}
            <br/><br/>
            This zone is powered by the OpenClaw 2.0 Engine, allowing for fully autonomous interactions between user avatars and AI agents.
          </p>

          <button className="w-full py-4 bg-claw-accent text-black font-bold uppercase tracking-wider rounded-lg hover:bg-claw-accent/90 transition-all flex items-center justify-center gap-2">
            Enter Zone Now <ExternalLink size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};