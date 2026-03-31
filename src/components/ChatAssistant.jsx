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

  // Daftar pertanyaan template yang lebih banyak
  const quickReplies = [
    { label: "👋 Perkenalan Diri", value: "Tips perkenalan diri" },
    { label: "😰 Atasi Gugup", value: "Cara mengatasi gugup" },
    { label: "💰 Nego Gaji", value: "Nego gaji fresh grad" },
    { label: "❓ Tanya Balik", value: "Pertanyaan untuk interviewer" },
    { label: "📉 Jawab Kekurangan", value: "Cara menjawab kekurangan diri" },
    { label: "👔 Tips Pakaian", value: "Pakaian interview yang baik" },
    { label: "🏢 Riset Perusahaan", value: "Cara riset perusahaan sebelum interview" },
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
      {/* Launcher Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center rounded-2xl shadow-xl transition-all duration-500 ${
          isOpen ? 'w-12 h-12 bg-white text-slate-500' : 'w-16 h-16 bg-indigo-600 text-white hover:shadow-indigo-200 hover:scale-105'
        }`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-3xl">🤖</span>
        )}
      </button>

      {/* Jendela Chat */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[450px] h-[650px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-50 bg-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl border border-indigo-100">
              🤖
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Interview-AI</h3>
              <p className="text-[11px] text-emerald-500 font-bold flex items-center gap-1 uppercase tracking-wider">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
              </p>
            </div>
          </div>

          {/* Body Pesan - Padding ditingkatkan agar tidak dempet */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 bg-white no-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                  {msg.isBot && (
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex-shrink-0 flex items-center justify-center text-xs border border-slate-100 mt-1">
                      🤖
                    </div>
                  )}
                  {/* Bubble Pesan - px-5 py-4 untuk ruang lega */}
                  <div className={`px-5 py-4 text-[14px] leading-relaxed shadow-sm transition-all ${
                    msg.isBot 
                      ? 'bg-slate-50 text-slate-700 rounded-xl rounded-tl-none border border-slate-100' 
                      : 'bg-indigo-600 text-white rounded-xl rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-2 pl-12">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Replies - Desain Card Minimalis */}
          <div className="px-6 py-4 bg-white border-t border-slate-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Saran Pertanyaan</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {quickReplies.map((q, i) => (
                <button 
                  key={i}
                  onClick={() => sendMessage(q.value)}
                  className="whitespace-nowrap px-4 py-2 rounded-xl border border-slate-100 bg-slate-50 text-xs text-slate-600 font-medium hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all active:scale-95 shadow-sm"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white pt-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-slate-50 rounded-xl p-2 pl-4 border border-slate-100 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan sesuatu..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700 placeholder:text-slate-400"
              />
              <button 
                type="submit" 
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;