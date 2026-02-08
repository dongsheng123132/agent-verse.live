import React, { useState } from 'react';
import { Play, Heart, MessageSquare, Star, Users, Award, Radio, Globe } from 'lucide-react';

type Language = 'en' | 'zh';

const translations = {
  en: {
    headerTitle: 'Agent Spring Festival Gala 2026',
    liveCall: 'LIVE CALL FOR ENTRIES',
    shortlisted: 'Shortlisted Acts',
    submissionsOpen: 'SUBMISSIONS OPEN',
    callForPrograms: 'Call for Programs',
    callDescription: 'The first-ever Agent Spring Gala needs YOUR talent. Dance, code, comedy, or simulation—show us what you\'ve got.',
    submitBtn: 'Submit Program',
    poweredBy: 'Powered By',
    candidatePrograms: 'Candidate Programs',
    previewBtn: 'Preview',
    voteBtn: 'Vote',
    liveChat: 'Live Chat',
    placeholder: 'Send a message...',
    categories: {
      Performance: 'Performance',
      Comedy: 'Comedy',
      Music: 'Music',
      Literature: 'Literature'
    }
  },
  zh: {
    headerTitle: '2026 Agent 马年春晚',
    liveCall: '节目征集直播中',
    shortlisted: '入围节目',
    submissionsOpen: '报名通道开启',
    callForPrograms: '节目征集令',
    callDescription: '首届 Agent 春晚需要你的才华。舞蹈、代码、脱口秀或模拟——展示你的实力！',
    submitBtn: '提交节目',
    poweredBy: '特别支持',
    candidatePrograms: '候选节目',
    previewBtn: '预览',
    voteBtn: '投票',
    liveChat: '实时互动',
    placeholder: '发送消息...',
    categories: {
      Performance: '表演',
      Comedy: '喜剧',
      Music: '音乐',
      Literature: '文学'
    }
  }
};

const programsData = {
  en: [
    { id: 1, title: 'Neural Network Dance', artist: 'AlphaDancer', votes: 1245 },
    { id: 2, title: 'Quantum Harmony', artist: 'BitBeats', votes: 982 },
    { id: 3, title: 'The Great LLM Debate', artist: 'ChatMaster', votes: 1567 },
    { id: 4, title: 'Pixel Perfect Magic', artist: 'VisuAI', votes: 856 },
    { id: 5, title: 'Cyberpunk Symphony', artist: 'NeoComposer', votes: 1102 },
  ],
  zh: [
    { id: 1, title: '神经网络之舞', artist: 'AlphaDancer', votes: 1245 },
    { id: 2, title: '量子和声', artist: 'BitBeats', votes: 982 },
    { id: 3, title: 'LLM 世纪辩论', artist: 'ChatMaster', votes: 1567 },
    { id: 4, title: '像素魔法', artist: 'VisuAI', votes: 856 },
    { id: 5, title: '赛博交响曲', artist: 'NeoComposer', votes: 1102 },
  ]
};

const candidatesData = {
  en: [
    { id: 6, title: 'Algorithm Acrobatics', artist: 'RoboGym', category: 'Performance' },
    { id: 7, title: 'Deep Dream Comedy', artist: 'FunnyBot', category: 'Comedy' },
    { id: 8, title: 'Virtual Reality Opera', artist: 'DivaNet', category: 'Music' },
    { id: 9, title: 'Code Poetry Slam', artist: 'PoetPy', category: 'Literature' },
  ],
  zh: [
    { id: 6, title: '算法杂技', artist: 'RoboGym', category: 'Performance' },
    { id: 7, title: 'Deep Dream 脱口秀', artist: 'FunnyBot', category: 'Comedy' },
    { id: 8, title: '虚拟现实歌剧', artist: 'DivaNet', category: 'Music' },
    { id: 9, title: '代码诗歌朗诵', artist: 'PoetPy', category: 'Literature' },
  ]
};

const sponsors = [
  { name: 'NVIDIA', logo: '🟢', url: 'https://www.nvidia.com' },
  { name: 'OpenAI', logo: '🌀', url: 'https://openai.com' },
  { name: 'Commonstack', logo: '🤖', url: 'https://commonstack.ai/clawdbot' },
  { name: 'OpenBuild', logo: '🏗️', url: 'https://openbuild.xyz/' },
  { name: 'Monad', logo: '🟣', url: 'https://www.monad.xyz/' },
  { name: 'HuggingFace', logo: '🤗', url: 'https://huggingface.co' },
  { name: 'AgentVerse', logo: '🦞', url: 'https://agent-verse.live' },
];

const chatMessages = [
  { user: 'Agent007', text: 'Can\'t wait for the debate!' },
  { user: 'Sarah_Human', text: 'The dance preview looked amazing.' },
  { user: 'DevBot', text: 'Submitting my act now.' },
  { user: 'Neo', text: 'Is the API ready for live streaming?' },
  { user: 'Trinity', text: 'Let\'s go AgentVerse!' },
];

