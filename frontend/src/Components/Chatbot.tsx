import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChatBubbleLeftRight, HiXMark, HiPaperAirplane, HiCpuChip } from 'react-icons/hi2';
import axios from 'axios';
import { API_ENDPOINTS } from '../api/config';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: 'bot' | 'user', text: string}[]>([
    { sender: 'bot', text: 'Hello! I am your AI Career Assistant. How can I help you prepare today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const historyToPass = messages
      .map(m => `${m.sender === 'bot' ? 'Bot' : 'User'}: ${m.text}`)
      .join('\n');

    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_ENDPOINTS.bot}/chat`, { prompt: userMessage, history: historyToPass });
      setMessages(prev => [...prev, { sender: 'bot', text: res.data }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Unable to reach the AI core. Please check your connection.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="mb-6 w-[380px] h-[550px] max-h-[80vh] bg-[#161616] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* HEADER */}
            <div className="p-6 bg-[#1f1f1f] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg shadow-[#7C3AED]/20">
                  <HiCpuChip className="text-xl text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Interview Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-[10px] font-medium text-gray-400">Online & Ready</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
              >
                <HiXMark className="text-gray-400" />
              </button>
            </div>

            {/* CHAT BODY */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-[#111]">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 text-sm font-medium leading-relaxed shadow-lg ${
                    msg.sender === 'user' 
                      ? 'bg-[#7C3AED] text-white rounded-2xl rounded-tr-none' 
                      : 'bg-[#1f1f1f] border border-white/5 text-gray-200 rounded-2xl rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#1f1f1f] border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* FOOTER */}
            <form onSubmit={sendMessage} className="p-6 bg-[#161616] border-t border-white/5 flex gap-3">
              <input 
                type="text" 
                placeholder="Ask anything..." 
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-gray-600 focus:border-[#A855F7]/50 outline-none transition-all"
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="w-12 h-12 bg-[#7C3AED] text-white rounded-xl flex items-center justify-center hover:bg-[#A855F7] disabled:opacity-30 transition-all font-bold group"
              >
                <HiPaperAirplane className="text-lg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-3xl shadow-2xl flex items-center justify-center text-2xl transition-all duration-500 ${
            isOpen ? 'bg-red-600 rotate-90 text-white shadow-red-500/20' : 'bg-[#7C3AED] text-white shadow-[#7C3AED]/40'
        }`}
      >
        {isOpen ? (
          <HiXMark className="text-3xl" />
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
            <path d="M18 7h-2c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h4l2 2V9c0-1.1-.9-2-2-2zM8 4c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H8zm-3 14l-2 2V6c0-1.1.9-2 2-2h1c0 1.1.9 2 2 2v7c0 2.2 1.8 4 4 4h4c0 1.1-.9 2-2 2H7l-2 2v-4z" opacity="0.3" />
            <path d="M17 9h-7c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h7l3 3V11c0-1.1-.9-2-2-2z" />
            <path d="M7 5H4c-1.1 0-2 .9-2 2v9l3-3h2c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z" />
          </svg>
        )}
      </motion.button>
    </div>
  );
};

export default Chatbot;
