import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const fontFamily = "'Plus Jakarta Sans', sans-serif";

const overviewLinks = [
  { label: "Dashboard", path: "/dashboard", icon: "/icons/overviewdashboard.png", iconActive: "/icons/overviewdashboardungu.png" },
  { label: "Interview", path: "/interview", icon: "/icons/overviewinterview.png", iconActive: "/icons/overviewinterviewungu.png" },
  { label: "AI Assistant", path: "/chatbot", icon: "/icons/overviewai.png", iconActive: "/icons/overviewaiungu.png" },
  { label: "History", path: "/history", icon: "/icons/overviewhistory.png", iconActive: "/icons/overviewhistoryungu.png" },
  { label: "Learning", path: "/learning", icon: "/icons/overviewlearning.png", iconActive: "/icons/overviewlearningungu.png" },
];

export default function DashboardTopBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="bg-white border-b border-[#ECECEC] px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
      {/* Search bar */}
      <div className="flex items-center gap-2 bg-[#F7F7FB] rounded-full px-4 py-2.5 flex-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" placeholder="Find past interviews, resources, or tips..."
          className="bg-transparent outline-none text-[14px] text-[#999] w-full" style={{ fontFamily }} />
      </div>

      <div className="flex items-center gap-3 ml-4">

        {/* Avatar */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((p) => !p)}
            className="flex items-center gap-2 hover:bg-[#F7F7FB] rounded-full px-2 py-1 transition"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#E5E5E5] flex-shrink-0">
              {user?.profileImage
                ? <img src={user.profileImage} alt="avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-gradient-to-br from-[#7B4DFF] to-[#C7B5FF] flex items-center justify-center text-white text-[14px] font-bold">
                    {user?.username?.[0]?.toUpperCase() || "A"}
                  </div>
              }
            </div>
            <span className="text-[15px] font-semibold text-[#1E1E1E] hidden sm:block" style={{ fontFamily }}>
              {user?.username?.split(" ")[0] || "Angel"}
            </span>
            {/* Chevron */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"
              className={`transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[220px] bg-white rounded-[18px] shadow-xl border border-[#ECECEC] overflow-hidden z-50"
              style={{ fontFamily }}>

              {/* User info */}
              <div className="px-4 py-4 border-b border-[#F0F0F0]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    {user?.profileImage
                      ? <img src={user.profileImage} alt="avatar" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gradient-to-br from-[#7B4DFF] to-[#C7B5FF] flex items-center justify-center text-white text-[13px] font-bold">
                          {user?.username?.[0]?.toUpperCase() || "A"}
                        </div>
                    }
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1E1E1E]">{user?.username || "Angel"}</p>
                    <p className="text-[11px] text-[#999]">{user?.email || ""}</p>
                  </div>
                </div>
              </div>

              {/* Overview links */}
              <div className="px-2 py-2 border-b border-[#F0F0F0]">
                <p className="text-[10px] font-bold text-[#BBBBBB] tracking-widest px-2 py-1">OVERVIEW</p>
                {overviewLinks.map(({ label, path, icon, iconActive }) => {
                  const isActive = pathname === path;
                  return (
                    <button key={path} onClick={() => { navigate(path); setShowDropdown(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition text-left ${isActive ? "bg-[#EDE9FF]" : "hover:bg-[#F5F2FF]"}`}>
                      <img src={isActive ? iconActive : icon} alt={label} className="w-4 h-4 object-contain" />
                      <span className={`text-[13px] font-medium ${isActive ? "text-[#7B4DFF] font-semibold" : "text-[#444]"}`}>{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Settings links */}
              <div className="px-2 py-2">
                <p className="text-[10px] font-bold text-[#BBBBBB] tracking-widest px-2 py-1">SETTINGS</p>
                <button onClick={() => { navigate("/profile"); setShowDropdown(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-[#F5F2FF] transition text-left">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span className="text-[13px] font-medium text-[#444]">Profile Saya</span>
                </button>
                <button onClick={() => { logout(); setShowDropdown(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-red-50 transition text-left">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  <span className="text-[13px] font-medium text-red-500">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
