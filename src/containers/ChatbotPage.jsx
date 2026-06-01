import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../utils/constants";
import { Send, Mic, Paperclip } from "lucide-react";
import DashboardFooter from "../layout/DashboardFooter";
import DashboardTopBar from "../components/DashboardTopBar";

const fontFamily = "'Plus Jakarta Sans', sans-serif";

const SidebarItem = ({ imgSrc, label, active, onClick }) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 h-[48px] rounded-[14px] text-[15px] font-semibold transition-all duration-200 ${active ? "bg-[#7B4DFF] text-white shadow-[0_4px_12px_rgba(123,77,255,0.3)]" : "text-[#666] hover:bg-[#F5F2FF] hover:text-[#7B4DFF]"}`}
    style={{ fontFamily }}>
    <img src={imgSrc} alt={label} className="w-[22px] h-[22px] object-contain"
      style={{ filter: active ? "brightness(0) invert(1)" : "none" }} />
    {label}
  </button>
);

const quickTopics = [
  { label: "Introduction", value: "Give me tips for a professional self-introduction in an interview." },
  { label: "Intro Practice", value: "Let's practice my introduction together." },
  { label: "Feeling Nervous", value: "I'm feeling nervous about my interview. How do I stay calm?" },
  { label: "Interview Tips", value: "What are the top interview tips I should know?" },
  { label: "Questions List", value: "Give me a list of common interview questions." },
  { label: "Salary Negotiation", value: "How should I negotiate my salary as a fresh graduate?" },
];

export default function ChatbotPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  const getInitialMessage = () => ({
    text: "I am your Intershight Assistant. Is there anything I can help for your career preparation today ?",
    isBot: true,
  });

  const [messages, setMessages] = useState([getInitialMessage()]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setChatStarted(true);
    setMessages((prev) => [...prev, { text, isBot: false }]);
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/chatbot`, { message: text });
      setMessages((prev) => [...prev, { text: res.data.reply, isBot: true }]);
    } catch {
      setMessages((prev) => [...prev, { text: "Connection lost. Please try again!", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  if (!user) { navigate("/login"); return null; }

  return (
    <div className="min-h-screen flex bg-[#F7F7FB]" style={{ fontFamily }}>

      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-[240px] bg-white border-r border-[#ECECEC] px-5 py-7 flex-col justify-between shrink-0 fixed top-0 left-0 h-full z-10">
        <div>
          <div onClick={() => navigate("/")} className="flex items-center gap-2.5 cursor-pointer mb-8">
            <img src="/logo/Icon_Insight.png" alt="logo" className="w-10 h-10" />
            <h1 className="text-[24px] font-bold fontIntersight">Intersight</h1>
          </div>
          <p className="text-[11px] font-bold text-[#BBBBBB] tracking-widest mb-3 px-1">OVERVIEW</p>
          <div className="flex flex-col gap-1.5">
            <SidebarItem imgSrc="/icons/overviewdashboard.png" label="Dashboard" onClick={() => navigate("/dashboard")} />
            <SidebarItem imgSrc="/icons/overviewinterview.png" label="Interview" onClick={() => navigate("/interview")} />
            <SidebarItem imgSrc="/icons/overviewai.png" label="AI Assistant" active onClick={() => navigate("/chatbot")} />
            <SidebarItem imgSrc="/icons/overviewhistory.png" label="History" onClick={() => navigate("/history")} />
            <SidebarItem imgSrc="/icons/overviewlearning.png" label="Learning" onClick={() => navigate("/learning")} />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#BBBBBB] tracking-widest mb-3 px-1">SETTINGS</p>
          <div className="flex flex-col gap-1.5">
            <SidebarItem imgSrc="/icons/setting.png" label="Setting" onClick={() => navigate("/profile")} />
            <SidebarItem imgSrc="/icons/logout.png" label="Log Out" onClick={logout} />
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-[240px]">
        <DashboardTopBar />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col px-6 py-6 overflow-hidden">

          {/* Chat Card */}
          <div className="flex-1 flex flex-col bg-white rounded-[20px] border border-[#ECECEC] overflow-hidden">

            {/* Chat Header */}
            <div className="flex items-center justify-between px-5 py-4 rounded-t-[20px]"
              style={{ background: "linear-gradient(90deg, #1E1060, #3B2299)" }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 bg-white/10 flex items-center justify-center">
                  <img src="/logo/Icon_Insight.png" alt="AI" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <p className="text-white font-bold text-[15px]" style={{ fontFamily }}>Intersight AI Copilot</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white/70 text-[12px]" style={{ fontFamily }}>Active to Replies Instantly</span>
                  </div>
                </div>
              </div>
              <button onClick={() => { setMessages([getInitialMessage()]); setChatStarted(false); }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg font-bold transition">
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {!chatStarted ? (
                /* Welcome state */
                <div className="flex flex-col items-center justify-center h-full gap-5 py-8">
                  <div>
                    <p className="text-[26px] font-bold text-[#1E1E1E] text-center mb-1" style={{ fontFamily }}>
                      Hi {user?.username?.split(" ")[0] || "Angel"} !
                    </p>
                    <p className="text-[22px] font-bold text-[#1E1E1E] text-center" style={{ fontFamily }}>
                      Where should we start ?
                    </p>
                  </div>

                  {/* Initial bot message */}
                  <div className="bg-[#F3ECFF] rounded-[16px] rounded-tl-none px-5 py-3.5 max-w-[360px]">
                    <p className="text-[14px] text-[#444]" style={{ fontFamily }}>{messages[0].text}</p>
                  </div>

                  {/* Quick topic chips */}
                  <div className="flex flex-wrap gap-2 justify-center max-w-[500px]">
                    {quickTopics.map((q) => (
                      <button key={q.label} onClick={() => sendMessage(q.value)}
                        className="px-4 py-2 rounded-full text-[13px] font-medium border border-[#7B4DFF] text-[#7B4DFF] hover:bg-[#7B4DFF] hover:text-white transition"
                        style={{ fontFamily }}>
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Active chat */
                <>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[70%] ${msg.isBot ? "" : ""}`}>
                        <p className="text-[11px] font-bold text-[#999] mb-1.5" style={{ fontFamily }}>
                          {msg.isBot ? "Chatbot" : "You"}
                        </p>
                        <div className={`px-4 py-3 rounded-[16px] text-[13px] leading-relaxed ${
                          msg.isBot
                            ? "bg-[#F3ECFF] text-[#333] rounded-tl-none"
                            : "bg-[#F0F0F5] text-[#333] rounded-tr-none"
                        }`} style={{ fontFamily }}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[70%]">
                        <p className="text-[11px] font-bold text-[#999] mb-1.5" style={{ fontFamily }}>Chatbot</p>
                        <div className="bg-[#F3ECFF] px-4 py-3 rounded-[16px] rounded-tl-none flex items-center gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <span key={i} className="w-2 h-2 bg-[#7B4DFF] rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.2}s` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-[#F0F0F0] mx-6" />

            {/* Input area */}
            <div className="px-5 py-4">
              <form onSubmit={handleSubmit}
                className="flex items-center gap-3 border border-[#E5E5E5] rounded-full px-5 py-3 focus-within:border-[#7B4DFF] transition">
                <button type="button" className="text-[#999] hover:text-[#7B4DFF] transition">
                  <Paperclip size={18} />
                </button>
                <button type="button" className="text-[#999] hover:text-[#7B4DFF] transition">
                  <Mic size={18} />
                </button>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your questions here..."
                  className="flex-1 outline-none text-[14px] text-[#444] placeholder:text-[#BBB]"
                  style={{ fontFamily }} />
                <button type="submit"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-90 transition"
                  style={{ background: "linear-gradient(135deg, #7B4DFF, #C026D3)" }}>
                  <Send size={15} />
                </button>
              </form>
              <p className="text-center text-[11px] text-[#BBB] mt-2" style={{ fontFamily }}>
                Press Enter to Send. Powered by Intersight AI.
              </p>
            </div>
          </div>
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}
