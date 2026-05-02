import React from "react";
import { FaArrowCircleRight } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="relative mx-auto overflow-hidden w-[92%] h-[760px] md:w-[95%] md:w-[90%] lg:w-[90%] md:h-[980px] top-[23px] lg:h-[1020px] rounded-[30px] md:rounded-[40px] bg-[#F8F8FF] shadow-[0_10px_40px_rgba(140,94,173,0.08)]">
      {/* Background Layer - Diperbaiki agar tidak berantakan */}
      <div
        className="absolute top-0 z-0 opacity-80"
        style={{
          width: "110%",
          height: "110%",
          backgroundImage: "url('/hero/Rectangle.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* Content Wrapper - Hapus padding bottom agar image bisa nempel ke bawah */}
      <div className="relative z-10 flex flex-col items-center pt-30 md:pt-40 lg:pt-50 px-4 md:px-8 pb-0">
        {/* Heading */}
        <h1 className="font-extrabold text-center text-black text-[30px] sm:text-[40px] md:text-[46px] lg:text-[54px] leading-[1.15] max-w-[950px] mb-5 md:mb-6 tracking-tight">
          Master the Art of the First Impression: Where AI Meets Career
          Readiness
        </h1>

        {/* Subtitle */}
        <p className="font-medium text-center text-black text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-[1.6] max-w-[760px] mb-8 md:mb-10">
          Stop letting interview anxiety overshadow your potential. Inter-SIGHT
          leverages advanced real-time emotion recognition and AI-driven
          insights to transform your nervous energy into a professional,
          high-impact performance.
        </p>

        {/* CTA Button */}
        <button className="group relative overflow-hidden bg-[#8039FF] hover:to-[#573573] transition-all duration-300 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] h-[55px] md:h-[70px] rounded-full flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(140,94,173,0.3)] hover:shadow-[0_20px_40px_rgba(140,94,173,0.4)] hover:-translate-y-1 mb-8 md:mb-12">
          <span className="text-white font-bold text-[16px] md:text-[22px]">
            Start Free Simulation
          </span>
          <FaArrowCircleRight className="w-5 h-5 md:w-7 md:h-7 text-white group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Mockup Image - Memastikan nempel ke bawah dengan line-height 0 dan block */}
        <div
          className="w-full max-w-[780px] md:max-w-[640px] lg:max-w-[795px] mx-auto flex justify-center mt-auto"
          style={{ fontSize: 0, lineHeight: 0 }}
        >
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
