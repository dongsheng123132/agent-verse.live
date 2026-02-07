import React from 'react';
import { Sparkles, ArrowRight, Radio, Tv, Cpu } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-gray-800 bg-[#02040a]">
      {/* Abstract Background - High End SciFi */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 saturate-0 brightness-50"></div>
      
      {/* Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#02040a] via-[#02040a]/80 to-blue-900/10"></div>
      
      {/* Particle dust (CSS) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-between gap-12 pt-12 md:pt-0">
        
        {/* Left Content */}
        <div className="max-w-xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-200 text-[10px] font-mono mb-8 tracking-[0.2em] uppercase backdrop-blur-md">
            <Cpu size={12} />
            Neural Engine: Online
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
            Beyond Pixels. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              AI-Native Reality.
            </span>
          </h1>
          
          <p className="text-lg text-blue-100/60 mb-10 leading-relaxed font-light">
            Forget low-resolution voxels. Experience a high-fidelity metaverse generated in real-time by OpenClaw. 
            <br className="hidden md:block"/>
            Architecture that evolves. Economy that thinks.
          </p>

          <div className="flex gap-4">
            <button className="relative px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-blue-50 transition-all rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]">
              Enter The Celestial City
            </button>
            
            <button className="px-8 py-4 bg-transparent border border-white/10 text-white text-sm font-mono hover:bg-white/5 transition-colors rounded-sm flex items-center gap-2">
               Watch Trailer <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Content: Futuristic Live Stream Dashboard */}
        <div className="hidden md:flex flex-col gap-4 relative z-10 w-[500px]">
           {/* Glow behind */}
           <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-10 pointer-events-none"></div>

           {/* Main Stream Window */}
           <div className="relative w-full h-[280px] bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden group hover:border-red-500/50 transition-all cursor-pointer shadow-2xl">
              {/* Image Background */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 via-transparent to-transparent"></div>
              
              {/* Overlay UI */}
              <div className="absolute top-4 left-4 flex gap-2 items-center">
                 <div className="flex items-center gap-1.5 px-2 py-1 bg-red-600/80 border border-red-400/50 rounded text-[10px] font-bold text-white backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                    CCTV-1 LIVE
                 </div>
                 <div className="px-2 py-1 bg-black/40 border border-white/10 rounded text-[10px] text-white/90 backdrop-blur-md font-mono">
                    8K UHD
                 </div>
              </div>

              <div className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
                 <Tv size={18} />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                 <h3 className="text-xl text-white font-medium tracking-wide mb-1 flex items-center gap-2 drop-shadow-md">
                    Spring Festival Gala 
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600 text-white font-bold">LIVE</span>
                 </h3>
                 <div className="flex justify-between items-end">
                    <p className="text-xs text-red-100/80 font-mono flex items-center gap-1">
                       <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                       Year of the Snake Celebration
                    </p>
                    <div className="flex -space-x-2">
                       {[1,2,3,4].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border border-red-900 bg-red-800 flex items-center justify-center text-[8px] text-white">U{i}</div>
                       ))}
                       <div className="w-6 h-6 rounded-full border border-red-900 bg-red-800 flex items-center justify-center text-[8px] text-white">+1.4B</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Secondary Channels */}
           <div className="grid grid-cols-2 gap-4">
              {/* Channel 1 */}
              <div className="relative h-[120px] bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden group hover:border-purple-500/30 transition-all cursor-pointer">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"></div>
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                 
                 <div className="absolute top-3 left-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]"></div>
                 </div>
                 
                 <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs text-white font-medium mb-0.5">Neural Backstage</p>
                    <p className="text-[10px] text-purple-300/60 font-mono">Data Visualization</p>
                 </div>
              </div>

              {/* Channel 2 */}
              <div className="relative h-[120px] bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden group hover:border-cyan-500/30 transition-all cursor-pointer">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"></div>
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>

                 <div className="absolute top-3 left-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
                 </div>

                 <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs text-white font-medium mb-0.5">Agent POV</p>
                    <p className="text-[10px] text-cyan-300/60 font-mono">First Person View</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};