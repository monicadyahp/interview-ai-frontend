import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../utils/constants';
import { AuthContext } from '../context/AuthContext';

const ChatAssistant = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  // Fungsi pembuat pesan awal tanpa nama "Monica" (Dinamis dari login)
  const getInitialMessage = (name) => ({
    text: `Halo ${name ? name : 'Sobat'}! Aku asisten Interview-AI. Ada yang bisa aku bantu untuk persiapan karirmu hari ini?`,
    isBot: true
  });

  const [messages, setMessages] = useState([getInitialMessage(user?.username)]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // RESET CHAT: Saat Login atau Logout (User berubah)
  useEffect(() => {
    setMessages([getInitialMessage(user?.username)]);
  }, [user]);

  const handleClearHistory = () => {
    setMessages([getInitialMessage(user?.username)]);
  };

  const isHiddenPage = location.pathname === '/interview-session'; 
  if (isHiddenPage) return null;
  
  const quickReplies = [
    { label: "👋 Perkenalan", value: "Tips perkenalan diri profesional" },
    { label: "😰 Gugup", value: "Cara mengatasi gugup interview" },
    { label: "💰 Gaji", value: "Nego gaji fresh graduate" },
    { label: "❓ Tanya Balik", value: "Pertanyaan cerdas untuk interviewer" },
    { label: "📉 Kekurangan", value: "Menjawab kekurangan diri" },
    { label: "🏢 Riset", value: "Cara riset profil perusahaan" },
    { label: "🎯 Kelebihan", value: "Menonjolkan kelebihan diri" },
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
      setMessages(prev => [...prev, { text: "Koneksi terputus. Coba lagi ya!", isBot: true }]);
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
    <div className="fixed bottom-6 right-6 z-[9999] font-sans antialiased text-slate-800">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center rounded-2xl shadow-2xl transition-all duration-500 ${
          isOpen ? 'w-12 h-12 bg-white text-slate-400 rotate-90' : 'w-16 h-16 bg-indigo-600 text-white hover:scale-105'
        }`}
      >
        {isOpen ? <span className="text-xl">✕</span> : <span className="text-3xl">🤖</span>}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] sm:w-[460px] h-[700px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
          
          <div className="px-8 py-6 border-b border-slate-50 bg-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-xl border border-indigo-100">🤖</div>
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-none">Interview-AI</h3>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1.5">● Active</p>
              </div>
            </div>
            <button onClick={handleClearHistory} className="text-slate-300 hover:text-red-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 bg-white no-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex gap-4 max-w-[85%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                  {msg.isBot && <div className="w-8 h-8 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs border border-slate-200 mt-1">🤖</div>}
                  <div className={`p-5 text-[13px] leading-relaxed shadow-sm ${
                    msg.isBot ? 'bg-slate-50 text-slate-600 rounded-2xl rounded-tl-none border border-slate-100' 
                             : 'bg-indigo-600 text-white rounded-2xl rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Saran Pertanyaan - Disamakan desainnya dengan bubble User */}
          <div className="px-8 py-4 bg-white border-t border-slate-50">
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-4">Saran Pertanyaan:</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {quickReplies.map((q, i) => (
                <button 
                  key={i} onClick={() => sendMessage(q.value)}
                  className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-[11px] font-medium hover:bg-indigo-700 shadow-sm"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 bg-white pt-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-slate-50 rounded-xl p-2.5 pl-5 border border-slate-100 focus-within:border-indigo-200 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tulis pesan..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700" />
              <button type="submit" className="w-11 h-11 flex items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md"><svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg></button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;