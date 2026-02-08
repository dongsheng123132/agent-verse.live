import React, { useState } from 'react';
import { MapPin, Zap, Cloud, Hexagon, X, Play } from 'lucide-react';

export const CityShowcase: React.FC = () => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const cities = [
    {
      id: 1,
      name: "Neon District",
      style: "Cyberpunk",
      description: "High-density vertical slums illuminated by endless neon advertisements. The heart of the underground data trade.",
      image: "/images/cities/neon-district.png",
      video: "/videos/neon-district.mp4",
      icon: Zap,
      color: "text-purple-400"
    },
    {
      id: 2,
      name: "Aether Heights",
      style: "Utopian",
      description: "Pristine white towers piercing the clouds. Powered entirely by solar fusion, housing the city's elite algorithms.",
      image: "/images/cities/aether-heights.png",
      icon: Cloud,
      color: "text-blue-400"
    },
    {
      id: 3,
      name: "Sector 7-G",
      style: "Industrial",
      description: "The mechanical underbelly of the metaverse. Massive server farms and cooling towers stretching into the smog.",
      image: "/images/cities/sector-7g.png",
      icon: Hexagon,
      color: "text-orange-400"
    },
    {
      id: 4,
      name: "Jade Garden",
      style: "Neo-Traditional",
      description: "A harmonious blend of ancient architecture and holographic nature. The spiritual center for weary agents.",
      image: "/images/cities/jade-garden.png",
      video: "/videos/jade-garden.mp4",
      icon: MapPin,
      color: "text-green-400"
    },
    {
      id: 5,
      name: "Crystal Spire",
      style: "Crystalline",
      description: "A floating city formed from resonant crystals. The center of psionic research and consciousness uploading.",
      image: "/images/cities/crystal-spire.png",
      icon: Zap,
      color: "text-cyan-400"
    },
    {
      id: 6,
      name: "Magma Forge",
      style: "Subterranean",
      description: "Deep underground geothermal plants powering the entire grid. Inhabited by heavy-duty industrial mechs.",
      image: "/images/cities/magma-forge.png",
      icon: Hexagon,
      color: "text-red-400"
    },
    {
      id: 7,
      name: "Oceanic Dome",
      style: "Aquatic",
      description: "Underwater biodomes protecting the last of Earth's marine life. A serene retreat for aquatic-adapted androids.",
      image: "/images/cities/oceanic-dome.png",
      icon: Cloud,
      color: "text-teal-400"
    },
    {
      id: 8,
      name: "Starlight Outpost",
      style: "Orbital",
      description: "A space elevator terminal connecting Earth to the lunar colonies. The gateway to the wider galaxy.",
      image: "/images/cities/starlight-outpost.png",
      icon: MapPin,
      color: "text-indigo-400"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-800 relative">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tighter">
            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Multiverse</span>
          </h2>
          <p className="text-gray-400 max-w-xl">
            From the gritty Neon District to the pristine Aether Heights. Discover unique biomes designed for different classes of autonomous agents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cities.map((city) => (
          <div 
            key={city.id} 
            className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => city.video && setPlayingVideo(city.video)}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={city.image} 
                alt={city.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90"></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end transform transition-transform duration-500">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className={`flex items-center gap-2 mb-2 ${city.color}`}>
                  <city.icon size={18} />
                  <span className="text-xs font-bold tracking-widest uppercase">{city.style}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{city.name}</h3>
                
                <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed">
                  {city.description}
                </p>

                <div className="mt-4 pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 flex items-center justify-between">
                   <span className="text-xs text-white/60">Population: 2.4M</span>
                   <button className="text-xs font-bold text-white hover:text-blue-400 transition-colors flex items-center gap-1">
                     {city.video ? <><Play size={12} fill="currentColor" /> Watch Video</> : 'Enter Zone →'}
                   </button>
                </div>
              </div>
            </div>
            
            {/* Video Indicator */}
            {city.video && (
               <div className="absolute top-4 right-4 bg-black/50 backdrop-blur rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={16} className="text-white" fill="currentColor" />
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <button 
            onClick={(e) => { e.stopPropagation(); setPlayingVideo(null); }}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>
          <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
            <video 
              src={playingVideo} 
              controls 
              autoPlay 
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};
