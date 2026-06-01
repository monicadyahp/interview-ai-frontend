import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getHistory } from "../services/api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import DashboardFooter from "../layout/DashboardFooter";
import DashboardTopBar from "../components/DashboardTopBar";

const fontFamily = "'Plus Jakarta Sans', sans-serif";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

const emotionColorMap = {
  Happy: "#E879F9", Sad: "#60A5FA", Normal: "#FBBF24",
  Fear: "#94A3B8", Angry: "#F87171", Disgust: "#4ADE80",
  Neutral: "#A78BFA", Confident: "#FBBF24",
};

const SidebarItem = ({ imgSrc, activeImgSrc, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 h-[48px] rounded-[14px] text-[15px] font-semibold transition-all duration-200 ${
      active
        ? "bg-[#7B4DFF] text-white shadow-[0_4px_12px_rgba(123,77,255,0.3)]"
        : "text-[#666] hover:bg-[#F5F2FF] hover:text-[#7B4DFF]"
    }`}
    style={{ fontFamily }}
  >
    <img src={active && activeImgSrc ? activeImgSrc : imgSrc} alt={label} className="w-[22px] h-[22px] object-contain" />
    {label}
  </button>
);

const StatCard = ({ label, value, sub, subColor, iconSrc }) => (
  <div className="bg-white rounded-[20px] border border-[#ECECEC] px-5 py-5 flex items-start justify-between" style={{ fontFamily }}>
    <div>
      <p className="text-[13px] text-[#999] mb-1">{label}</p>
      <p className="text-[26px] font-bold text-[#1E1E1E] leading-tight">{value}</p>
      {sub && <p className="text-[12px] mt-1" style={{ color: subColor || "#22C55E" }}>{sub}</p>}
    </div>
    <div className="w-12 h-12 rounded-full bg-[#F3ECFF] flex items-center justify-center">
      <img src={iconSrc} alt={label} className="w-7 h-7 object-contain" />
    </div>
  </div>
);

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const load = async () => {
      try {
        const data = await getHistory(user.id || user._id);
        setHistories(data || []);
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    load();
  }, [user]); // eslint-disable-line

  const totalSessions = histories.length;

  const avgConfidence = (() => {
    if (!histories.length) return 0;
    const scores = histories.map((h) => {
      const pos = h.allStats?.find((s) => ["Happy","Confident","Neutral"].includes(s.label));
      return pos?.value || 0;
    });
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  })();

  const dominantEmotion = (() => {
    if (!histories.length) return "—";
    const counts = {};
    histories.forEach((h) => { counts[h.emotion] = (counts[h.emotion] || 0) + 1; });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  })();

  const streak = (() => {
    if (!histories.length) return 0;
    const dates = [...new Set(histories.map((h) =>
      new Date(h.createdAt).toLocaleDateString("en-CA")
    ))].sort().reverse();
    let s = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const diff = (new Date(dates[i]) - new Date(dates[i + 1])) / 86400000;
      if (diff === 1) s++; else break;
    }
    return s;
  })();

  const chartData = (() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const ms = histories.filter((h) => {
        const hd = new Date(h.createdAt);
        return hd.getMonth() === d.getMonth() && hd.getFullYear() === d.getFullYear();
      });
      const score = ms.length
        ? Math.round(ms.reduce((acc, h) => {
            const pos = h.allStats?.find((s) => ["Happy","Confident","Neutral"].includes(s.label));
            return acc + (pos?.value || 0);
          }, 0) / ms.length)
        : 0;
      return { label: months[d.getMonth()], score };
    });
  })();

  const emotionsSummary = (() => {
    if (!histories.length) return [];
    const counts = {};
    histories.forEach((h) => { counts[h.emotion] = (counts[h.emotion] || 0) + 1; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts)
      .map(([label, count]) => ({ label, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.pct - a.pct).slice(0, 6);
  })();

  const overallScore = emotionsSummary[0]?.pct || 0;

  if (!user) return null;

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
            <SidebarItem imgSrc="/icons/overviewdashboard.png" activeImgSrc="/icons/overviewdashboardungu.png" label="Dashboard" active onClick={() => navigate("/dashboard")} />
            <SidebarItem imgSrc="/icons/overviewinterview.png" activeImgSrc="/icons/overviewinterviewungu.png" label="Interview" onClick={() => navigate("/interview")} />
            <SidebarItem imgSrc="/icons/overviewai.png" activeImgSrc="/icons/overviewaiungu.png" label="AI Assistant" onClick={() => navigate("/chatbot")} />
            <SidebarItem imgSrc="/icons/overviewhistory.png" activeImgSrc="/icons/overviewhistoryungu.png" label="History" onClick={() => navigate("/history")} />
            <SidebarItem imgSrc="/icons/overviewlearning.png" activeImgSrc="/icons/overviewlearningungu.png" label="Learning" onClick={() => navigate("/learning")} />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#BBBBBB] tracking-widest mb-3 px-1">SETTINGS</p>
          <div className="flex flex-col gap-1.5">
            <SidebarItem imgSrc="/icons/setting.png" activeImgSrc="/icons/overviewsettingungu.png" label="Setting" onClick={() => navigate("/profile")} />
            <SidebarItem imgSrc="/icons/logout.png" label="Log Out" onClick={logout} />
          </div>
        </div>
      </aside>

      {/* MAIN — offset sidebar */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-[240px]">
        <DashboardTopBar />

        {/* Content */}
        <div className="flex-1 px-6 py-6 overflow-auto">

          {/* Greeting Card */}
          <div className="relative w-full rounded-[24px] overflow-hidden mb-6">
            <img src="/hero/framedashboard.jpg" alt="dashboard hero"
              className="w-full h-auto block" style={{ maxHeight: "320px", objectFit: "cover", objectPosition: "center top" }} />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 py-10 max-w-[580px]">
              <h2 className="text-white font-bold leading-[1.2] mb-3" style={{ fontFamily, fontSize: "clamp(18px, 2.2vw, 26px)" }}>
                {getGreeting()} {user?.username?.split(" ")[0] || "Angel"}!<br />
                Ready to Shine in Your Next interview?
              </h2>
              <p className="text-white/80 text-[14px] leading-relaxed" style={{ fontFamily }}>
                {totalSessions > 0
                  ? `You've improved by ${Math.min(avgConfidence, 12)}% this week. Keep up the momentum with a quick technical session today.`
                  : "Start your first simulation and let AI analyze your confidence today."}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <StatCard label="Simulation Score" value={`${avgConfidence}/100`}
              sub={`+${Math.min(avgConfidence, 10)}% from last week`} subColor="#22C55E" iconSrc="/icons/simulationscore.png" />
            <StatCard label="Total Simulations" value={`${totalSessions} Sessions`}
              sub={`+${Math.min(totalSessions, 3)} from last week`} subColor="#22C55E" iconSrc="/icons/totalsimulations.png" />
            <StatCard label="AI Confidence Level" value={dominantEmotion}
              sub={`Top ${Math.min(avgConfidence, 15)}% of users`} subColor="#7B4DFF" iconSrc="/icons/aiconfidence.png" />
            <StatCard label="Practice Streak" value={`${streak} Days`}
              sub="Keep That Spirit !" subColor="#F97316" iconSrc="/icons/streak.png" />
          </div>

          {/* Chart + Emotions */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">

            {/* Performance Score Trend */}
            <div className="bg-white rounded-[20px] border border-[#ECECEC] p-6">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[17px] font-bold text-[#1E1E1E]" style={{ fontFamily }}>Performance Score Trend</p>
                <div className="flex gap-2">
                  {["6M","1Y"].map((t) => (
                    <button key={t} className="text-[13px] px-4 py-1.5 rounded-full font-semibold bg-[#7B4DFF] text-white" style={{ fontFamily }}>{t}</button>
                  ))}
                </div>
              </div>
              {isLoading ? (
                <div className="h-[240px] flex items-center justify-center text-[#999] text-[14px]">Loading chart...</div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="label" tick={{ fontSize: 13, fill: "#999", fontFamily }} axisLine={false} tickLine={false} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #ECECEC", borderRadius: "12px", fontSize: "13px", fontFamily }} />
                    <Line type="monotone" dataKey="score" stroke="#7B4DFF" strokeWidth={2.5}
                      dot={{ r: 5, fill: "#7B4DFF", strokeWidth: 0 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Emotions Summary */}
            <div className="bg-white rounded-[20px] border border-[#ECECEC] p-6">
              <p className="text-[17px] font-bold text-[#1E1E1E] mb-5" style={{ fontFamily }}>Emotions Summary</p>
              <div className="flex justify-center mb-5">
                <div className="relative w-[140px] h-[140px]">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#F3F3F3" strokeWidth="14" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#7B4DFF" strokeWidth="14"
                      strokeDasharray={`${(overallScore / 100) * 314} 314`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[24px] font-bold text-[#1E1E1E]" style={{ fontFamily }}>{overallScore}%</span>
                    <span className="text-[12px] text-[#999]" style={{ fontFamily }}>Overall</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {isLoading ? (
                  <p className="text-[14px] text-[#999] text-center">Loading...</p>
                ) : emotionsSummary.length > 0 ? (
                  emotionsSummary.map((e) => (
                    <div key={e.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: emotionColorMap[e.label] || "#A78BFA" }} />
                        <span className="text-[14px] text-[#444]" style={{ fontFamily }}>{e.label}</span>
                      </div>
                      <span className="text-[14px] font-semibold text-[#1E1E1E]" style={{ fontFamily }}>{e.pct}%</span>
                    </div>
                  ))
                ) : (
                  ["Happy","Sad","Normal","Fear","Angry","Disgust"].map((e) => (
                    <div key={e} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: emotionColorMap[e] }} />
                        <span className="text-[14px] text-[#444]" style={{ fontFamily }}>{e}</span>
                      </div>
                      <span className="text-[14px] font-semibold text-[#999]" style={{ fontFamily }}>—</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}
