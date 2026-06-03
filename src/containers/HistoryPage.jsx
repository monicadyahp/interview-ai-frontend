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
    <img
      src={active && activeImgSrc ? activeImgSrc : imgSrc}
      alt={label}
      className="w-[22px] h-[22px] object-contain"
    />
    {label}
  </button>
);

const emotionIcon = (emotion) => {
  const map = {
    Happy: "/icons/historyhappy.png",
    Neutral: "/icons/historyneutral.png",
    Confident: "/icons/historyconfident.png",
    Anxious: "/icons/historyanxious.png",
    Sad: "/icons/historyneutral.png",
    Angry: "/icons/historyanxious.png",
    Fear: "/icons/historyanxious.png",
  };
  return map[emotion] || "/icons/historyneutral.png";
};

const emotionColor = (emotion) => {
  const map = {
    Happy: "#F472B6",
    Neutral: "#8B5CF6",
    Confident: "#F97316",
    Anxious: "#9CA3AF",
    Sad: "#60A5FA",
    Angry: "#EF4444",
    Fear: "#F97316",
  };
  return map[emotion] || "#8B5CF6";
};

// Dropdown filter — opsi diambil dari data, pilih = auto-filter tabel
const FilterDropdown = ({ value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium border transition ${open ? "border-[#7B4DFF] text-[#7B4DFF] bg-[#F8F5FF]" : "bg-[#F7F7FB] text-[#555] border-[#ECECEC] hover:border-[#7B4DFF]"}`}
        style={{ fontFamily }}
      >
        {value}{" "}
        <ChevronDown
          size={13}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-30 min-w-[170px] max-h-[260px] overflow-auto bg-white rounded-[14px] border border-[#ECECEC] shadow-lg py-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-[13px] transition hover:bg-[#F5F2FF] ${value === opt ? "text-[#7B4DFF] font-semibold bg-[#F8F5FF]" : "text-[#555]"}`}
              style={{ fontFamily }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ITEMS_PER_PAGE = 4;

export default function HistoryPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const exportAreaRef = useRef(null);
  const tableScrollRef = useRef(null);
  const trackRef = useRef(null);
  const dragRef = useRef(null);
  const [scrollInfo, setScrollInfo] = useState({ ratio: 1, pos: 0 });

  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [search, setSearch] = useState("");
  const [filterTime, setFilterTime] = useState("All Time");
  const [filterRole, setFilterRole] = useState("All Roles");
  const [filterEmotion, setFilterEmotion] = useState("All Emotions");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user?.id) loadHistory();
  }, [user]); // eslint-disable-line

  // Hitung ukuran & posisi thumb scrollbar custom. Dibuat manual karena iOS Safari
  // menyembunyikan scrollbar native (tidak menghormati ::-webkit-scrollbar).
  const updateScrollInfo = () => {
    const el = tableScrollRef.current;
    if (!el) return;
    const { scrollWidth, clientWidth, scrollLeft } = el;
    const ratio = scrollWidth > 0 ? clientWidth / scrollWidth : 1;
    const maxScroll = scrollWidth - clientWidth;
    const pos = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    setScrollInfo({ ratio: Math.min(ratio, 1), pos });
  };

  useEffect(() => {
    updateScrollInfo();
    window.addEventListener("resize", updateScrollInfo);
    return () => window.removeEventListener("resize", updateScrollInfo);
  }, [histories, search, currentPage, isLoading]);

  // Drag thumb untuk menggeser tabel ke samping
  const onThumbDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startScrollLeft: tableScrollRef.current?.scrollLeft || 0,
    };
  };
  const onThumbMove = (e) => {
    if (!dragRef.current || !tableScrollRef.current || !trackRef.current)
      return;
    const dx = e.clientX - dragRef.current.startX;
    const scale =
      tableScrollRef.current.scrollWidth / trackRef.current.clientWidth;
    tableScrollRef.current.scrollLeft =
      dragRef.current.startScrollLeft + dx * scale;
  };
  const onThumbUp = (e) => {
    dragRef.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getHistory(user.id);
      setHistories(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      );
    } catch {
      console.error("Gagal muat history");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (e, id) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Hapus?",
      text: "Yakin hapus riwayat ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Tidak",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API_BASE_URL}/history/${id}`);
      setHistories((prev) => prev.filter((h) => h._id !== id));
      if (selectedHistory?._id === id) setSelectedHistory(null);
      Swal.fire({
        title: "Terhapus!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire("Gagal!", "Terjadi kesalahan.", "error");
    }
  };

  const exportImage = async () => {
    if (!exportAreaRef.current) return;
    Swal.fire({
      title: "Membuat Story...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    try {
      await new Promise((r) => setTimeout(r, 600));
      const dataUrl = await toPng(exportAreaRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `InterviewAI-Story.png`;
      link.href = dataUrl;
      link.click();
      Swal.fire({
        title: "Berhasil!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire("Gagal", "Gagal export gambar.", "error");
    }
  };

  // Stats untuk stat cards bawah
  const emotionWeights = {
    Happy: 100,
    Neutral: 75,
    Surprise: 60,
    Fear: 35,
    Sad: 25,
    Disgust: 20,
    Angry: 20,
  };
  const calcScore = (h) =>
    h.allStats?.length
      ? Math.min(
          100,
          Math.round(
            h.allStats.reduce(
              (acc, s) =>
                acc + (s.value / 100) * (emotionWeights[s.label] ?? 30),
              0,
            ),
          ),
        )
      : Math.round((h.confidence || 0) * 100);
  const avgScore = histories.length
    ? Math.round(
        histories.reduce((acc, h) => acc + calcScore(h), 0) / histories.length,
      )
    : 0;
  const dominantEmotion = (() => {
    if (!histories.length) return "—";
    const c = {};
    histories.forEach((h) => {
      c[h.emotion] = (c[h.emotion] || 0) + 1;
    });
    return Object.keys(c).reduce((a, b) => (c[a] > c[b] ? a : b));
  })();
  const streak = (() => {
    if (!histories.length) return 0;
    const dates = [
      ...new Set(
        histories.map((h) => new Date(h.createdAt).toLocaleDateString("en-CA")),
      ),
    ]
      .sort()
      .reverse();
    let s = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      if ((new Date(dates[i]) - new Date(dates[i + 1])) / 86400000 === 1) s++;
      else break;
    }
    return s;
  })();

  // Opsi dropdown diambil dari data yang ada
  const roleOptions = [
    "All Roles",
    ...Array.from(
      new Set(histories.map((h) => h.positionApplied).filter(Boolean)),
    ),
  ];
  const emotionOptions = [
    "All Emotions",
    ...Array.from(new Set(histories.map((h) => h.emotion).filter(Boolean))),
  ];
  const timeOptions = ["All Time", "Today", "Last 7 Days", "Last 30 Days"];

  // Reset ke halaman 1 setiap kali filter berubah
  const applyFilter = (setter) => (val) => {
    setter(val);
    setCurrentPage(1);
  };

  const withinTimeFilter = (createdAt) => {
    if (filterTime === "All Time") return true;
    const created = new Date(createdAt);
    const now = new Date();
    if (filterTime === "Today")
      return created.toDateString() === now.toDateString();
    const diffDays = (now - created) / 86400000;
    if (filterTime === "Last 7 Days") return diffDays <= 7;
    if (filterTime === "Last 30 Days") return diffDays <= 30;
    return true;
  };

  // Filter & paginate
  const filtered = histories.filter((h) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      h.question?.toLowerCase().includes(q) ||
      h.emotion?.toLowerCase().includes(q) ||
      h.positionApplied?.toLowerCase().includes(q);
    const matchRole =
      filterRole === "All Roles" || h.positionApplied === filterRole;
    const matchEmotion =
      filterEmotion === "All Emotions" || h.emotion === filterEmotion;
    const matchTime = withinTimeFilter(h.createdAt);
    return matchSearch && matchRole && matchEmotion && matchTime;
  });
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[#F7F7FB]" style={{ fontFamily }}>
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-[240px] bg-white border-r border-[#ECECEC] px-5 py-7 flex-col justify-between shrink-0 fixed top-0 left-0 h-full z-10">
        <div>
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer mb-8"
          >
            <img
              src="/logo/Icon_Insight.png"
              alt="logo"
              className="w-10 h-10"
            />
            <h1 className="text-[24px] font-bold fontIntersight">Intersight</h1>
          </div>
          <p className="text-[11px] font-bold text-[#BBBBBB] tracking-widest mb-3 px-1">
            OVERVIEW
          </p>
          <div className="flex flex-col gap-1.5">
            <SidebarItem
              imgSrc="/icons/overviewdashboard.png"
              activeImgSrc="/icons/overviewdashboardungu.png"
              label="Dashboard"
              onClick={() => navigate("/dashboard")}
            />
            <SidebarItem
              imgSrc="/icons/overviewinterview.png"
              activeImgSrc="/icons/overviewinterviewungu.png"
              label="Interview"
              onClick={() => navigate("/interview")}
            />
            <SidebarItem
              imgSrc="/icons/overviewai.png"
              activeImgSrc="/icons/overviewaiungu.png"
              label="AI Assistant"
              onClick={() => navigate("/chatbot")}
            />
            <SidebarItem
              imgSrc="/icons/overviewhistory.png"
              activeImgSrc="/icons/overviewhistoryungu.png"
              label="History"
              active
              onClick={() => navigate("/history")}
            />
            <SidebarItem
              imgSrc="/icons/overviewlearning.png"
              activeImgSrc="/icons/overviewlearningungu.png"
              label="Learning"
              onClick={() => navigate("/learning")}
            />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#BBBBBB] tracking-widest mb-3 px-1">
            SETTINGS
          </p>
          <div className="flex flex-col gap-1.5">
            <SidebarItem
              imgSrc="/icons/setting.png"
              activeImgSrc="/icons/overviewsettingungu.png"
              label="Setting"
              onClick={() => navigate("/profile")}
            />
            <SidebarItem
              imgSrc="/icons/logout.png"
              label="Log Out"
              onClick={logout}
            />
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-[240px]">
        <DashboardTopBar />

        <div className="flex-1 px-4 sm:px-6 py-5 sm:py-6 overflow-auto">
          <h1
            className="text-[24px] font-bold text-[#1E1E1E] mb-1"
            style={{ fontFamily }}
          >
            Interview History
          </h1>
          <p className="text-[14px] text-[#777] mb-6" style={{ fontFamily }}>
            Review your past simulation interview performances and track your
            progress.
          </p>

          {/* Main Card */}
          <div className="bg-white rounded-[20px] border border-[#ECECEC] mb-5">
            {/* Search + Filter bar */}
            <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-4 border-b border-[#F0F0F0] flex-wrap">
              <div className="flex items-center gap-2 bg-[#F7F7FB] rounded-full px-4 py-2 flex-1 min-w-[180px] max-w-[280px]">
                <Search size={14} className="text-[#999]" />
                <input
                  type="text"
                  placeholder="Search Simulation..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent outline-none text-[13px] text-[#555] w-full"
                  style={{ fontFamily }}
                />
              </div>
              <FilterDropdown
                value={filterTime}
                options={timeOptions}
                onChange={applyFilter(setFilterTime)}
              />
              <FilterDropdown
                value={filterRole}
                options={roleOptions}
                onChange={applyFilter(setFilterRole)}
              />
              <FilterDropdown
                value={filterEmotion}
                options={emotionOptions}
                onChange={applyFilter(setFilterEmotion)}
              />
            </div>

            {/* Table */}
            {isLoading ? (
              <div
                className="flex items-center justify-center py-16 text-[#999] text-[14px]"
                style={{ fontFamily }}
              >
                Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <p
                  className="text-[15px] font-semibold text-[#999]"
                  style={{ fontFamily }}
                >
                  Belum ada riwayat simulasi
                </p>
                <button
                  onClick={() => navigate("/interview")}
                  className="px-6 py-2.5 rounded-full text-white text-[13px] font-semibold"
                  style={{
                    background: "linear-gradient(90deg,#7B4DFF,#C026D3)",
                    fontFamily,
                  }}
                >
                  Mulai Simulasi
                </button>
              </div>
            ) : (
              <>
                {/* Swipe hint (mobile only) */}
                <p
                  className="md:hidden text-[11px] text-[#A99Bd0] text-center pt-3 pb-1"
                  style={{ fontFamily }}
                >
                  ← Geser tabel ke samping untuk lihat detail →
                </p>
                {/* Table — scrolls horizontally on mobile/tablet to reveal all columns */}
                <div
                  className="table-scroll"
                  ref={tableScrollRef}
                  onScroll={updateScrollInfo}
                >
                  <table className="w-full min-w-[820px]">
                    <thead>
                      <tr className="border-b border-[#F0F0F0]">
                        {[
                          "Date",
                          "Questions",
                          "Position Applied",
                          "Simulation Score",
                          "Dominant Emotion",
                          "Feedback",
                          "Action",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left px-5 py-3.5 text-[13px] font-bold text-[#1E1E1E]"
                            style={{ fontFamily }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((item, i) => {
                        const date = new Date(item.createdAt);
                        const emotionWeights = {
                          Happy: 100,
                          Neutral: 75,
                          Surprise: 60,
                          Fear: 35,
                          Sad: 25,
                          Disgust: 20,
                          Angry: 20,
                        };
                        const score = item.allStats?.length
                          ? Math.min(
                              100,
                              Math.round(
                                item.allStats.reduce(
                                  (acc, s) =>
                                    acc +
                                    (s.value / 100) *
                                      (emotionWeights[s.label] ?? 30),
                                  0,
                                ),
                              ),
                            )
                          : Math.round((item.confidence || 0) * 100);
                        return (
                          <tr
                            key={item._id || i}
                            className="border-b border-[#F8F8F8] hover:bg-[#FAFAFA] transition cursor-pointer"
                            onClick={() => setSelectedHistory(item)}
                          >
                            <td className="px-5 py-4">
                              <p
                                className="text-[13px] font-semibold text-[#1E1E1E]"
                                style={{ fontFamily }}
                              >
                                {date.toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                              <p
                                className="text-[12px] text-[#999]"
                                style={{ fontFamily }}
                              >
                                {date.toLocaleTimeString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              <p
                                className="text-[13px] font-semibold text-[#1E1E1E]"
                                style={{ fontFamily }}
                              >
                                {item.question
                                  ? item.question.substring(0, 24) +
                                    (item.question.length > 24 ? "…" : "")
                                  : "—"}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              <p
                                className="text-[13px] font-semibold text-[#1E1E1E]"
                                style={{ fontFamily }}
                              >
                                {item.positionApplied || "—"}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[13px] font-bold border border-[#7B4DFF] text-[#7B4DFF]"
                                style={{ fontFamily }}
                              >
                                {score}%
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={emotionIcon(item.emotion)}
                                  alt={item.emotion}
                                  className="w-5 h-5 object-contain"
                                />
                                <span
                                  className="text-[13px] font-semibold"
                                  style={{
                                    color: emotionColor(item.emotion),
                                    fontFamily,
                                  }}
                                >
                                  {item.emotion || "—"}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedHistory(item);
                                }}
                                className="px-4 py-1.5 rounded-full text-[12px] font-semibold text-[#7B4DFF] border border-[#7B4DFF] bg-white hover:bg-[#F3ECFF] transition"
                                style={{ fontFamily }}
                              >
                                View Detail
                              </button>
                            </td>
                            <td className="px-5 py-4">
                              <button
                                onClick={(e) => deleteItem(e, item._id)}
                                className="w-8 h-8 rounded-full bg-[#FFF0F0] flex items-center justify-center hover:bg-red-500 transition group"
                              >
                                <img
                                  src="/icons/historytrash.png"
                                  alt="delete"
                                  className="w-4 h-4 object-contain group-hover:brightness-0 group-hover:invert"
                                />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Custom scrollbar (mobile) — terlihat di semua browser termasuk iOS.
                    Hanya tampil bila tabel memang lebih lebar dari layar. */}
                {scrollInfo.ratio < 0.999 && (
                  <div
                    ref={trackRef}
                    className="md:hidden mx-4 mt-2 mb-1 h-2 rounded-full bg-[#EFEDF7] relative touch-none"
                  >
                    <div
                      onPointerDown={onThumbDown}
                      onPointerMove={onThumbMove}
                      onPointerUp={onThumbUp}
                      onPointerCancel={onThumbUp}
                      className="absolute top-0 h-2 rounded-full bg-[#7B4DFF] cursor-grab active:cursor-grabbing"
                      style={{
                        width: `${Math.max(scrollInfo.ratio * 100, 14)}%`,
                        left: `${scrollInfo.pos * (100 - Math.max(scrollInfo.ratio * 100, 14))}%`,
                      }}
                    />
                  </div>
                )}

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4">
                  <p className="text-[13px] text-[#999]" style={{ fontFamily }}>
                    Showing{" "}
                    {Math.min(
                      (currentPage - 1) * ITEMS_PER_PAGE + 1,
                      filtered.length,
                    )}
                    –{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}{" "}
                    of {filtered.length} results
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-8 h-8 rounded-full border border-[#ECECEC] flex items-center justify-center disabled:opacity-40 hover:border-[#7B4DFF] transition"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`w-8 h-8 rounded-full text-[13px] font-semibold transition ${currentPage === p ? "bg-[#7B4DFF] text-white" : "border border-[#ECECEC] text-[#555] hover:border-[#7B4DFF]"}`}
                          style={{ fontFamily }}
                        >
                          {p}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 rounded-full border border-[#ECECEC] flex items-center justify-center disabled:opacity-40 hover:border-[#7B4DFF] transition"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              {
                label: "Simulation Score",
                value: `${avgScore}/100`,
                sub: `+${Math.min(avgScore, 10)}% from last week`,
                subColor: "#22C55E",
                icon: "/icons/simulationscore.png",
              },
              {
                label: "Total Simulations",
                value: `${histories.length} Sessions`,
                sub: `+${Math.min(histories.length, 3)} from last week`,
                subColor: "#22C55E",
                icon: "/icons/totalsimulations.png",
              },
              {
                label: "AI Confidence Level",
                value: dominantEmotion,
                sub: `Top ${Math.min(avgScore, 15)}% of users`,
                subColor: "#7B4DFF",
                icon: "/icons/aiconfidence.png",
              },
              {
                label: "Practice Streak",
                value: `${streak} Days`,
                sub: "Keep That Spirit !",
                subColor: "#F97316",
                icon: "/icons/streak.png",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-[20px] border border-[#ECECEC] px-5 py-5 flex items-start justify-between"
                style={{ fontFamily }}
              >
                <div>
                  <p className="text-[13px] text-[#999] mb-1">{s.label}</p>
                  <p className="text-[22px] font-bold text-[#1E1E1E] leading-tight">
                    {s.value}
                  </p>
                  <p className="text-[12px] mt-1" style={{ color: s.subColor }}>
                    {s.sub}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#F3ECFF] flex items-center justify-center">
                  <img
                    src={s.icon}
                    alt={s.label}
                    className="w-7 h-7 object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Modal */}
        {selectedHistory && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setSelectedHistory(null)}
          >
            <div
              className="bg-white rounded-[24px] w-full max-w-[680px] max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-white border-b border-[#F0F0F0] px-4 sm:px-6 py-4 flex items-center justify-between gap-2 flex-wrap rounded-t-[24px]">
                <h3
                  className="text-[17px] font-bold text-[#1E1E1E]"
                  style={{ fontFamily }}
                >
                  Detail Riwayat
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportImage}
                    className="px-4 py-1.5 rounded-full text-[12px] font-semibold border border-[#7B4DFF] text-[#7B4DFF] hover:bg-[#F3ECFF] transition"
                    style={{ fontFamily }}
                  >
                    Export
                  </button>
                  <button
                    onClick={(e) => deleteItem(e, selectedHistory._id)}
                    className="px-4 py-1.5 rounded-full text-[12px] font-semibold border border-red-300 text-red-500 hover:bg-red-50 transition"
                    style={{ fontFamily }}
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() => setSelectedHistory(null)}
                    className="w-8 h-8 rounded-full bg-[#F7F7FB] flex items-center justify-center text-[#555] hover:bg-[#ECECEC] transition text-lg font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-5">
                  <div className="w-full sm:w-[140px] h-[180px] sm:h-[105px] rounded-[14px] overflow-hidden border-2 border-[#7B4DFF] flex-shrink-0 bg-[#F7F7FB]">
                    {selectedHistory.userPhoto ? (
                      <img
                        src={selectedHistory.userPhoto}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#999] text-[12px]">
                        No Photo
                      </div>
                    )}
                  </div>
                  <div className="flex-1 bg-[#FAFAFA] rounded-[14px] p-4 border border-[#ECECEC]">
                    {selectedHistory.positionApplied && (
                      <p
                        className="text-[12px] font-semibold text-[#1E1E1E] mb-2"
                        style={{ fontFamily }}
                      >
                        <span className="text-[#7B4DFF]">Posisi Dilamar:</span>{" "}
                        {selectedHistory.positionApplied}
                      </p>
                    )}
                    <p
                      className="text-[11px] font-bold text-[#7B4DFF] mb-1"
                      style={{ fontFamily }}
                    >
                      PERTANYAAN ({selectedHistory.duration}s)
                    </p>
                    <p
                      className="text-[14px] font-semibold text-[#1E1E1E] leading-relaxed"
                      style={{ fontFamily }}
                    >
                      "{selectedHistory.question}"
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <p
                    className="text-[11px] font-bold text-[#999] mb-2"
                    style={{ fontFamily }}
                  >
                    DRAFT JAWABAN
                  </p>
                  <p
                    className="text-[13px] text-[#555] leading-relaxed bg-[#FAFAFA] rounded-[14px] p-4 border border-[#ECECEC]"
                    style={{ fontFamily }}
                  >
                    {selectedHistory.answer || "—"}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {selectedHistory.allStats?.map((s, i) => (
                    <div
                      key={i}
                      className="bg-[#F7F7FB] rounded-[14px] p-3 text-center border border-[#ECECEC]"
                    >
                      <p
                        className="text-[11px] text-[#999]"
                        style={{ fontFamily }}
                      >
                        {s.label}
                      </p>
                      <p
                        className="text-[18px] font-bold text-[#1E1E1E]"
                        style={{ fontFamily }}
                      >
                        {s.value}%
                      </p>
                    </div>
                  ))}
                </div>
                <div
                  className="rounded-[16px] p-4 text-white text-center"
                  style={{
                    background: "linear-gradient(135deg, #7B4DFF, #C026D3)",
                  }}
                >
                  <p className="text-[13px] font-bold" style={{ fontFamily }}>
                    Emosi Dominan: {selectedHistory.emotion}
                  </p>
                </div>
                <div className="rounded-[16px] p-4 border border-[#E8DFFF] bg-[#F8F5FF] mt-3">
                  <p
                    className="text-[11px] font-bold text-[#7B4DFF] mb-2"
                    style={{ fontFamily }}
                  >
                    SARAN INTERVIEW
                  </p>
                  <p
                    className="text-[13px] text-[#444] leading-relaxed"
                    style={{ fontFamily, fontStyle: "italic" }}
                  >
                    "{selectedHistory.motivation || "—"}"
                  </p>
                </div>
              </div>
              {/* Hidden export area */}
              <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                <div
                  ref={exportAreaRef}
                  style={{
                    width: "500px",
                    background: "#F8F7FC",
                    padding: "32px",
                    display: "flex",
                    flexDirection: "column",
                    fontFamily,
                    boxSizing: "border-box",
                    gap: "14px",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      background: "linear-gradient(135deg,#7B4DFF,#C026D3)",
                      color: "#FFF",
                      padding: "20px 30px",
                      borderRadius: "20px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      <img
                        src="/logo/Icon_Insight.png"
                        alt="logo"
                        style={{
                          width: "36px",
                          height: "36px",
                          objectFit: "contain",
                        }}
                      />
                      <h1
                        style={{
                          margin: 0,
                          fontSize: "1.8rem",
                          fontWeight: 900,
                          letterSpacing: "2px",
                        }}
                      >
                        INTERSIGHT
                      </h1>
                    </div>
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontSize: "0.8rem",
                        opacity: 0.9,
                      }}
                    >
                      {new Date(selectedHistory.createdAt).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                  {/* Photo + Question */}
                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      background: "#FFF",
                      borderRadius: "16px",
                      padding: "16px",
                      border: "1px solid #ECECEC",
                    }}
                  >
                    <div
                      style={{
                        width: "110px",
                        height: "110px",
                        flexShrink: 0,
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: "2px solid #7B4DFF",
                        background: "#F7F7FB",
                      }}
                    >
                      {selectedHistory.userPhoto ? (
                        <img
                          src={selectedHistory.userPhoto}
                          alt="user"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.65rem",
                            color: "#999",
                          }}
                        >
                          No Photo
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      {selectedHistory.positionApplied && (
                        <p
                          style={{
                            margin: "0 0 6px",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: "#7B4DFF",
                          }}
                        >
                          Posisi Dilamar:{" "}
                          <span style={{ color: "#1E1E1E" }}>
                            {selectedHistory.positionApplied}
                          </span>
                        </p>
                      )}
                      <p
                        style={{
                          margin: "0 0 5px",
                          fontSize: "0.6rem",
                          fontWeight: 900,
                          color: "#7B4DFF",
                          letterSpacing: "1px",
                        }}
                      >
                        PERTANYAAN ({selectedHistory.duration}s):
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          color: "#1E1E1E",
                          lineHeight: 1.4,
                        }}
                      >
                        "{selectedHistory.question?.substring(0, 100)}"
                      </p>
                    </div>
                  </div>
                  {/* Draft Answer */}
                  <div
                    style={{
                      background: "#FFF",
                      borderRadius: "16px",
                      padding: "14px 16px",
                      border: "1px solid #ECECEC",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 6px",
                        fontSize: "0.6rem",
                        fontWeight: 900,
                        color: "#999",
                        letterSpacing: "1px",
                      }}
                    >
                      DRAFT JAWABAN SAYA:
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.88rem",
                        color: "#444",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                      }}
                    >
                      {selectedHistory.answer || "—"}
                    </p>
                  </div>
                  {/* Analisis Ekspresi */}
                  {selectedHistory.allStats?.length > 0 && (
                    <div
                      style={{
                        background: "#F3ECFF",
                        borderRadius: "16px",
                        padding: "16px",
                        border: "1px solid #E8DFFF",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 12px",
                          fontSize: "0.68rem",
                          fontWeight: 900,
                          color: "#7B4DFF",
                          textAlign: "center",
                          letterSpacing: "2px",
                        }}
                      >
                        ANALISIS EKSPRESI
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                          justifyContent: "center",
                        }}
                      >
                        {selectedHistory.allStats.map((s, i) => (
                          <span
                            key={i}
                            style={{
                              padding: "5px 14px",
                              borderRadius: "999px",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              background:
                                s.label === selectedHistory.emotion
                                  ? "#7B4DFF"
                                  : "#FFF",
                              color:
                                s.label === selectedHistory.emotion
                                  ? "#FFF"
                                  : "#7B4DFF",
                              border: "1.5px solid #7B4DFF",
                              fontFamily,
                            }}
                          >
                            {s.label} {s.value}%
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Dominant Emotion */}
                  <div
                    style={{
                      background: "linear-gradient(135deg,#7B4DFF,#C026D3)",
                      color: "#FFF",
                      borderRadius: "16px",
                      padding: "14px 18px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "0.6rem",
                        fontWeight: 900,
                        opacity: 0.8,
                        letterSpacing: "2px",
                      }}
                    >
                      DOMINAN TERDETEKSI
                    </p>
                    <p style={{ margin: 0, fontSize: "2rem", fontWeight: 900 }}>
                      {selectedHistory.emotion}
                    </p>
                  </div>
                  {/* Saran Interview */}
                  <div
                    style={{
                      background: "#F8F5FF",
                      borderRadius: "16px",
                      padding: "20px 16px",
                      border: "1.5px solid #E8DFFF",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 6px",
                        fontSize: "0.6rem",
                        fontWeight: 900,
                        color: "#7B4DFF",
                        letterSpacing: "2px",
                      }}
                    >
                      SARAN INTERVIEW
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.85rem",
                        color: "#444",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                      }}
                    >
                      "{selectedHistory.motivation || "—"}"
                    </p>
                  </div>
                  {/* Footer */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      borderTop: "1px solid #EEE",
                      paddingTop: "16px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: "0 0 3px",
                          fontSize: "0.65rem",
                          color: "#999",
                        }}
                      >
                        Coba simulasi mandiri di:
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: "bold",
                          fontSize: "0.82rem",
                          color: "#7B4DFF",
                        }}
                      >
                        interview-ai-frontend-indol.vercel.app
                      </p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: "#7B4DFF",
                        }}
                      >
                        Scan Me!
                      </p>
                      <div
                        style={{
                          padding: "5px",
                          background: "#FFF",
                          borderRadius: "10px",
                          border: "1px solid #EEE",
                        }}
                      >
                        <QRCodeCanvas
                          value={window.location.origin}
                          size={60}
                          fgColor="#7B4DFF"
                        />
                      </div>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "0.58rem",
                          color: "#999",
                        }}
                      >
                        AI Powered
                      </p>
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
