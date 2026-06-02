import React, { useEffect, useState, useContext, useRef } from "react";
import { getHistory } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import Swal from "sweetalert2";
import { toPng } from "html-to-image";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardFooter from "../layout/DashboardFooter";
import DashboardTopBar from "../components/DashboardTopBar";

const fontFamily = "'Plus Jakarta Sans', sans-serif";

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

const emotionIcon = (emotion) => {
  const map = { Happy: "/icons/historyhappy.png", Neutral: "/icons/historyneutral.png", Confident: "/icons/historyconfident.png", Anxious: "/icons/historyanxious.png", Sad: "/icons/historyneutral.png", Angry: "/icons/historyanxious.png", Fear: "/icons/historyanxious.png" };
  return map[emotion] || "/icons/historyneutral.png";
};

const emotionColor = (emotion) => {
  const map = { Happy: "#F472B6", Neutral: "#8B5CF6", Confident: "#F97316", Anxious: "#9CA3AF", Sad: "#60A5FA", Angry: "#EF4444", Fear: "#F97316" };
  return map[emotion] || "#8B5CF6";
};

const ITEMS_PER_PAGE = 4;

export default function HistoryPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const exportAreaRef = useRef(null);

  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [search, setSearch] = useState("");
  const [filterTime] = useState("All Time");
  const [filterRole] = useState("All Roles");
  const [filterMore] = useState("More Times");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { if (user?.id) loadHistory(); }, [user]); // eslint-disable-line

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getHistory(user.id);
      setHistories(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch { console.error("Gagal muat history"); }
    finally { setIsLoading(false); }
  };

  const deleteItem = async (e, id) => {
    e.stopPropagation();
    const result = await Swal.fire({ title: "Hapus?", text: "Yakin hapus riwayat ini?", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Ya, hapus!", cancelButtonText: "Tidak" });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API_BASE_URL}/history/${id}`);
      setHistories((prev) => prev.filter((h) => h._id !== id));
      if (selectedHistory?._id === id) setSelectedHistory(null);
      Swal.fire({ title: "Terhapus!", icon: "success", timer: 1500, showConfirmButton: false });
    } catch { Swal.fire("Gagal!", "Terjadi kesalahan.", "error"); }
  };

  const exportImage = async () => {
    if (!exportAreaRef.current) return;
    Swal.fire({ title: "Membuat Story...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      await new Promise((r) => setTimeout(r, 600));
      const dataUrl = await toPng(exportAreaRef.current, { cacheBust: true, pixelRatio: 3, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `InterviewAI-Story.png`;
      link.href = dataUrl;
      link.click();
      Swal.fire({ title: "Berhasil!", icon: "success", timer: 2000, showConfirmButton: false });
    } catch { Swal.fire("Gagal", "Gagal export gambar.", "error"); }
  };

  // Stats untuk stat cards bawah
  const avgScore = histories.length ? Math.round(histories.reduce((acc, h) => { const pos = h.allStats?.find((s) => ["Happy","Confident","Neutral"].includes(s.label)); return acc + (pos?.value || 0); }, 0) / histories.length) : 0;
  const dominantEmotion = (() => { if (!histories.length) return "—"; const c = {}; histories.forEach((h) => { c[h.emotion] = (c[h.emotion] || 0) + 1; }); return Object.keys(c).reduce((a, b) => c[a] > c[b] ? a : b); })();
  const streak = (() => { if (!histories.length) return 0; const dates = [...new Set(histories.map((h) => new Date(h.createdAt).toLocaleDateString("en-CA")))].sort().reverse(); let s = 1; for (let i = 0; i < dates.length - 1; i++) { if ((new Date(dates[i]) - new Date(dates[i + 1])) / 86400000 === 1) s++; else break; } return s; })();

  // Filter & paginate
  const filtered = histories.filter((h) => {
    const q = search.toLowerCase();
    return !q || (h.question?.toLowerCase().includes(q)) || (h.emotion?.toLowerCase().includes(q));
  });
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
            <SidebarItem imgSrc="/icons/overviewdashboard.png" activeImgSrc="/icons/overviewdashboardungu.png" label="Dashboard" onClick={() => navigate("/dashboard")} />
            <SidebarItem imgSrc="/icons/overviewinterview.png" activeImgSrc="/icons/overviewinterviewungu.png" label="Interview" onClick={() => navigate("/interview")} />
            <SidebarItem imgSrc="/icons/overviewai.png" activeImgSrc="/icons/overviewaiungu.png" label="AI Assistant" onClick={() => navigate("/chatbot")} />
            <SidebarItem imgSrc="/icons/overviewhistory.png" activeImgSrc="/icons/overviewhistoryungu.png" label="History" active onClick={() => navigate("/history")} />
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

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-[240px]">
        <DashboardTopBar />

        <div className="flex-1 px-6 py-6 overflow-auto">
          <h1 className="text-[24px] font-bold text-[#1E1E1E] mb-1" style={{ fontFamily }}>Interview History</h1>
          <p className="text-[14px] text-[#777] mb-6" style={{ fontFamily }}>Review your past simulation interview performances and track your progress.</p>

          {/* Main Card */}
          <div className="bg-white rounded-[20px] border border-[#ECECEC] overflow-hidden mb-5">

            {/* Search + Filter bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F0F0F0] flex-wrap">
              <div className="flex items-center gap-2 bg-[#F7F7FB] rounded-full px-4 py-2 flex-1 min-w-[180px] max-w-[280px]">
                <Search size={14} className="text-[#999]" />
                <input type="text" placeholder="Search Simulation..."
                  value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="bg-transparent outline-none text-[13px] text-[#555] w-full" style={{ fontFamily }} />
              </div>
              {[["All Time", filterTime], ["All Roles", filterRole], ["More Times", filterMore]].map(([val]) => (
                <button key={val} className="flex items-center gap-1.5 bg-[#F7F7FB] rounded-full px-4 py-2 text-[13px] font-medium text-[#555] border border-[#ECECEC] hover:border-[#7B4DFF] transition"
                  style={{ fontFamily }}>
                  {val} <ChevronDown size={13} />
                </button>
              ))}
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-[#999] text-[14px]" style={{ fontFamily }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <p className="text-[15px] font-semibold text-[#999]" style={{ fontFamily }}>Belum ada riwayat simulasi</p>
                <button onClick={() => navigate("/interview")}
                  className="px-6 py-2.5 rounded-full text-white text-[13px] font-semibold"
                  style={{ background: "linear-gradient(90deg,#7B4DFF,#C026D3)", fontFamily }}>
                  Mulai Simulasi
                </button>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#F0F0F0]">
                      {["Date", "Questions", "Simulation Score", "Dominant Emotion", "Feedback", "Action"].map((h) => (
                        <th key={h} className="text-left px-5 py-3.5 text-[13px] font-bold text-[#1E1E1E]" style={{ fontFamily }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((item, i) => {
                      const date = new Date(item.createdAt);
                      const score = item.allStats?.find((s) => ["Happy","Confident","Neutral"].includes(s.label))?.value || 0;
                      return (
                        <tr key={item._id || i} className="border-b border-[#F8F8F8] hover:bg-[#FAFAFA] transition cursor-pointer"
                          onClick={() => setSelectedHistory(item)}>
                          <td className="px-5 py-4">
                            <p className="text-[13px] font-semibold text-[#1E1E1E]" style={{ fontFamily }}>
                              {date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                            <p className="text-[12px] text-[#999]" style={{ fontFamily }}>
                              {date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-[13px] font-semibold text-[#1E1E1E]" style={{ fontFamily }}>
                              {item.positionApplied || item.question?.substring(0, 20) + "..." || "—"}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[13px] font-bold border border-[#7B4DFF] text-[#7B4DFF]"
                              style={{ fontFamily }}>
                              {score}%
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <img src={emotionIcon(item.emotion)} alt={item.emotion} className="w-5 h-5 object-contain" />
                              <span className="text-[13px] font-semibold" style={{ color: emotionColor(item.emotion), fontFamily }}>
                                {item.emotion || "—"}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <button onClick={(e) => { e.stopPropagation(); setSelectedHistory(item); }}
                              className="px-4 py-1.5 rounded-full text-[12px] font-semibold text-[#7B4DFF] border border-[#7B4DFF] bg-white hover:bg-[#F3ECFF] transition"
                              style={{ fontFamily }}>
                              View Detail
                            </button>
                          </td>
                          <td className="px-5 py-4">
                            <button onClick={(e) => deleteItem(e, item._id)}
                              className="w-8 h-8 rounded-full bg-[#FFF0F0] flex items-center justify-center hover:bg-red-500 transition group">
                              <img src="/icons/historytrash.png" alt="delete" className="w-4 h-4 object-contain group-hover:brightness-0 group-hover:invert" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-4">
                  <p className="text-[13px] text-[#999]" style={{ fontFamily }}>
                    Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} results
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                      className="w-8 h-8 rounded-full border border-[#ECECEC] flex items-center justify-center disabled:opacity-40 hover:border-[#7B4DFF] transition">
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 rounded-full text-[13px] font-semibold transition ${currentPage === p ? "bg-[#7B4DFF] text-white" : "border border-[#ECECEC] text-[#555] hover:border-[#7B4DFF]"}`}
                        style={{ fontFamily }}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                      className="w-8 h-8 rounded-full border border-[#ECECEC] flex items-center justify-center disabled:opacity-40 hover:border-[#7B4DFF] transition">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Simulation Score", value: `${avgScore}/100`, sub: `+${Math.min(avgScore,10)}% from last week`, subColor: "#22C55E", icon: "/icons/simulationscore.png" },
              { label: "Total Simulations", value: `${histories.length} Sessions`, sub: `+${Math.min(histories.length,3)} from last week`, subColor: "#22C55E", icon: "/icons/totalsimulations.png" },
              { label: "AI Confidence Level", value: dominantEmotion, sub: `Top ${Math.min(avgScore,15)}% of users`, subColor: "#7B4DFF", icon: "/icons/aiconfidence.png" },
              { label: "Practice Streak", value: `${streak} Days`, sub: "Keep That Spirit !", subColor: "#F97316", icon: "/icons/streak.png" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-[20px] border border-[#ECECEC] px-5 py-5 flex items-start justify-between" style={{ fontFamily }}>
                <div>
                  <p className="text-[13px] text-[#999] mb-1">{s.label}</p>
                  <p className="text-[22px] font-bold text-[#1E1E1E] leading-tight">{s.value}</p>
                  <p className="text-[12px] mt-1" style={{ color: s.subColor }}>{s.sub}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#F3ECFF] flex items-center justify-center">
                  <img src={s.icon} alt={s.label} className="w-7 h-7 object-contain" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Modal */}
        {selectedHistory && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setSelectedHistory(null)}>
            <div className="bg-white rounded-[24px] w-full max-w-[680px] max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-[#F0F0F0] px-6 py-4 flex items-center justify-between rounded-t-[24px]">
                <h3 className="text-[17px] font-bold text-[#1E1E1E]" style={{ fontFamily }}>Detail Riwayat</h3>
                <div className="flex items-center gap-2">
                  <button onClick={exportImage}
                    className="px-4 py-1.5 rounded-full text-[12px] font-semibold border border-[#7B4DFF] text-[#7B4DFF] hover:bg-[#F3ECFF] transition"
                    style={{ fontFamily }}>Export</button>
                  <button onClick={(e) => deleteItem(e, selectedHistory._id)}
                    className="px-4 py-1.5 rounded-full text-[12px] font-semibold border border-red-300 text-red-500 hover:bg-red-50 transition"
                    style={{ fontFamily }}>Hapus</button>
                  <button onClick={() => setSelectedHistory(null)}
                    className="w-8 h-8 rounded-full bg-[#F7F7FB] flex items-center justify-center text-[#555] hover:bg-[#ECECEC] transition text-lg font-bold">×</button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex gap-4 mb-5">
                  <div className="w-[140px] h-[105px] rounded-[14px] overflow-hidden border-2 border-[#7B4DFF] flex-shrink-0 bg-[#F7F7FB]">
                    {selectedHistory.userPhoto
                      ? <img src={selectedHistory.userPhoto} alt="User" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-[#999] text-[12px]">No Photo</div>}
                  </div>
                  <div className="flex-1 bg-[#FAFAFA] rounded-[14px] p-4 border border-[#ECECEC]">
                    <p className="text-[11px] font-bold text-[#7B4DFF] mb-1" style={{ fontFamily }}>PERTANYAAN ({selectedHistory.duration}s)</p>
                    <p className="text-[14px] font-semibold text-[#1E1E1E] leading-relaxed" style={{ fontFamily }}>"{selectedHistory.question}"</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-[#999] mb-2" style={{ fontFamily }}>DRAFT JAWABAN</p>
                  <p className="text-[13px] text-[#555] leading-relaxed bg-[#FAFAFA] rounded-[14px] p-4 border border-[#ECECEC]" style={{ fontFamily }}>
                    {selectedHistory.answer || "—"}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {selectedHistory.allStats?.map((s, i) => (
                    <div key={i} className="bg-[#F7F7FB] rounded-[14px] p-3 text-center border border-[#ECECEC]">
                      <p className="text-[11px] text-[#999]" style={{ fontFamily }}>{s.label}</p>
                      <p className="text-[18px] font-bold text-[#1E1E1E]" style={{ fontFamily }}>{s.value}%</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-[16px] p-4 text-white text-center"
                  style={{ background: "linear-gradient(135deg, #7B4DFF, #C026D3)" }}>
                  <p className="text-[13px] font-bold mb-1" style={{ fontFamily }}>Emosi Dominan: {selectedHistory.emotion}</p>
                  <p className="text-[12px] opacity-90" style={{ fontFamily }}>"{selectedHistory.motivation}"</p>
                </div>
              </div>
              {/* Hidden export area */}
              <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                <div ref={exportAreaRef} style={{ width: "500px", height: "888px", background: "linear-gradient(180deg,#F9F7FC,#FFF)", padding: "40px", display: "flex", flexDirection: "column", fontFamily, boxSizing: "border-box" }}>
                  <div style={{ background: "linear-gradient(135deg,#7B4DFF,#C026D3)", color: "#FFF", padding: "20px 30px", borderRadius: "25px", textAlign: "center", marginBottom: "15px" }}>
                    <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 900 }}>INTERSIGHT</h1>
                    <p style={{ margin: "4px 0 0", fontSize: "0.8rem", opacity: 0.9 }}>{new Date(selectedHistory.createdAt).toLocaleString("id-ID")}</p>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div style={{ background: "#FFF", padding: "15px", borderRadius: "15px", border: "1px solid #ECECEC" }}>
                      <p style={{ fontSize: "0.6rem", color: "#7B4DFF", fontWeight: 900, margin: "0 0 5px" }}>PERTANYAAN</p>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, margin: 0 }}>"{selectedHistory.question?.substring(0, 100)}"</p>
                    </div>
                    <div style={{ background: "linear-gradient(135deg,#7B4DFF,#C026D3)", color: "#FFF", padding: "15px", borderRadius: "15px", textAlign: "center" }}>
                      <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: 900 }}>{selectedHistory.emotion}</h2>
                      <p style={{ margin: "5px 0 0", fontSize: "0.85rem", opacity: 0.9 }}>"{selectedHistory.motivation}"</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #EEE", paddingTop: "20px", marginTop: "20px" }}>
                    <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.9rem", color: "#7B4DFF" }}>interview-ai-frontend-indol.vercel.app</p>
                    <div style={{ padding: "5px", background: "#FFF", borderRadius: "10px", border: "1px solid #EEE" }}>
                      <QRCodeCanvas value={window.location.origin} size={60} fgColor="#7B4DFF" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <DashboardFooter />
      </main>
    </div>
  );
}
