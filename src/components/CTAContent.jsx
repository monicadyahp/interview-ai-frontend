import React from "react";
import { useNavigate } from "react-router-dom";

export default function CTAContent() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 max-w-[520px]">
      {/* Label */}
      <p
        className="text-[14px] md:text-[15px] font-semibold text-[#555555]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Ready to turn your anxiety into an offer letter?
      </p>

      {/* Heading sesuai Figma */}
      <h2
        className="text-[28px] md:text-[36px] lg:text-[40px] font-extrabold text-black leading-[1.2]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Join 5,000+ Indonesian grads who are leveling up their career game
        while you're still guessing.
      </h2>

      {/* FIX: navigate ke /login?mode=signup → langsung buka Sign Up */}
      <button
        onClick={() => navigate("/login?mode=signup")}
        className="
          w-fit px-8 h-[56px] rounded-full bg-[#8039FF] text-white
          font-bold text-[16px] md:text-[18px]
          hover:opacity-90 hover:-translate-y-1 transition-all duration-300
          shadow-[0_10px_30px_rgba(128,57,255,0.3)]
          flex items-center gap-2
        "
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Launch Intersight Now 🚀
      </button>
    </div>
  );
}
