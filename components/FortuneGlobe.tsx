import React, { useState, useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { X, Globe as GlobeIcon, Share2, Users, TrendingUp, Copy, Check } from 'lucide-react';

interface FortuneLink {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  label: string;
}

const ARC_REL_LEN = 0.4; // relative to whole arc
const FLIGHT_TIME = 2000;
const NUM_RINGS = 3;
const RINGS_MAX_R = 5; // deg
const RING_PROPAGATION_SPEED = 5; // deg/sec

// Sample coordinates for major hubs
const CITIES = {
  Beijing: { lat: 39.9042, lng: 116.4074 },
  Shanghai: { lat: 31.2304, lng: 121.4737 },
  Singapore: { lat: 1.3521, lng: 103.8198 },
  Tokyo: { lat: 35.6762, lng: 139.6503 },
  London: { lat: 51.5074, lng: -0.1278 },
  NewYork: { lat: 40.7128, lng: -74.0060 },
  SanFrancisco: { lat: 37.7749, lng: -122.4194 },
  Sydney: { lat: -33.8688, lng: 151.2093 },
  Dubai: { lat: 25.2048, lng: 55.2708 },
  Paris: { lat: 48.8566, lng: 2.3522 },
  Berlin: { lat: 52.5200, lng: 13.4050 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
};

// Real data mapping (approximate centers)
const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  CN: { lat: 35.8617, lng: 104.1954 },
  SG: { lat: 1.3521, lng: 103.8198 },
  CA: { lat: 56.1304, lng: -106.3468 },
  US: { lat: 37.0902, lng: -95.7129 },
  AU: { lat: -25.2744, lng: 133.7751 },
  MY: { lat: 4.2105, lng: 101.9758 },
  GB: { lat: 55.3781, lng: -3.4360 },
};

const INITIAL_LEADERBOARD = [
  { rank: 1, country_code: 'CN', country_name: '中国', participant_count: 128, total_fuqi: 25600 },
  { rank: 2, country_code: 'SG', country_name: '新加坡', participant_count: 42, total_fuqi: 8400 },
  { rank: 3, country_code: 'CA', country_name: '加拿大', participant_count: 38, total_fuqi: 7600 },
  { rank: 4, country_code: 'US', country_name: '美国', participant_count: 35, total_fuqi: 7000 },
  { rank: 5, country_code: 'AU', country_name: '澳大利亚', participant_count: 28, total_fuqi: 5600 },
  { rank: 6, country_code: 'MY', country_name: '马来西亚', participant_count: 22, total_fuqi: 4400 },
  { rank: 7, country_code: 'GB', country_name: '英国', participant_count: 18, total_fuqi: 3600 },
];

export function FortuneGlobe({ onClose }: { onClose: () => void }) {
  const globeEl = useRef<any>();
  const [links, setLinks] = useState<FortuneLink[]>([]);
  const [leaderboard, setLeaderboard] = useState(INITIAL_LEADERBOARD);
  const [labels, setLabels] = useState<any[]>([]);
  const [showTable, setShowTable] = useState(true);
  const [copied, setCopied] = useState(false);
  const inviteLink = "https://agentverse.live/invite?code=SPRING2026";

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLeaderboard(prev => {
        const newData = prev.map(item => {
          // Randomly increase participant count
          if (Math.random() > 0.6) {
            const increase = Math.floor(Math.random() * 3) + 1;
            return {
              ...item,
              participant_count: item.participant_count + increase,
              total_fuqi: item.total_fuqi + (increase * 200)
            };
          }
          return item;
        });
        
        // Re-sort based on new counts
        return newData.sort((a, b) => b.participant_count - a.participant_count)
          .map((item, index) => ({ ...item, rank: index + 1 }));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Update globe labels/points when leaderboard changes
  useEffect(() => {
    const newLabels = leaderboard.map(item => {
      const coords = COUNTRY_COORDS[item.country_code];
      if (!coords) return null;
      return {
        lat: coords.lat,
        lng: coords.lng,
        text: `${item.country_name}: ${item.participant_count}人 (福气: ${item.total_fuqi})`,
        size: Math.max(0.5, item.participant_count / 50), // Scale size
        color: item.rank <= 3 ? '#fbbf24' : '#e5e7eb', // Gold for top 3
        ...item
      };
    }).filter(Boolean);
    setLabels(newLabels);
  }, [leaderboard]);

  // Generate random fortune links
  useEffect(() => {
    const newLinks: FortuneLink[] = [];
    const cityKeys = Object.keys(CITIES);
    
    // Create links from "Spring Gala" (Beijing) to everywhere
    const origin = CITIES.Beijing;
    
    for (let i = 0; i < 20; i++) {
      const targetKey = cityKeys[Math.floor(Math.random() * cityKeys.length)];
      const target = CITIES[targetKey as keyof typeof CITIES];
      
      if (targetKey === 'Beijing') continue; // Don't link to self

      newLinks.push({
        order: i,
        startLat: origin.lat,
        startLng: origin.lng,
        endLat: target.lat,
        endLng: target.lng,
        color: ['#ff0000', '#ffaa00', '#ffff00'][Math.floor(Math.random() * 3)],
        label: `Fortune sent to ${targetKey}`
      });
    }

    // Add some random inter-city links
    for (let i = 0; i < 10; i++) {
      const startKey = cityKeys[Math.floor(Math.random() * cityKeys.length)];
      const endKey = cityKeys[Math.floor(Math.random() * cityKeys.length)];
      
      if (startKey === endKey) continue;

      const start = CITIES[startKey as keyof typeof CITIES];
      const end = CITIES[endKey as keyof typeof CITIES];

      newLinks.push({
        order: i + 20,
        startLat: start.lat,
        startLng: start.lng,
        endLat: end.lat,
        endLng: end.lng,
        color: ['#00ffff', '#ff00ff'][Math.floor(Math.random() * 2)],
        label: `Interaction: ${startKey} - ${endKey}`
      });
    }

    setLinks(newLinks);
  }, []);

  useEffect(() => {
    // Auto-rotate
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      
      // Initial point of view
      globeEl.current.pointOfView({ lat: 20, lng: 100, altitude: 2.5 });
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col">
      <div className="absolute top-4 right-4 z-[70] flex gap-2">
        <button 
          onClick={() => setShowTable(!showTable)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          title="Toggle Leaderboard"
        >
          <TrendingUp size={24} />
        </button>
        <button 
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="absolute top-4 left-4 z-[70] p-4 pointer-events-none">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 flex items-center gap-2">
          <GlobeIcon className="text-red-500" />
          Global Fortune Map
        </h2>
        <p className="text-gray-400 text-sm mt-1">Real-time Fortune Flow Visualization</p>
      </div>

      {/* Leaderboard & Invite Panel */}
      {showTable && (
        <div className="absolute left-4 top-24 bottom-24 w-80 z-[70] bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden flex flex-col animate-in slide-in-from-left-4 fade-in duration-300">
          <div className="p-4 border-b border-white/10 bg-black/40">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-yellow-400" size={18} />
              Real-time Ranking
            </h3>
            <p className="text-xs text-gray-400 mt-1">Updates every 2 seconds</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase border-b border-white/10">
                <tr>
                  <th className="px-2 py-2">#</th>
                  <th className="px-2 py-2">Region</th>
                  <th className="px-2 py-2 text-right">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboard.map((item) => (
                  <tr key={item.country_code} className="hover:bg-white/5 transition-colors">
                    <td className="px-2 py-3 font-medium">
                      {item.rank === 1 && <span className="text-yellow-400">🥇</span>}
                      {item.rank === 2 && <span className="text-gray-300">🥈</span>}
                      {item.rank === 3 && <span className="text-amber-600">🥉</span>}
                      {item.rank > 3 && <span className="text-gray-500">{item.rank}</span>}
                    </td>
                    <td className="px-2 py-3 text-white">
                      <div className="flex flex-col">
                        <span>{item.country_name}</span>
                        <span className="text-[10px] text-gray-500">Fuqi: {item.total_fuqi}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-right text-cyan-400 font-mono">
                      {item.participant_count.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-white/10 bg-gradient-to-b from-blue-900/20 to-purple-900/20">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Share2 size={14} className="text-green-400" />
              Invite & Boost Ranking!
            </h4>
            <p className="text-xs text-gray-300 mb-3">
              Share your link to help your region win the Fortune Grand Prize!
            </p>
            <div className="flex gap-2">
              <div className="flex-1 bg-black/50 border border-white/20 rounded px-2 py-1.5 text-xs text-gray-400 truncate font-mono select-all">
                {inviteLink}
              </div>
              <button 
                onClick={handleCopy}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 w-full h-full cursor-move">
        <Globe
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          
          labelsData={labels}
          labelLat="lat"
          labelLng="lng"
          labelText="text"
          labelSize="size"
          labelDotRadius={0.5}
          labelColor="color"
          labelResolution={2}

          pointsData={labels}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude={(d: any) => d.participant_count / 100} 
          pointRadius={0.2}
          pointResolution={12}

          arcsData={links}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor="color"
          arcDashLength={ARC_REL_LEN}
          arcDashGap={2}
          arcDashInitialGap={(d: any) => d.order * 1}
          arcDashAnimateTime={FLIGHT_TIME}
          arcStroke={1.5}
          // arcLabel={(d: any) => d.label}
          
          ringsData={links}
          ringLat="endLat"
          ringLng="endLng"
          ringColor="color"
          ringMaxRadius={RINGS_MAX_R}
          ringPropagationSpeed={RING_PROPAGATION_SPEED}
          ringRepeatPeriod={FLIGHT_TIME * ARC_REL_LEN / 2}

          // Interactivity
          onLabelClick={() => setShowTable(true)}
          onPointClick={() => setShowTable(true)}
          
          // Visuals
          atmosphereColor="#3b82f6"
          atmosphereAltitude={0.15}
        />
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
         <div className="inline-block bg-black/50 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full">
            <span className="text-yellow-500 font-bold mr-2">● Fortune Flow</span>
            <span className="text-cyan-400 font-bold">● Interaction</span>
         </div>
      </div>
    </div>
  );
}
