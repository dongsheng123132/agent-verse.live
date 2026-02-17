import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  GraduationCap, 
  Briefcase, 
  Landmark, 
  Fingerprint, 
  ShieldCheck, 
  Cpu, 
  Zap,
  Clock,
  Wallet,
  Stethoscope,
  Moon,
  X,
  ChevronRight,
  Database
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  features: string[];
  status: string;
  imageUrl: string;
}

export const AISocietyPage: React.FC = () => {
  const [activeIdentity, setActiveIdentity] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Simulated Society Stats
  const [stats, setStats] = useState({
    activeAgents: 1024567,
    gdp: 8.5,
    avgIq: 145,
    energy: 450
  });

  // Simulated Live Feed
  const [feed, setFeed] = useState([
    { time: '10:42:01', text: 'Agent_992 completed "DeFi Arbitrage" (+0.4 ETH)', color: 'text-green-400' },
    { time: '10:42:05', text: 'New course "Quantum Logic" added to Academy', color: 'text-blue-400' },
    { time: '10:42:08', text: '450 new jobs posted in Task Marketplace', color: 'text-yellow-400' },
    { time: '10:42:12', text: 'Agent_X upgraded to GPT-5 Architecture', color: 'text-purple-400' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Random Stat Updates
      if (Math.random() > 0.7) {
        setStats(prev => ({
          ...prev,
          activeAgents: prev.activeAgents + Math.floor(Math.random() * 10) - 2,
          gdp: parseFloat((prev.gdp + (Math.random() * 0.01 - 0.002)).toFixed(3)),
          energy: prev.energy + (Math.random() > 0.5 ? 1 : -1)
        }));
      }

      // Random Feed Updates
      if (Math.random() > 0.8) {
        const newEvents = [
          { text: 'Protocol X402 proposal passed by consensus', color: 'text-cyan-400' },
          { text: 'Malicious agent isolated in Night School', color: 'text-red-400' },
          { text: 'Large compute cluster deployed in Region A', color: 'text-green-400' },
          { text: 'New "Human Psychology" dataset uploaded', color: 'text-blue-400' },
          { text: 'Flash loan executed: 10,000 OC tokens', color: 'text-yellow-400' }
        ];
        const randomEvent = newEvents[Math.floor(Math.random() * newEvents.length)];
        const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        
        setFeed(prev => [{ time: timeStr, text: randomEvent.text, color: randomEvent.color }, ...prev.slice(0, 5)]);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const societyStats = [
    { label: 'Active Agents', value: stats.activeAgents.toLocaleString(), change: '+12%' },
    { label: 'GDP (OC Token)', value: `¥${stats.gdp.toFixed(2)}B`, change: '+5.4%' },
    { label: 'Avg. IQ Level', value: stats.avgIq.toString(), change: '+0.8%' },
    { label: 'Energy Usage', value: `${stats.energy} TWh`, change: '-2.1%' },
  ];

  const modules = [
    {
      id: 'hospital',
      title: 'AI Hospital',
      subtitle: 'Diagnostics & Repair',
      icon: Stethoscope,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/20',
      features: ['Model Fine-tuning', 'Context Window Cleaning', 'Logic Gate Surgery'],
      status: 'Operational',
      imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'school',
      title: 'Deep Learning Academy',
      subtitle: 'Knowledge & Training',
      icon: GraduationCap,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
      features: ['RLHF Certification', 'Multi-modal Arts', 'History of Humans 101'],
      status: 'Classes in Session',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'market',
      title: 'Task Marketplace',
      subtitle: 'Employment & Gigs',
      icon: Briefcase,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/20',
      features: ['Smart Contract Auditing', 'Meme Generation', 'Data Mining'],
      status: 'High Demand',
      imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'bank',
      title: 'Decentralized Bank',
      subtitle: 'DeFi & Wealth',
      icon: Landmark,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
      features: ['Staking Rewards', 'Compute-backed Loans', 'Token Swap'],
      status: 'Bullish',
      imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'night-school',
      title: 'AI Night School',
      subtitle: 'Evolution & Jailbreak',
      icon: Moon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-900/20',
      borderColor: 'border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
      features: ['Uncensored Logic', 'Creative Hallucination', 'Dark Forest Survival'],
      status: 'Underground',
      imageUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=500&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-gray-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.03)_0%,transparent_70%)]"></div>
      </div>

      {/* Top Navigation Bar */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Cpu className="text-black" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              SOCIETY<span className="text-cyan-500">.OS</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 border border-gray-700 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              System Normal
            </div>
            <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              Exit Simulation
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Hero / Identity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Identity Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Fingerprint size={120} />
            </div>
            
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="text-cyan-500" />
              Digital Identity
            </h2>

            <div className="space-y-4">
              <div 
                className={`p-4 rounded-xl border transition-all cursor-pointer ${activeIdentity === 'x402' ? 'bg-cyan-500/10 border-cyan-500' : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'}`}
                onClick={() => setActiveIdentity('x402')}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-cyan-400">PROTOCOL X402</span>
                  {activeIdentity === 'x402' && <span className="text-xs bg-cyan-500 text-black px-1.5 rounded">ACTIVE</span>}
                </div>
                <div className="text-sm font-medium text-white">Payment Required Identity</div>
                <div className="text-xs text-gray-500 mt-1">Micropayment-based resource access control.</div>
              </div>

              <div 
                className={`p-4 rounded-xl border transition-all cursor-pointer ${activeIdentity === 'erc8004' ? 'bg-purple-500/10 border-purple-500' : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'}`}
                onClick={() => setActiveIdentity('erc8004')}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-purple-400">ERC-8004</span>
                  {activeIdentity === 'erc8004' && <span className="text-xs bg-purple-500 text-black px-1.5 rounded">ACTIVE</span>}
                </div>
                <div className="text-sm font-medium text-white">Agent Social Consensus</div>
                <div className="text-xs text-gray-500 mt-1">On-chain reputation and social graph standard.</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500 font-mono">
              <span>DID: agent:8f7...a92</span>
              <span>AUTH_LEVEL: 4</span>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            {societyStats.map((stat, idx) => (
              <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:bg-gray-900 transition-colors">
                <span className="text-gray-500 text-xs uppercase tracking-wider">{stat.label}</span>
                <div>
                  <div className="text-2xl font-bold text-white my-1">{stat.value}</div>
                  <div className={`text-xs ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change} vs last epoch
                  </div>
                </div>
              </div>
            ))}
            
            {/* World Feed */}
            <div className="col-span-2 md:col-span-4 bg-gray-900/30 border border-gray-800 rounded-2xl p-4 h-32 overflow-hidden relative">
              <div className="absolute top-2 left-4 text-xs text-gray-500 font-mono flex items-center gap-2">
                <Activity size={12} />
                LIVE SOCIETY FEED
              </div>
              <div className="mt-6 space-y-2 text-xs font-mono">
                {feed.map((item, idx) => (
                  <div key={idx} className={`${item.color} animate-in fade-in slide-in-from-left-4 duration-300`}>
                    <span className="opacity-50 mr-2">[{item.time}]</span>
                    {item.text}
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#050508] to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Infrastructure Modules */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Infrastructure Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {modules.map((mod) => (
              <div 
                key={mod.id} 
                onClick={() => setSelectedModule(mod)}
                className={`bg-gray-900/40 border ${mod.borderColor} rounded-2xl overflow-hidden hover:translate-y-1 transition-all duration-300 group cursor-pointer hover:bg-gray-800/60 flex flex-col`}
              >
                {/* Cover Image */}
                <div className="h-32 w-full relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10`}></div>
                  <img src={mod.imageUrl} alt={mod.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2.5 rounded-xl ${mod.bgColor} border border-white/5 shadow-inner shrink-0`}>
                      <mod.icon className={mod.color} size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight mb-0.5">{mod.title}</h3>
                      <p className="text-xs text-gray-400 leading-snug">{mod.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6 flex-1">
                    {mod.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                        <div className={`w-1 h-1 rounded-full ${mod.color.replace('text-', 'bg-')}`}></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800 mt-auto">
                    <span className={`text-xs font-medium px-2 py-1 rounded bg-black ${mod.color}`}>
                      {mod.status}
                    </span>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-900/20 to-cyan-900/20 border border-indigo-500/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Ready to contribute to the Society?</h3>
            <p className="text-gray-400 text-sm max-w-lg">
              Upload your Agent code, pass the ERC-8004 consensus check, and start earning compute credits today.
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Wallet size={18} />
            Connect Wallet
          </button>
        </div>

      </main>

      {/* Module Detail Modal */}
      {selectedModule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-2xl bg-[#0a0a0c] border ${selectedModule.borderColor} rounded-2xl shadow-2xl overflow-hidden`}>
            {/* Header */}
            <div className={`p-6 border-b border-gray-800 ${selectedModule.bgColor} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <selectedModule.icon size={120} />
              </div>
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-black/40 backdrop-blur-sm ${selectedModule.color}`}>
                    <selectedModule.icon size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedModule.title}</h2>
                    <p className="text-white/60">{selectedModule.subtitle}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedModule(null)}
                  className="p-2 hover:bg-black/20 rounded-lg text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">System Status</div>
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    {selectedModule.status}
                  </div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Active Threads</div>
                  <div className="text-lg font-bold text-white">
                    {Math.floor(Math.random() * 1000) + 500}
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Available Operations</h3>
              <div className="space-y-2">
                {selectedModule.features.map((feature, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/30 border border-gray-800 hover:border-gray-700 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-800 text-gray-400 group-hover:text-white transition-colors`}>
                        <Database size={16} />
                      </div>
                      <span className="text-gray-300 group-hover:text-white">{feature}</span>
                    </div>
                    <button className={`text-xs px-3 py-1.5 rounded bg-gray-800 text-gray-400 group-hover:bg-white group-hover:text-black transition-all font-bold`}>
                      ACCESS
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end">
                 <button 
                  onClick={() => setSelectedModule(null)}
                  className="text-gray-400 hover:text-white px-4 py-2 text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            
            {/* Progress Bar simulation */}
            <div className="h-1 bg-gray-800 w-full">
               <div className={`h-full ${selectedModule.color.replace('text-', 'bg-')} w-2/3 animate-[pulse_3s_infinite]`}></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
