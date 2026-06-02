import React from "react";

const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function FooterBottom() {
  return (
    <div
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pt-5"
      style={ff}
    >
      <p className="text-[13px] text-[#999] leading-relaxed">
        © 2026 Intersight | Developed by CC26-PSU188 Team{" "}
        <br className="hidden sm:block" />
        Coding Camp 2026 powered by DBS Foundation.
      </p>

      <div className="flex items-center gap-3">
        <a href="#" className="text-[13px] text-[#999] hover:text-black transition-colors">
          Terms
        </a>
        <span className="text-[#ccc]">|</span>
        <a href="#" className="text-[13px] text-[#999] hover:text-black transition-colors">
          Rules
        </a>
      </div>
    </div>
  );
}
