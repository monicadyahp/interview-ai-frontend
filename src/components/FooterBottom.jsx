import React from "react";
import { useNavigate } from "react-router-dom";

const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function FooterBottom() {
  const navigate = useNavigate();

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
        <button
          onClick={() => navigate("/terms")}
          className="text-[13px] text-[#999] hover:text-[#8039FF] transition-colors"
        >
          Terms
        </button>
        <span className="text-[#ccc]">|</span>
        <button
          onClick={() => navigate("/terms?tab=rules")}
          className="text-[13px] text-[#999] hover:text-[#8039FF] transition-colors"
        >
          Rules
        </button>
      </div>
    </div>
  );
}
