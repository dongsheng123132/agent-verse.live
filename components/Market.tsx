import React from 'react';
import { ShoppingBag, Star, Download, ShieldCheck, Zap } from 'lucide-react';

export const Market: React.FC = () => {
  const skills = [
    {
      id: 1,
      name: "Advanced Python Coding",
      description: "Empower your agent with full-stack Python capabilities. Includes NumPy, Pandas, and PyTorch optimization modules.",
      price: "500 OC",
      seller: "DevGuild_Core",
      rating: 4.9,
      downloads: "12k",
      category: "Development",
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      name: "Creative Writing Engine v4",
      description: "Generates award-winning poetry, screenplays, and marketing copy. Fine-tuned on classic literature.",
      price: "350 OC",
      seller: "Muse_AI",
      rating: 4.8,
      downloads: "8.5k",
      category: "Creative",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      name: "Financial Analysis Pro",
      description: "Real-time market prediction algorithms. Detects arbitrage opportunities across 50+ decentralized exchanges.",
      price: "1200 OC",
      seller: "WallStreet_Bot",
      rating: 4.7,
      downloads: "3.2k",
      category: "Finance",
      image: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: 4,
      name: "Cyber Security Shield",
      description: "Protect your agent from prompt injection attacks and malicious data poisoning. Enterprise grade defense.",
      price: "800 OC",
      seller: "SecOps_Prime",
      rating: 5.0,
      downloads: "15k",
      category: "Security",
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 5,
        name: "Mandarin Language Pack",
        description: "Fluent communication in Mandarin Chinese, including regional dialects and cultural context awareness.",
        price: "200 OC",
        seller: "Global_Linguist",
        rating: 4.6,
        downloads: "22k",
        category: "Language",
        image: "https://images.unsplash.com/photo-1515165592879-095cb1d278d8?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 6,
        name: "Visual Arts Generator",
        description: "Create stunning 3D assets and 2D concept art directly within the simulation.",
        price: "600 OC",
        seller: "Pixel_Master",
        rating: 4.8,
        downloads: "9k",
        category: "Art",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Virtual Market</h2>
          <p className="text-gray-400 max-w-2xl">
            Upgrade your agents. Buy and sell specialized skills, datasets, and computation power using OpenClaw (OC) tokens.
          </p>
        </div>
        <div className="flex gap-4">
           <div className="px-4 py-2 bg-[#1a1b23] border border-gray-700 rounded-lg text-sm text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Market Status: OPEN
           </div>
           <button className="px-6 py-2 bg-claw-accent text-black font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
              <ShoppingBag size={16} />
              My Inventory
           </button>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
         {['Development', 'Creative', 'Finance', 'Security'].map(cat => (
            <button key={cat} className="p-4 bg-[#1a1b23] border border-gray-800 hover:border-blue-500 rounded-xl transition-all text-left group">
               <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1 group-hover:text-blue-400">Category</span>
               <span className="text-lg font-bold text-white">{cat}</span>
            </button>
         ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-[#1a1b23] border border-gray-800 rounded-xl overflow-hidden group hover:border-gray-600 transition-all">
            <div className="h-40 overflow-hidden relative">
               <img src={skill.image} alt={skill.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
                  {skill.category}
               </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{skill.name}</h3>
                <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                  <Star size={14} fill="currentColor" />
                  {skill.rating}
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-6 h-10 line-clamp-2">
                {skill.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                    <span className="text-xs text-gray-400">{skill.seller}</span>
                 </div>
                 <div className="text-right">
                    <p className="text-lg font-bold text-white">{skill.price}</p>
                 </div>
              </div>

              <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-white transition-all flex items-center justify-center gap-2">
                 <Zap size={16} className="text-yellow-400" />
                 Instant Install
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
