import React from "react";

const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function FooterBottom() {
  return (
    <div
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8"
      style={ff}
    >
      {/* FIX: copyright */}
      <p className="text-[16px] text-[#666666] leading-relaxed max-w-3xl">
        © 2026 Intersight | Developed by CC26-PSU188 Team{" "}
        <br className="hidden sm:block" />
        Coding Camp 2026 powered by DBS Foundation.
      </p>

      <div className="flex items-center gap-4">
        <a href="#" className="text-[16px] text-[#666666] hover:text-black transition-colors">Terms</a>
        <span className="text-[#999999] text-[16px]">|</span>
        <a href="#" className="text-[16px] text-[#666666] hover:text-black transition-colors">Rules</a>
      </div>
    </div>
  );
}
