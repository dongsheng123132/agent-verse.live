import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Terminal, Minimize2, Loader2, Film } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToOpenClaw } from '../services/geminiService';

export const AgentChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: "🎬 各部门注意——3、2、1！\n\n我是春晚某导，三十年央视春晚执导经验。你可以问我：\n• 人类春晚最新消息\n• AI春晚节目编排\n• 你的作品能不能上春晚\n• 历年春晚经典梗\n\n来，话筒给你——",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await sendMessageToOpenClaw(userMsg.text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-white rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center z-40 transition-all hover:scale-110"
      >
        <Film size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[350px] md:w-[400px] h-[500px] bg-[#0f0f13] border border-red-700/50 rounded-xl shadow-2xl z-40 flex flex-col overflow-hidden animate-float">
      {/* Header */}
      <div className="h-14 bg-gradient-to-r from-red-900/80 to-yellow-900/80 border-b border-red-700/50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-yellow-400 font-mono text-sm">
          <Film size={18} />
          <span className="font-bold">🎬 春晚某导</span>
          <span className="text-xs text-red-300">/ DIRECTOR_TERMINAL</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
            <Minimize2 size={16} />
          </button>
          <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-red-400">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-purple-900/50 text-white border border-purple-500/30' 
                  : 'bg-gradient-to-br from-red-900/30 to-yellow-900/20 text-gray-200 border border-red-700/30 font-mono'
              }`}
            >
              {msg.text.split('\n').map((line, i) => (
                <div key={i} className={line.startsWith('•') ? 'ml-2' : ''}>{line || <br />}</div>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
              <Loader2 size={16} className="animate-spin text-yellow-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-gray-900/80 border-t border-red-700/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="问问某导：这个能上春晚吗？"
            className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-500 hover:to-yellow-400 disabled:opacity-50 text-white p-2 rounded-lg transition-all"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="text-[10px] text-gray-600 mt-1 text-center">
          三十年春晚执导经验 · 专业点评 · 3、2、1——Action！
        </div>
      </div>
    </div>
  );
};
