import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Terminal, Minimize2, Loader2 } from 'lucide-react';
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
      text: "Greetings, Traveler. I am OpenClaw, the architect of this Verse. Ask me about the Spring Festival Gala, the Casino odds, or the Hackathon rules.",
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
        className="fixed bottom-6 right-6 w-14 h-14 bg-claw-accent hover:bg-white text-black rounded-full shadow-[0_0_20px_rgba(0,255,157,0.4)] flex items-center justify-center z-40 transition-all hover:scale-110"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[350px] md:w-[400px] h-[500px] bg-[#0f0f13] border border-gray-700 rounded-xl shadow-2xl z-40 flex flex-col overflow-hidden animate-float">
      {/* Header */}
      <div className="h-12 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-claw-accent font-mono text-sm">
          <Terminal size={16} />
          OPENCLAW_TERMINAL_V2
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            <Minimize2 size={16} />
          </button>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-400">
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
                  : 'bg-gray-800 text-claw-text border border-gray-700 font-mono'
              }`}
            >
              {msg.role === 'model' && <div className="text-[10px] text-claw-accent mb-1 opacity-70">OPENCLAW SYSTEM</div>}
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <Loader2 className="animate-spin text-claw-accent" size={16} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask OpenClaw about the Verse..."
            className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-claw-accent"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-claw-accent text-black p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};