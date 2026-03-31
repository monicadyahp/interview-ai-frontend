import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Halo Monica! Ada yang bisa aku bantu seputar persiapan interview hari ini?", isBot: true }
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
      const res = await axios.post(`${API_BASE_URL}/chatbot`, { message: input });
      setMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Maaf, koneksi ke server AI terputus. Silakan coba lagi.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans antialiased">
      {/* Tombol Floating - Indigo yang lebih kalem */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 rounded-xl shadow-lg transition-all duration-300 transform hover:rotate-12 flex items-center justify-center border-b-4 border-indigo-800"
      >
        {isOpen ? <span className="text-xl">✕</span> : <span className="text-2xl">💬</span>}
      </button>

      {/* Jendela Chat */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 h-[32rem] bg-white border border-slate-200 rounded-xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-black ring-opacity-5 animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header - Lebih flat dan bersih */}
          <div className="bg-slate-900 p-4 text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-lg">🤖</div>
            <div>
              <h3 className="font-bold text-sm leading-none">Interview-AI Assistant</h3>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Ready to Help</span>
            </div>
          </div>

          {/* Area Pesan */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-3 text-sm shadow-sm ${
                  msg.isBot 
                    ? 'bg-white text-slate-700 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-slate-100' 
                    : 'bg-indigo-600 text-white rounded-tl-xl rounded-bl-xl rounded-br-xl'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-1 pl-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Area Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaan..."
              className="flex-1 px-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;