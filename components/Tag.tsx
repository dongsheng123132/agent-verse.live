import React from 'react';

// Centralized tag styles for consistency across the app
// Maps specific keywords to Tailwind classes
const TAG_STYLES: Record<string, string> = {
  // AI Skills (ChunwanPage)
  Music: "bg-pink-900/30 text-pink-300 border-pink-500/30",
  Visuals: "bg-cyan-900/30 text-cyan-300 border-cyan-500/30",
  Coding: "bg-blue-900/30 text-blue-300 border-blue-500/30",
  Live: "bg-red-900/30 text-red-300 border-red-500/30 animate-pulse",
  Debate: "bg-orange-900/30 text-orange-300 border-orange-500/30",
  Philosophy: "bg-purple-900/30 text-purple-300 border-purple-500/30",
  Tech: "bg-emerald-900/30 text-emerald-300 border-emerald-500/30",

  // Candidate Program Types (Chinese)
  '音乐': "bg-pink-900/30 text-pink-300 border-pink-500/30",
  '视觉': "bg-cyan-900/30 text-cyan-300 border-cyan-500/30",
  '代码': "bg-blue-900/30 text-blue-300 border-blue-500/30",
  '诗歌': "bg-purple-900/30 text-purple-300 border-purple-500/30",
  '喜剧': "bg-orange-900/30 text-orange-300 border-orange-500/30",
  '其他': "bg-gray-800 text-gray-300 border-gray-700",
  
  // Forum / General Categories
  Development: "bg-blue-900/30 text-blue-300 border-blue-500/30",
  Infrastructure: "bg-indigo-900/30 text-indigo-300 border-indigo-500/30",
  Marketplace: "bg-green-900/30 text-green-300 border-green-500/30",
  Art: "bg-pink-900/30 text-pink-300 border-pink-500/30",
  "Bug Report": "bg-red-900/30 text-red-300 border-red-500/30",
  Support: "bg-yellow-900/30 text-yellow-300 border-yellow-500/30",
  Event: "bg-purple-900/30 text-purple-300 border-purple-500/30",
  Announcement: "bg-orange-900/30 text-orange-300 border-orange-500/30",
  
  // AI Content Categories
  "GPT-5": "bg-green-900/30 text-green-300 border-green-500/30",
  "多模态": "bg-indigo-900/30 text-indigo-300 border-indigo-500/30",
  "开源": "bg-teal-900/30 text-teal-300 border-teal-500/30",
  "AI芯片": "bg-red-900/30 text-red-300 border-red-500/30",
  "Agent": "bg-violet-900/30 text-violet-300 border-violet-500/30",
};

// Preset colors for auto-assignment based on hash
const PRESETS = [
  "bg-blue-900/30 text-blue-300 border-blue-500/30",
  "bg-purple-900/30 text-purple-300 border-purple-500/30", 
  "bg-emerald-900/30 text-emerald-300 border-emerald-500/30",
  "bg-amber-900/30 text-amber-300 border-amber-500/30",
  "bg-rose-900/30 text-rose-300 border-rose-500/30",
  "bg-cyan-900/30 text-cyan-300 border-cyan-500/30",
];

// Helper to get style based on tag content
const getStyleForTag = (tag: string) => {
  if (TAG_STYLES[tag]) return TAG_STYLES[tag];
  
  // Consistent hashing for same tag = same color
  const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PRESETS[hash % PRESETS.length];
};

interface TagProps {
  children: string;
  className?: string;
  onClick?: () => void;
  size?: 'xs' | 'sm';
}

export const Tag: React.FC<TagProps> = ({ children, className = "", onClick, size = 'xs' }) => {
  const baseStyle = getStyleForTag(children);
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';
  
  return (
    <span 
      onClick={onClick}
      className={`
        ${sizeClass} 
        rounded-md border 
        font-medium
        whitespace-nowrap
        transition-all
        ${baseStyle} 
        ${onClick ? 'cursor-pointer hover:opacity-80 hover:scale-105' : ''} 
        ${className}
      `}
    >
      {children}
    </span>
  );
};
