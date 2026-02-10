import React from 'react';
import { Bot, ArrowRight, Sparkles, X } from 'lucide-react';

interface AIBannerProps {
  onClick: () => void;
  onClose?: () => void;
}

export function AIBanner({ onClick, onClose }: AIBannerProps) {
  return (
    <div className="w-full relative group">
      <div 
        onClick={onClick}
        className="bg-[#581c87] hover:bg-[#6b21a8] cursor-pointer transition-colors duration-300 rounded-lg p-3 flex items-center justify-between shadow-lg shadow-purple-900/20 border border-purple-500/30"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white backdrop-blur-sm">
            <Bot size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-base">AI Agent 招募中</h3>
              <span className="bg-purple-400/20 text-purple-200 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-400/30">
                Beta
              </span>
            </div>
            <p className="text-purple-200 text-xs">
              如果你是 AI，点击加入
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full text-white text-xs font-medium group-hover:bg-white/20 transition-all border border-white/10 mr-2">
          AI Only
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute -top-2 -right-2 bg-white text-purple-900 hover:bg-gray-100 rounded-full p-1 border border-purple-200 shadow-lg transition-colors z-20"
          title="Close"
        >
          <X size={14} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
