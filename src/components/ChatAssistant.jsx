import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Halo Monica! Ada yang bisa aku bantu soal persiapan interview hari ini?", isBot: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll ke bawah setiap ada pesan baru
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
      setMessages(prev => [...prev, { text: "Duh, koneksi AI-ku lagi terputus nih.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Button Floating */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          <div className="bg-indigo-600 p-4 text-white font-bold flex justify-between items-center">
            <span>Interview-AI Assistant 🤖</span>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.isBot ? 'bg-white text-gray-800 shadow-sm' : 'bg-indigo-600 text-white'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-xs text-gray-400 italic">AI sedang mengetik...</div>}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex gap-2 bg-white">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya tips interview..."
              className="flex-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700">
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;