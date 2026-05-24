import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getHistory } from "../services/api";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Bot,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  Zap,
  Flame,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fontFamily = "'Plus Jakarta Sans', sans-serif";

// ── helpers ──────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

const emotionColorMap = {
  Happy: "#E879F9",
  Sad: "#60A5FA",
  Normal: "#A78BFA",
  Fear: "#94A3B8",
  Angry: "#F87171",
  Disgust: "#4ADE80",
  Neutral: "#A78BFA",
  Confident: "#FBBF24",
};

// ── sub-components ────────────────────────────────────────
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 h-[44px] rounded-[14px] text-[14px] font-semibold transition-all duration-200 ${
      active
        ? "bg-[#7B4DFF] text-white shadow-[0_4px_12px_rgba(123,77,255,0.3)]"
        : "text-[#666] hover:bg-[#F5F2FF] hover:text-[#7B4DFF]"
    }`}
    style={{ fontFamily }}
  >
    <Icon size={17} />
    {label}
  </button>
);

const StatCard = ({ label, value, sub, subColor, icon: Icon, iconBg }) => (
  <div
    className="bg-white rounded-[20px] border border-[#ECECEC] px-5 py-4 flex items-start justify-between"
    style={{ fontFamily }}
  >
    <div>
      <p className="text-[12px] text-[#999] mb-1">{label}</p>
      <p className="text-[22px] font-bold text-[#1E1E1E] leading-tight">{value}</p>
      {sub && (
        <p className="text-[11px] mt-1" style={{ color: subColor || "#22C55E" }}>
          {sub}
        </p>
      )}
    </div>
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center"
      style={{ background: iconBg || "#F3ECFF" }}
    >
      <Icon size={18} color="#7B4DFF" />
    </div>
  </div>
);

// ── main component ────────────────────────────────────────
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
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  // ── derived stats ──────────────────────────────────────
  const totalSessions = histories.length;

  // confidence score: average of happy/confident %
  const avgConfidence = (() => {
    if (!histories.length) return 0;
    const scores = histories.map((h) => {
      const pos = h.allStats?.find((s) =>
        ["Happy", "Confident", "Neutral"].includes(s.label)
      );
      return pos?.value || 0;
    });
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  })();

  // dominant emotion overall
  const dominantEmotion = (() => {
    if (!histories.length) return "—";
    const counts = {};
    histories.forEach((h) => { counts[h.emotion] = (counts[h.emotion] || 0) + 1; });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  })();

  // practice streak (consecutive days)
  const streak = (() => {
    if (!histories.length) return 0;
    const dates = [...new Set(histories.map((h) =>
      new Date(h.createdAt).toLocaleDateString("en-CA")
    ))].sort().reverse();
    let s = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const d1 = new Date(dates[i]);
      const d2 = new Date(dates[i + 1]);
      const diff = (d1 - d2) / 86400000;
      if (diff === 1) s++; else break;
    }
    return s;
  })();

  // performance chart: last 6 months
  const chartData = (() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = months[d.getMonth()];
      const monthSessions = histories.filter((h) => {
        const hd = new Date(h.createdAt);
        return hd.getMonth() === d.getMonth() && hd.getFullYear() === d.getFullYear();
      });
      const score = monthSessions.length
        ? Math.round(monthSessions.reduce((acc, h) => {
            const pos = h.allStats?.find((s) => ["Happy","Confident","Neutral"].includes(s.label));
            return acc + (pos?.value || 0);
          }, 0) / monthSessions.length)
        : 0;
      return { label, score };
    });
  })();

  // emotions summary
  const emotionsSummary = (() => {
    if (!histories.length) return [];
    const counts = {};
    histories.forEach((h) => { counts[h.emotion] = (counts[h.emotion] || 0) + 1; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts)
      .map(([label, count]) => ({ label, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 6);
  })();

  const topEmotion = emotionsSummary[0];
  const overallScore = topEmotion?.pct || 0;

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[#F7F7FB]" style={{ fontFamily }}>

      {/* ── SIDEBAR ─────────────────────────────────── */}
      <aside className="hidden lg:flex w-[220px] bg-white border-r border-[#ECECEC] px-5 py-7 flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer mb-8"
          >
            <img src="/logo/Icon_Insight.png" alt="logo" className="w-9 h-9" />
            <h1 className="text-[22px] font-bold fontIntersight">Intersight</h1>
          </div>

          {/* Overview menu */}
          <p className="text-[10px] font-bold text-[#BBBBBB] tracking-widest mb-3 px-1">OVERVIEW</p>
          <div className="flex flex-col gap-1.5">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active onClick={() => navigate("/dashboard")} />
            <SidebarItem icon={BriefcaseBusiness} label="Interview" onClick={() => navigate("/interview")} />
            <SidebarItem icon={Bot} label="AI Assistant" onClick={() => navigate("/chatbot")} />
          </div>

          {/* Settings menu */}
          <p className="text-[10px] font-bold text-[#BBBBBB] tracking-widest mb-3 px-1 mt-8">SETTINGS</p>
          <div className="flex flex-col gap-1.5">
            <SidebarItem icon={Settings} label="Setting" onClick={() => navigate("/profile")} />
            <SidebarItem icon={LogOut} label="Log Out" onClick={logout} />
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <div className="bg-white border-b border-[#ECECEC] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#F7F7FB] rounded-full px-4 py-2 w-[320px]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Find past interviews, resources, or tips..."
              className="bg-transparent outline-none text-[13px] text-[#999] w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <Bell size={18} className="text-[#999]" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7B4DFF] to-[#C7B5FF] flex items-center justify-center text-white text-[12px] font-bold">
                {user?.username?.[0]?.toUpperCase() || "A"}
              </div>
              <span className="text-[14px] font-semibold text-[#1E1E1E]">
                {user?.username?.split(" ")[0] || "Angel"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 overflow-auto">

          {/* Greeting Card */}
          <div
            className="relative w-full rounded-[24px] overflow-hidden mb-6"
            style={{
              background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b69 50%, #1a1a3e 100%)",
              minHeight: "160px",
            }}
          >
            {/* Background overlay image */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: "url('/hero/Interview.png')",
                backgroundSize: "cover",
                backgroundPosition: "center right",
              }}
            />
            <div className="relative z-10 px-8 py-8 max-w-[520px]">
              <h2 className="text-white text-[22px] md:text-[26px] font-bold leading-tight mb-2">
                {getGreeting()} {user?.username?.split(" ")[0] || "Angel"}, Ready to Shine<br />
                in Your Next interview ?
              </h2>
              <p className="text-[#C4B5FD] text-[13px] leading-relaxed">
                {totalSessions > 0
                  ? `You've completed ${totalSessions} sessions. Keep up the momentum with a quick technical session today.`
                  : "Start your first simulation and let AI analyze your confidence today."}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Simulation Score"
              value={`${avgConfidence}/100`}
              sub={totalSessions > 0 ? `+${Math.min(avgConfidence, 10)}% from last week` : "No sessions yet"}
              subColor="#22C55E"
              icon={TrendingUp}
              iconBg="#EDE9FF"
            />
            <StatCard
              label="Total Simulations"
              value={`${totalSessions} Sessions`}
              sub={totalSessions > 0 ? `+${Math.min(totalSessions, 3)} from last week` : "Start your first"}
              subColor="#22C55E"
              icon={BriefcaseBusiness}
              iconBg="#EDE9FF"
            />
            <StatCard
              label="AI Confidence Level"
              value={dominantEmotion}
              sub={totalSessions > 0 ? `Top ${Math.min(avgConfidence, 15)}% of users` : "Complete sessions"}
              subColor="#7B4DFF"
              icon={Zap}
              iconBg="#EDE9FF"
            />
            <StatCard
              label="Practice Streak"
              value={`${streak} Days`}
              sub="Keep That Spirit !"
              subColor="#F97316"
              icon={Flame}
              iconBg="#FFF3ED"
            />
          </div>

          {/* Chart + Emotions */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">

            {/* Performance Score Trend */}
            <div className="bg-white rounded-[20px] border border-[#ECECEC] p-6">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[15px] font-bold text-[#1E1E1E]">Performance Score Trend</p>
                <div className="flex gap-2">
                  {["6M", "1Y"].map((t) => (
                    <button
                      key={t}
                      className="text-[12px] px-3 py-1 rounded-full font-semibold bg-[#7B4DFF] text-white"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {isLoading ? (
                <div className="h-[200px] flex items-center justify-center text-[#999] text-[13px]">
                  Loading chart...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12, fill: "#999" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #ECECEC",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#7B4DFF"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#7B4DFF", strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Emotions Summary */}
            <div className="bg-white rounded-[20px] border border-[#ECECEC] p-6">
              <p className="text-[15px] font-bold text-[#1E1E1E] mb-5">Emotions Summary</p>

              {/* Donut chart */}
              <div className="flex justify-center mb-5">
                <div className="relative w-[120px] h-[120px]">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#F3F3F3" strokeWidth="14" />
                    <circle
                      cx="60" cy="60" r="50"
                      fill="none"
                      stroke="#7B4DFF"
                      strokeWidth="14"
                      strokeDasharray={`${(overallScore / 100) * 314} 314`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[20px] font-bold text-[#1E1E1E]">{overallScore}%</span>
                    <span className="text-[10px] text-[#999]">Overall</span>
                  </div>
                </div>
              </div>

              {/* Emotion list */}
              <div className="flex flex-col gap-2.5">
                {isLoading ? (
                  <p className="text-[13px] text-[#999] text-center">Loading...</p>
                ) : emotionsSummary.length > 0 ? (
                  emotionsSummary.map((e) => (
                    <div key={e.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: emotionColorMap[e.label] || "#A78BFA" }}
                        />
                        <span className="text-[13px] text-[#444]">{e.label}</span>
                      </div>
                      <span className="text-[13px] font-semibold text-[#1E1E1E]">{e.pct}%</span>
                    </div>
                  ))
                ) : (
                  ["Happy","Sad","Normal","Fear","Angry","Disgust"].map((e) => (
                    <div key={e} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: emotionColorMap[e] }} />
                        <span className="text-[13px] text-[#444]">{e}</span>
                      </div>
                      <span className="text-[13px] font-semibold text-[#999]">—</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
