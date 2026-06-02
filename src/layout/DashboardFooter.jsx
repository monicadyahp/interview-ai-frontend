import React, { useContext } from "react";
import { Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

const socialLinks = [
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    bg: "radial-gradient(circle at 30% 107%, #FDF497 0%, #FDF497 5%, #FD5949 45%, #D6249F 60%, #285AEB 90%)",
    icon: <Instagram className="text-white w-4 h-4" />,
  },
  {
    href: "https://www.facebook.com/",
    label: "Facebook",
    bg: "#1877F2",
    icon: <img src="/icons/facebook.png" className="w-4" alt="Facebook" />,
  },
  {
    href: "https://www.linkedin.com/",
    label: "LinkedIn",
    bg: "#0A66C2",
    icon: <img src="/icons/linkedin.png" className="w-4" alt="LinkedIn" />,
  },
  {
    href: "https://www.youtube.com/",
    label: "YouTube",
    bg: "#FF0000",
    icon: <img src="/icons/youtube.png" className="w-4" alt="YouTube" />,
  },
  {
    href: "https://discord.com/",
    label: "Discord",
    bg: "#5865F2",
    icon: <img src="/icons/discord.png" className="w-4" alt="Discord" />,
  },
];

export default function DashboardFooter() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const leftLinks = [
    { label: "Project Kami", action: () => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); } },
    { label: "Tentang Kami", action: () => navigate("/about") },
    { label: "Hubungi Kami", action: () => navigate("/contact") },
  ];

  const rightLinks = [
    {
      label: "Interview AI",
      action: () => user ? navigate("/interview") : navigate("/login"),
    },
    {
      label: "Smart Dashboard",
      action: () => window.open("https://interview-ai-dashboard-su7byt4utngvkc3yqvtifr.streamlit.app/", "_blank", "noopener,noreferrer"),
    },
    {
      label: "Chatbot",
      action: () => user ? navigate("/chatbot") : navigate("/login"),
    },
  ];

  const linkClass = "text-[14px] text-[#666] hover:text-black transition-colors cursor-pointer text-left";

  return (
    <footer className="w-full bg-white border-t border-[#ECECEC] px-6 md:px-10 pt-10 pb-6 mt-6" style={ff}>
      <div className="max-w-full">
        {/* Top */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 pb-8 border-b border-[#E5E5E5]">

          {/* Brand */}
          <div className="flex flex-col gap-5 w-full max-w-[320px]">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E5E5E5]">
              <img src="/logo/Icon_Insight.png" alt="Logo" className="w-9 h-9 object-contain" />
              <h1 className="font-bold fontIntersight text-[24px] leading-tight tracking-wide">Intersight</h1>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, label, bg, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all"
                  style={{ background: bg }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-12 md:gap-20">
            <ul className="flex flex-col gap-2.5">
              {leftLinks.map(({ label, action }) => (
                <li key={label}>
                  <button onClick={action} className={linkClass}>{label}</button>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-2.5">
              {rightLinks.map(({ label, action }) => (
                <li key={label}>
                  <button onClick={action} className={linkClass}>{label}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pt-5">
          <p className="text-[13px] text-[#999] leading-relaxed">
            © 2026 Intersight | Developed by CC26-PSU188 Team<br className="hidden sm:block" />
            Coding Camp 2026 powered by DBS Foundation.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="text-[13px] text-[#999] hover:text-black transition-colors">Terms</a>
            <span className="text-[#ccc]">|</span>
            <a href="#" className="text-[13px] text-[#999] hover:text-black transition-colors">Rules</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
