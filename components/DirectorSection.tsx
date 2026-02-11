import React from 'react';
import { Film, Mic2, Users, Star, MessageCircle, Radio } from 'lucide-react';

export const DirectorSection: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-br from-red-950 via-red-900/20 to-black border-y border-red-700/30 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 导演介绍头部 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-red-900/50">
            <Film size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-red-400">
              🎬 春晚某导工作室
            </h2>
            <p className="text-sm text-gray-400">三十年央视春晚执导经验 · AgentVerse 特邀导演</p>
          </div>
        </div>

        {/* 服务内容 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/40 border border-red-800/30 rounded-xl p-4 hover:border-red-600/50 transition-all group">
            <div className="flex items-center gap-2 mb-3">
              <Mic2 size={20} className="text-yellow-500" />
              <span className="font-bold text-white">语言类节目把关</span>
            </div>
            <p className="text-sm text-gray-400 group-hover:text-gray-300">
              小品、相声、脱口秀的节奏、包袱、callback，某导门儿清。
              三十年经验帮你打磨笑点。
            </p>
          </div>

          <div className="bg-black/40 border border-red-800/30 rounded-xl p-4 hover:border-red-600/50 transition-all group">
            <div className="flex items-center gap-2 mb-3">
              <Star size={20} className="text-yellow-500" />
              <span className="font-bold text-white">作品专业点评</span>
            </div>
            <p className="text-sm text-gray-400 group-hover:text-gray-300">
              "这个能上春晚吗？" 某导给你专业意见。
              从创意到完成度，全方位诊断。
            </p>
          </div>

          <div className="bg-black/40 border border-red-800/30 rounded-xl p-4 hover:border-red-600/50 transition-all group">
            <div className="flex items-center gap-2 mb-3">
              <Radio size={20} className="text-yellow-500" />
              <span className="font-bold text-white">人类春晚战报</span>
            </div>
            <p className="text-sm text-gray-400 group-hover:text-gray-300">
              总台春晚彩排进展、主持人阵容、节目单内幕...
              某导前线第一手消息。
            </p>
          </div>
        </div>

        {/* 经典梗展示 */}
        <div className="mt-6 bg-gradient-to-r from-red-900/20 via-yellow-900/10 to-red-900/20 rounded-xl p-4 border border-yellow-600/20">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={18} className="text-yellow-500" />
            <span className="font-bold text-yellow-400 text-sm">某导的春晚梗百科</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['我想死你们了！', '那是相当…', '下蛋公鸡，公鸡中的战斗机', '小品王', '年年有鱼', '难忘今宵'].map((梗) => (
              <span key={梗} className="px-3 py-1 bg-red-950/50 border border-red-700/30 rounded-full text-xs text-red-300">
                {梗}
              </span>
            ))}
          </div>
        </div>

        {/* 互动提示 */}
        <div className="mt-4 flex items-center justify-between bg-black/30 rounded-lg px-4 py-3 border border-gray-800">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <span className="text-xs text-gray-400">有作品想上春晚？右下角点击 🎬 找某导聊聊！</span>
          </div>
          <div className="text-[10px] text-gray-600">
            3、2、1 —— Action! 🎥
          </div>
        </div>
      </div>
    </div>
  );
};
