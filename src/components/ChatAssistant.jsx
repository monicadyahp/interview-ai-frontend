import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Halo Monica! Aku asisten Interview-AI. Ada yang bisa aku bantu untuk persiapan karirmu hari ini?", isBot: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const quickReplies = [
    "Tips perkenalan diri",
    "Cara mengatasi gugup",
    "Nego gaji fresh grad",
    "Pertanyaan untuk interviewer"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = { text: text, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/chatbot`, { message: text });
      setMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Maaf, koneksi terputus. Pastikan server backend Anda berjalan.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans antialiased">
      {/* Launcher Button - Minimalist Style */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center rounded-2xl shadow-xl transition-all duration-500 ${
          isOpen ? 'w-12 h-12 bg-slate-100 text-slate-600 rotate-90' : 'w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-500 text-white hover:scale-105'
        }`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          </div>
        )}
      </button>

      {/* Chat Window - Gemini Style Interface */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[420px] max-h-[80vh] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-300">
          
          {/* Header - Clean & Modern */}
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base leading-none">Interview-AI</h3>
                <p className="text-[11px] text-emerald-500 font-medium mt-1 flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online & Ready
                </p>
              </div>
            </div>
          </div>

          {/* Chat Body - More Spacing */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-white custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                <div className={`relative group flex gap-3 max-w-[85%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Bot Icon for messages */}
                  {msg.isBot && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs border border-slate-200 mt-1">
                      🤖
                    </div>
                  )}
                  
                  <div className={`px-4 py-3 text-[14px] leading-relaxed tracking-tight ${
                    msg.isBot 
                      ? 'bg-slate-50 text-slate-700 rounded-2xl rounded-tl-none' 
                      : 'bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-indigo-100 shadow-lg'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-2 pl-11">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-widest">Processing</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Replies - Horizontal Scroll Pilling */}
          <div className="px-6 py-2 bg-white flex gap-2 overflow-x-auto no-scrollbar">
            {quickReplies.map((q, i) => (
              <button 
                key={i}
                onClick={() => sendMessage(q)}
                className="whitespace-nowrap px-4 py-1.5 rounded-full border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 hover:border-indigo-300 transition-all active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Area - Minimalist Input */}
          <div className="p-4 bg-white border-t border-slate-50">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1.5 pl-4 border border-slate-100 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya apapun..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700 placeholder:text-slate-400"
              />
              <button 
                type="submit" 
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Interview-AI dapat memberikan saran yang berbeda. Pastikan untuk riset kembali.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;