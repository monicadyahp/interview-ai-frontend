import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Halo Monica! Aku asisten Interview-AI. Kamu bisa tanya apa saja soal persiapan kerja atau klik menu di bawah ini.", isBot: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // List Pertanyaan Template (Quick Replies)
  const quickReplies = [
    "Tips perkenalan diri",
    "Cara mengatasi gugup",
    "Nego gaji untuk fresh grad",
    "Pertanyaan buat interviewer",
    "Bahasa tubuh yang baik"
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
      setMessages(prev => [...prev, { text: "Koneksi terputus. Pastikan Backend Express kamu sudah aktif ya!", isBot: true }]);
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
    <div className="fixed bottom-8 right-8 z-50 font-sans">
      {/* Button Floating - Dibuat lebih tegas & modern */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 hover:bg-indigo-700 text-white w-16 h-16 rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center group"
      >
        {isOpen ? <span className="text-xl">✕</span> : <span className="text-3xl group-hover:scale-110 transition-transform">🤖</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[22rem] sm:w-[26rem] h-[36rem] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header - Lebih Elegan */}
          <div className="bg-slate-900 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-xl shadow-inner">🤖</div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">Interview-AI Assistant</h3>
                <div className="flex items-center gap-2 text-[10px] text-indigo-300 uppercase tracking-widest font-bold">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online Now
                </div>
              </div>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] px-5 py-4 text-sm leading-relaxed shadow-sm transition-all ${
                  msg.isBot 
                    ? 'bg-white text-slate-700 rounded-2xl rounded-tl-none border border-slate-100' 
                    : 'bg-indigo-600 text-white rounded-2xl rounded-tr-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Quick Replies - Template Pertanyaan */}
            {messages.length < 3 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {quickReplies.map((q, i) => (
                  <button 
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex gap-1.5 items-center pl-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-5 bg-white border-t border-slate-100 flex gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan kamu..."
              className="flex-1 px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
            />
            <button type="submit" className="bg-slate-900 text-white p-3 rounded-xl hover:bg-indigo-600 transition-all active:scale-95 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;