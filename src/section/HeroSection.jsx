import React from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative mx-auto overflow-hidden w-[92%] lg:w-[90%] md:h-[980px] top-[23px] lg:h-[1020px] rounded-[30px] md:rounded-[40px] bg-[#F8F8FF] shadow-[0_10px_40px_rgba(140,94,173,0.08)]">
      {/* Background */}
      <div
        className="absolute top-0 z-0 opacity-80"
        style={{
          left: "-5%", width: "110%", height: "110%",
          backgroundImage: "url('/hero/Rectangle.png')",
          backgroundSize: "110% 110%",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-30 md:pt-40 lg:pt-50 px-6 md:px-8 pb-0">

        {/* FIX: heading 2 baris, abis titik dua langsung ke bawah */}
        <h1
          className="font-extrabold text-center text-black text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] leading-[1.15] max-w-[900px] mb-5 tracking-tight"
          style={ff}
        >
          Master the Art of the First Impression:<br />
          Where AI Meets Career Readiness
        </h1>

        <p
          className="font-medium text-center text-black text-[15px] md:text-[17px] lg:text-[19px] leading-[1.6] max-w-[720px] mb-8 md:mb-10"
          style={ff}
        >
          Stop letting interview anxiety overshadow your potential. Intersight
          leverages advanced real-time emotion recognition and AI-driven
          insights to transform your nervous energy into a professional,
          high-impact performance.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="group relative overflow-hidden bg-[#8039FF] transition-all duration-300 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] h-[52px] md:h-[64px] rounded-full flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(140,94,173,0.3)] hover:shadow-[0_20px_40px_rgba(140,94,173,0.4)] hover:-translate-y-1 mb-8 md:mb-12"
        >
          <span className="text-white font-bold text-[16px] md:text-[20px]" style={ff}>
            Start Free Simulation
          </span>
          <FaArrowCircleRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="w-full max-w-[780px] md:max-w-[640px] lg:max-w-[795px] mx-auto flex justify-center mt-auto" style={{ fontSize: 0, lineHeight: 0 }}>
          <img
            src="/hero/Interview.png"
            alt="Interview Simulation App"
            className="w-full h-auto object-contain object-bottom align-bottom md:drop-shadow-[0_-10px_30px_rgba(140,94,173,0.15)]"
            style={{ display: "block", marginBottom: "120px" }}
          />
        </div>
      </div>
    </section>
  );
}
