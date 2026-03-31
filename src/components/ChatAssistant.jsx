import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Komponen Avatar Sederhana
const BotAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-inner">
    🤖
  </div>
);

const UserAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white font-bold shadow-md">
    Me
  </div>
);

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Halo Monica! Ada yang bisa aku bantu soal persiapan interview hari ini?", isBot: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Panggil backend express kamu
      const res = await axios.post(`${API_BASE_URL}/chatbot`, { message: input });
      setMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Duh, koneksi AI-ku lagi masuk angin nih.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans antialiased text-slate-800">
      {/* Button Floating (Tutup) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
      >
        {isOpen ? <span className="text-xl">✕</span> : <span className="text-2xl">💬</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-[26rem] h-[34rem] bg-white border border-slate-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header (Clean & Indigo) */}
          <div className="bg-indigo-600 p-5 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <BotAvatar />
              <div>
                <h3 className="font-extrabold text-lg">Interview-AI Asisten</h3>
                <p className="text-xs text-indigo-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
          </div>

          {/* Chat Body (Greyish, Rounded Bubbles) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-3 ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                {msg.isBot && <BotAvatar />}
                <div className={`max-w-[80%] p-4 rounded-3xl shadow-sm text-sm ${
                  msg.isBot 
                    ? 'bg-white text-slate-700 rounded-bl-lg' 
                    : 'bg-indigo-600 text-white rounded-br-lg'
                }`}>
                  {msg.text}
                </div>
                {!msg.isBot && <UserAvatar />}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 justify-start pl-11 text-xs text-slate-400 italic">
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-pulse delay-75"></span>
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-pulse delay-150"></span>
                AI sedang mengetik...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area (Clean & Bottom) */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-2 bg-white mt-auto">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya tips perkenalan diri..."
              className="flex-1 p-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm transition-all"
            />
            <button type="submit" className="bg-indigo-600 text-white px-5 py-3 rounded-2xl hover:bg-indigo-700 transition-colors active:scale-95 flex items-center justify-center">
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;