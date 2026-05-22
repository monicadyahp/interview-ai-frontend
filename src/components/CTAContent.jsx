import React from "react";
import { useNavigate } from "react-router-dom";

export default function CTAContent() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 max-w-[520px]">
      <p className="text-[14px] md:text-[15px] text-[#333] font-medium">
        Ready to turn your anxiety into an offer letter?
      </p>

      <h2 className="text-[26px] md:text-[34px] font-extrabold text-[#1a1a2e] leading-[1.2]">
        Join 5,000+ Indonesian grads who are leveling up their career game
        while you're still guessing.
      </h2>

      {/* FIX: navigate to /signup */}
      <button
        onClick={() => navigate("/signup")}
        className="
          self-start
          flex items-center gap-2
          bg-[#8039FF]
          hover:bg-[#6a2ee0]
          text-white
          font-bold
          text-[15px] md:text-[17px]
          px-7 py-4
          rounded-full
          transition-all duration-300
          shadow-[0_8px_24px_rgba(128,57,255,0.3)]
          hover:shadow-[0_12px_30px_rgba(128,57,255,0.4)]
          hover:-translate-y-0.5
        "
      >
        Launch Intersight Now 🚀
      </button>
    </div>
  );
}
