import React from "react";
import { Instagram } from "lucide-react";

const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

const projectLinks = ["Project Kami", "Tentang Kami", "Hubungi Kami", "Blog", "FAQ"];
const productLinks = ["Interview AI", "Smart Dashboard", "Chat Bot"];

export default function DashboardFooter() {
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
            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-[radial-gradient(circle_at_30%_107%,#FDF497_0%,#FDF497_5%,#FD5949_45%,#D6249F_60%,#285AEB_90%)] flex items-center justify-center hover:scale-110 transition-all">
                <Instagram className="text-white w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-all">
                <img src="/icons/facebook.png" className="w-4" alt="fb" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#0A66C2] flex items-center justify-center hover:scale-110 transition-all">
                <img src="/icons/linkedin.png" className="w-4" alt="li" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#FF0000] flex items-center justify-center hover:scale-110 transition-all">
                <img src="/icons/youtube.png" className="w-4" alt="yt" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#5865F2] flex items-center justify-center hover:scale-110 transition-all">
                <img src="/icons/discord.png" className="w-4" alt="dc" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-12 md:gap-20">
            <ul className="flex flex-col gap-2.5">
              {projectLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-[14px] text-[#666] hover:text-black transition-colors">{item}</a>
                </li>
              ))}
            </ul>
            <div>
              <p className="text-[14px] text-[#666] pb-2.5">Product</p>
              <ul className="flex flex-col gap-2.5">
                {productLinks.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[14px] text-[#666] hover:text-black transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
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
