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

  // Daftar pertanyaan template yang lebih banyak & lengkap
  const quickReplies = [
    { label: "👋 Perkenalan", value: "Tips perkenalan diri" },
    { label: "😰 Gugup", value: "Cara mengatasi gugup" },
    { label: "💰 Gaji", value: "Nego gaji fresh grad" },
    { label: "❓ Tanya Balik", value: "Pertanyaan untuk interviewer" },
    { label: "📉 Kekurangan", value: "Cara menjawab kekurangan diri" },
    { label: "👔 Pakaian", value: "Pakaian interview yang baik" },
    { label: "🏢 Riset", value: "Cara riset perusahaan" },
    { label: "🎯 Kelebihan", value: "Cara menceritakan kelebihan" },
    { label: "🚀 Karir", value: "Tujuan karir 5 tahun ke depan" }
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
      setMessages(prev => [...prev, { text: "Maaf, koneksi terputus. Silakan coba lagi nanti.", isBot: true }]);
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
      {/* Tombol Launcher - Lebih Elegan */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center rounded-2xl shadow-2xl transition-all duration-500 ${
          isOpen ? 'w-12 h-12 bg-white text-slate-400 rotate-90' : 'w-16 h-16 bg-indigo-600 text-white hover:scale-105 active:scale-95'
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

      {/* Jendela Chat - Desain Lebih Lega */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[360px] sm:w-[460px] h-[680px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-50 bg-white flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-xl border border-indigo-100 shadow-sm">
              🤖
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base tracking-tight">Interview-AI Assistant</h3>
              <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1.5 uppercase tracking-widest mt-0.5">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active Now
              </p>
            </div>
          </div>

          {/* Area Pesan - Jarak space-y ditingkatkan */}
          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 bg-white no-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex gap-4 max-w-[80%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                  {msg.isBot && (
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs border border-slate-200 mt-1">
                      🤖
                    </div>
                  )}
                  {/* Bubble Chat - Padding p-5 agar teks punya ruang napas */}
                  <div className={`p-5 text-[13px] leading-relaxed tracking-tight shadow-sm transition-all ${
                    msg.isBot 
                      ? 'bg-slate-50 text-slate-600 rounded-2xl rounded-tl-none border border-slate-100' 
                      : 'bg-indigo-600 text-white rounded-2xl rounded-tr-none font-medium'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-2 pl-12">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Saran Pertanyaan - Disamakan dengan gaya bubble user */}
          <div className="px-8 py-4 bg-white border-t border-slate-50">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Mungkin kamu ingin tanya:</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {quickReplies.map((q, i) => (
                <button 
                  key={i}
                  onClick={() => sendMessage(q.value)}
                  className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-[11px] font-medium hover:bg-indigo-700 transition-all active:scale-95 shadow-sm shadow-indigo-100"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-8 bg-white pt-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-slate-50 rounded-xl p-2.5 pl-5 border border-slate-100 focus-within:border-indigo-200 focus-within:ring-4 focus-within:ring-indigo-50/50 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tulis pesan..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700 placeholder:text-slate-400"
              />
              <button 
                type="submit" 
                className="w-11 h-11 flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md active:scale-90"
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