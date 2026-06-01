import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
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

const tagColors = {
  "INTERVIEW TECHNIQUE": { bg: "#EDE9FF", text: "#7B4DFF" },
  "PSYCHOLOGICAL TIPS": { bg: "#FFF0FB", text: "#C026D3" },
  "BODY LANGUAGE": { bg: "#FFF7E6", text: "#F97316" },
  "GROWTH MINDSET": { bg: "#E6FFF3", text: "#10B981" },
  "TECH & PREP": { bg: "#E6F4FF", text: "#3B82F6" },
};

const articles = [
  {
    id: 1,
    tag: "INTERVIEW TECHNIQUE",
    title: "Mastering the STAR Method",
    desc: "A guide on how to structure your answers using Situation, Task, Action, and Result to impress recruiters.",
    author: "John Doe",
    authorImg: "/icons/historyhappy.png",
    heroImg: "/hero/Lmastering.jpg",
    readTime: "4 min read",
    content: `The STAR method (Situation, Task, Action, Result) is the most effective way to provide structured, evidence-based answers in a professional interview.\n\nSituation: Provide a detailed context. Don't just say "I worked on a project." Say, "During my final semester project, we faced a sudden drop in user engagement due to a server migration issue."\n\nTask: Define your specific objective. "My task was to optimize the backend API to handle the traffic spike without downtime."\n\nAction: This is where you shine. Detail the specific steps you took. Use "I" to claim ownership. "I implemented a load balancer and refactored the database queries."\n\nResult: Quantify your success. "As a result, we reduced latency by 40% and maintained 99.9% uptime."\n\nReferences Source: JobStreet Indonesia – Career Advice`,
  },
  {
    id: 2,
    tag: "PSYCHOLOGICAL TIPS",
    title: "5 Ways to Calm Your Nerves",
    desc: "Proven breathing techniques and mental exercises to manage anxiety before and during an interview.",
    author: "Dr. Amelia",
    authorImg: "/icons/historyhappy.png",
    heroImg: "/hero/L5ways.jpg",
    readTime: "3 min read",
    content: `Feeling nervous before an interview is completely normal. Here are 5 science-backed techniques to calm your nerves and perform at your best.\n\n1. Box Breathing: Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 3-4 times before entering.\n\n2. Power Posing: Stand in a confident posture for 2 minutes before your interview. Research shows this can boost confidence hormones.\n\n3. Positive Visualization: Close your eyes and vividly imagine yourself succeeding in the interview — answering confidently and smiling.\n\n4. The 5-4-3-2-1 Grounding Technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. This brings you back to the present.\n\n5. Reframe Nervousness as Excitement: Your body's response to nervousness and excitement is nearly identical. Tell yourself "I'm excited" instead of "I'm nervous."`,
  },
  {
    id: 3,
    tag: "BODY LANGUAGE",
    title: "Decoding Non-Verbal Cues",
    desc: "Understand what your facial expressions and posture say about your confidence level to the interviewer.",
    author: "Sarah Lin",
    authorImg: "/icons/historyhappy.png",
    heroImg: "/hero/Ldecoding.jpg",
    readTime: "5 min read",
    content: `Up to 55% of communication is non-verbal. In interviews, your body language speaks before you even say a word.\n\nEye Contact: Maintain natural eye contact — not a stare. Aim for 60-70% eye contact to convey confidence and attentiveness.\n\nPosture: Sit up straight with your shoulders back. Avoid slouching or crossing your arms, which can signal defensiveness.\n\nHandshake: A firm (not crushing) handshake sets a confident first impression. Practice it beforehand.\n\nGestures: Use open hand gestures when speaking to emphasize points. Avoid fidgeting or touching your face excessively.\n\nSmile: A genuine smile creates rapport and makes you more likeable. Don't force it — think of something that genuinely makes you happy.`,
  },
  {
    id: 4,
    tag: "TECH & PREP",
    title: "Common Tech Interview Traps",
    desc: "Essential tips to avoid common pitfalls when answering technical questions in a fast-paced environment.",
    author: "Farhan",
    authorImg: "/icons/historyhappy.png",
    heroImg: "/hero/Lcommon.jpg",
    readTime: "6 min read",
    content: `Technical interviews can be intimidating, but knowing the common traps helps you navigate them with confidence.\n\nTrap 1 - Jumping to Code Too Fast: Always clarify requirements before writing a single line. Ask about edge cases, input format, and constraints.\n\nTrap 2 - Silent Thinking: Interviewers want to see your thought process. Narrate your thinking out loud even when stuck.\n\nTrap 3 - Ignoring Time & Space Complexity: Always analyze your solution's Big-O. Interviewers expect you to optimize.\n\nTrap 4 - Not Testing Your Code: Walk through your solution with sample inputs. Catch bugs before the interviewer does.\n\nTrap 5 - Giving Up: If you're stuck, break the problem into smaller pieces. Show resilience — it matters as much as the solution.`,
  },
  {
    id: 5,
    tag: "GROWTH MINDSET",
    title: "Post-Interview Reflection",
    desc: "Why reviewing your simulated sessions is the fastest way to bridge the gap between 'nervous' and 'hired'.",
    author: "Diana Putri",
    authorImg: "/icons/historyhappy.png",
    heroImg: "/hero/Lpost.jpg",
    readTime: "4 min read",
    content: `The interview doesn't end when you leave the room. The most effective candidates take time to reflect and improve.\n\nWhat to Reflect On:\n- Which questions caught you off guard?\n- Were there moments where you rambled or lost structure?\n- Did you research the company sufficiently?\n- How was your energy and enthusiasm level?\n\nHow to Use Intersight for Reflection: After each simulation, review your emotion analytics. If the AI detected nervousness or low confidence, revisit those specific questions.\n\nCreate an Improvement Log: Write down 1-2 specific things to improve after each session. Over time, this compounds into massive growth.\n\nRemember: Every interview, real or simulated, is data. Use it.`,
  },
  {
    id: 6,
    tag: "BODY LANGUAGE",
    title: "Body Language Hacks for Video Interviews",
    desc: "Learn how to use eye contact and posture effectively when interviewing through a webcam.",
    author: "Monica",
    authorImg: "/icons/historyhappy.png",
    heroImg: "/hero/Lbody.jpg",
    readTime: "4 min read",
    content: `Video interviews add a new layer of complexity. Here's how to master your on-screen presence.\n\nCamera Placement: Position your camera at eye level. Looking down at a laptop makes you seem smaller and less confident.\n\nLook at the Camera, Not the Screen: It feels unnatural, but looking at your camera lens (not the interviewer's face) creates the illusion of eye contact.\n\nLighting: Natural light from a window in front of you is ideal. Avoid backlighting which makes you appear as a silhouette.\n\nBackground: Use a clean, neutral background. If using a virtual background, make sure it doesn't distort your outline.\n\nInternet & Audio: Test your connection 15 minutes before. Use headphones to avoid echo. Mute yourself when not speaking in panel interviews.\n\nDress Professionally — From the Waist Up (At Least): Your energy and outfit still matter even on screen.`,
  },
];