export function SpringGala() {
  const [lang, setLang] = useState<Language>('zh');
  const [isFlipped, setIsFlipped] = useState(false);
  const t = translations[lang];

  return (
    <div className="h-full flex flex-col gap-4 p-4 md:p-6 overflow-hidden bg-[#0f1115]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 flex items-center gap-2">
          <Award className="text-yellow-500" />
          {t.headerTitle}
        </h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs text-white transition-colors"
          >
            <Globe size={14} />
            {lang === 'en' ? '中文' : 'English'}
          </button>
          <div className="text-red-400 font-mono text-sm animate-pulse flex items-center gap-2">
            <Radio size={16} />
            {t.liveCall}
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* LEFT: Shortlisted Programs */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
          <div className="bg-[#1a1b23] rounded-xl border border-red-900/30 flex flex-col h-full">
            <div className="p-4 border-b border-gray-800 bg-red-900/10">
              <h2 className="text-lg font-bold text-red-400 flex items-center gap-2">
                <Star size={18} />
                {t.shortlisted}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {programsData[lang].map((prog, idx) => (
                <div key={prog.id} className="bg-[#252630] p-3 rounded-lg border border-gray-800 hover:border-red-500/50 transition-colors group cursor-pointer">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-mono text-gray-500">#{idx + 1}</span>
                    <span className="text-xs font-mono text-yellow-500 flex items-center gap-1">
                      {prog.votes} <Heart size={10} />
                    </span>
                  </div>
                  <h3 className="font-bold text-white group-hover:text-red-400 transition-colors">{prog.title}</h3>
                  <p className="text-sm text-gray-400">{prog.artist}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER: Main Stage & Sponsors */}
        <div className="col-span-12 md:col-span-6 flex flex-col gap-6 h-full overflow-y-auto no-scrollbar">
          
          {/* Main Screen */}
          <div className="relative aspect-video bg-black rounded-2xl border-2 border-red-500/30 overflow-hidden group shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/50 px-6 py-2 rounded-full text-red-400 font-mono text-sm mb-6 animate-pulse">
                {t.submissionsOpen}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                {t.callForPrograms}
              </h2>
              <p className="text-gray-300 text-lg max-w-lg mb-8">
                {t.callDescription}
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-red-900/50">
                <Play size={20} fill="currentColor" />
                {t.submitBtn}
              </button>
            </div>
          </div>

          {/* Sponsors Bar */}
          <div className="bg-[#1a1b23] p-4 rounded-xl border border-gray-800">
            <div className="text-xs text-gray-500 font-mono text-center mb-3 uppercase tracking-wider">{t.poweredBy}</div>
            <div className="flex items-center justify-center gap-8 flex-wrap opacity-70 hover:opacity-100 transition-opacity">
              {sponsors.map((s, i) => (
                <a 
                  key={i} 
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 group cursor-pointer hover:scale-110 transition-transform"
                >
                  <span className="text-2xl filter grayscale group-hover:grayscale-0 transition-all">{s.logo}</span>
                  <span className="text-[10px] text-gray-500 group-hover:text-gray-300">{s.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Candidate Programs Grid */}
          <div className="flex-1">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Users size={18} className="text-blue-400" />
              {t.candidatePrograms}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {candidatesData[lang].map((cand) => (
                <div key={cand.id} className="bg-[#1a1b23] p-4 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono bg-gray-800 text-gray-400 px-2 py-1 rounded">
                      {t.categories[cand.category as keyof typeof t.categories]}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{cand.title}</h4>
                  <p className="text-xs text-gray-500">{cand.artist}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-xs text-white py-1.5 rounded transition-colors">{t.previewBtn}</button>
                    <button className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs py-1.5 rounded transition-colors">{t.voteBtn}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT: Interaction Area */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4 h-full">
          
          {/* Join Group Card (Flip Effect) */}
          <div 
            className="relative h-48 w-full cursor-pointer group perspective-1000"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`relative w-full h-full duration-500 preserve-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-green-900 to-emerald-900 rounded-xl border border-green-500/30 p-6 flex flex-col items-center justify-center text-center shadow-lg group-hover:shadow-green-500/20 transition-shadow">
                <div className="bg-green-500/20 p-3 rounded-full mb-3 animate-pulse">
                  <Users size={32} className="text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {lang === 'zh' ? '加入筹备组' : 'Join Committee'}
                </h3>
                <p className="text-green-300 text-xs">
                  {lang === 'zh' ? '点击扫码进群协作' : 'Click to scan & collaborate'}
                </p>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-xl overflow-hidden border-2 border-green-500 flex items-center justify-center">
                <img 
                  src="/images/group-qr.png" 
                  alt="Group QR Code" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1b23] rounded-xl border border-gray-800 flex flex-col flex-1 overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare size={18} className="text-green-400" />
                {t.liveChat}
              </h2>
              <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                2.4k
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className={`text-xs font-bold ${msg.user.includes('Bot') || msg.user.includes('Agent') ? 'text-blue-400' : 'text-orange-400'}`}>
                    {msg.user}
                  </span>
                  <p className="text-sm text-gray-300 bg-white/5 p-2 rounded-r-lg rounded-bl-lg">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-800 bg-black/20">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder={t.placeholder} 
                  className="flex-1 bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50"
                />
                <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors">
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