const ITEMS_PER_PAGE = 6;

export default function LearningPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const paginated = articles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
            <SidebarItem imgSrc="/icons/overviewai.png" label="AI Assistant" onClick={() => navigate("/chatbot")} />
            <SidebarItem imgSrc="/icons/overviewhistory.png" label="History" onClick={() => navigate("/history")} />
            <SidebarItem imgSrc="/icons/overviewlearning.png" label="Learning" active onClick={() => navigate("/learning")} />
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

        <div className="flex-1 px-6 py-6 overflow-auto">

          {/* ── DETAIL ARTICLE ── */}
          {selectedArticle ? (
            <div className="max-w-[720px] mx-auto">
              <button onClick={() => setSelectedArticle(null)}
                className="flex items-center gap-2 text-[14px] font-semibold text-[#666] hover:text-[#7B4DFF] transition mb-5"
                style={{ fontFamily }}>
                ← Back
              </button>

              {/* Hero image */}
              <div className="w-full rounded-[20px] overflow-hidden mb-5" style={{ height: "240px" }}>
                <img src={selectedArticle.heroImg} alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.background = "linear-gradient(135deg,#7B4DFF,#C026D3)"; e.target.style.display = "none"; }} />
              </div>

              {/* Tag */}
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-3"
                style={{ background: tagColors[selectedArticle.tag]?.bg || "#EDE9FF", color: tagColors[selectedArticle.tag]?.text || "#7B4DFF" }}>
                {selectedArticle.tag}
              </span>

              <h1 className="text-[26px] font-bold text-[#1E1E1E] mb-2" style={{ fontFamily }}>{selectedArticle.title}</h1>
              <p className="text-[14px] text-[#777] mb-4" style={{ fontFamily }}>{selectedArticle.desc}</p>

              {/* Author */}
              <div className="flex items-center gap-2 mb-6">
                <img src={selectedArticle.authorImg} alt={selectedArticle.author} className="w-8 h-8 rounded-full object-cover" />
                <span className="text-[13px] font-semibold text-[#444]" style={{ fontFamily }}>{selectedArticle.author}</span>
                <span className="text-[12px] text-[#999]">· {selectedArticle.readTime}</span>
              </div>

              {/* Content */}
              <div className="bg-white rounded-[20px] border border-[#ECECEC] p-7 mb-8">
                {selectedArticle.content.split("\n\n").map((para, i) => (
                  <p key={i} className="text-[14px] text-[#444] leading-relaxed mb-4" style={{ fontFamily }}>{para}</p>
                ))}
              </div>

              {/* Other articles */}
              <h2 className="text-[18px] font-bold text-[#1E1E1E] mb-4" style={{ fontFamily }}>Another Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {articles.filter((a) => a.id !== selectedArticle.id).slice(0, 3).map((art) => (
                  <ArticleCard key={art.id} article={art} onClick={() => { setSelectedArticle(art); window.scrollTo(0, 0); }} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
            </div>
          ) : (
            /* ── LIST PAGE ── */
            <>
              {/* Hero Banner */}
              <div className="relative w-full rounded-[24px] overflow-hidden mb-6" style={{ minHeight: "160px" }}>
                <img src="/hero/Learning.jpg" alt="learning hero"
                  className="w-full h-full object-cover absolute inset-0" style={{ maxHeight: "200px", objectPosition: "center 30%" }} />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 px-8 py-10">
                  <h2 className="text-white text-[22px] font-bold mb-1" style={{ fontFamily }}>Learning More About Interview</h2>
                  <p className="text-white/70 text-[13px] mb-4" style={{ fontFamily }}>Boost your career readiness with expert tips, psychological insights,<br />and technical preparation guides.</p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-[12px] font-semibold px-4 py-2 rounded-full" style={{ fontFamily }}>
                      ▶ {articles.length} Articles
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-[12px] font-semibold px-4 py-2 rounded-full" style={{ fontFamily }}>
                      ↑ Updated Daily
                    </span>
                  </div>
                </div>
              </div>

              {/* Explore Topic */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[20px] font-bold text-[#1E1E1E]" style={{ fontFamily }}>Explore Topic</h2>
                  <p className="text-[13px] text-[#999]" style={{ fontFamily }}>Fund specifically what topic you need for your next session.</p>
                </div>
                <button className="px-5 py-2 rounded-full text-[13px] font-semibold text-white hover:opacity-90 transition"
                  style={{ background: "linear-gradient(90deg,#7B4DFF,#C026D3)", fontFamily }}>
                  More Article
                </button>
              </div>

              {/* Article Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                {paginated.map((art) => (
                  <ArticleCard key={art.id} article={art} onClick={() => { setSelectedArticle(art); window.scrollTo(0, 0); }} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
            </>
          )}
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}

function ArticleCard({ article, onClick }) {
  const tag = tagColors[article.tag] || { bg: "#EDE9FF", text: "#7B4DFF" };
  return (
    <div onClick={onClick}
      className="bg-white rounded-[20px] border border-[#ECECEC] overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Image */}
      <div className="w-full overflow-hidden" style={{ height: "140px", background: "linear-gradient(135deg,#7B4DFF22,#C026D322)" }}>
        <img src={article.heroImg} alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.parentElement.style.background = "linear-gradient(135deg,#EDE9FF,#F3ECFF)"; e.target.style.display = "none"; }} />
      </div>
      <div className="p-4">
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2"
          style={{ background: tag.bg, color: tag.text }}>
          {article.tag}
        </span>
        <h3 className="text-[14px] font-bold text-[#1E1E1E] mb-1 leading-snug" style={{ fontFamily }}>{article.title}</h3>
        <p className="text-[12px] text-[#999] leading-relaxed mb-3 line-clamp-2" style={{ fontFamily }}>{article.desc}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <img src={article.authorImg} alt={article.author} className="w-6 h-6 rounded-full object-cover" />
            <span className="text-[11px] text-[#666]" style={{ fontFamily }}>{article.author}</span>
          </div>
          <button className="w-7 h-7 rounded-full flex items-center justify-center text-white"
            style={{ background: "linear-gradient(135deg,#7B4DFF,#C026D3)" }}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pb-4">
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}
        className="w-8 h-8 rounded-full border border-[#ECECEC] flex items-center justify-center disabled:opacity-40 hover:border-[#7B4DFF] transition">
        ←
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-8 h-8 rounded-full text-[13px] font-semibold transition ${current === p ? "text-white" : "border border-[#ECECEC] text-[#555] hover:border-[#7B4DFF]"}`}
          style={current === p ? { background: "linear-gradient(135deg,#7B4DFF,#C026D3)" } : {}}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total}
        className="w-8 h-8 rounded-full border border-[#ECECEC] flex items-center justify-center disabled:opacity-40 hover:border-[#7B4DFF] transition">
        →
      </button>
    </div>
  );
}
