import React from "react";

export default function Card({ icon, subject, description }) {
  return (
    <div
      className="
        bg-white rounded-3xl border border-[#E9E9E9] shadow-sm p-6
        transition-all duration-300 hover:shadow-md hover:-translate-y-1 h-full
      "
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="flex flex-col gap-4">
        {/* Icon */}
        <div className="w-11 h-11 rounded-xl bg-[#F6EAFE] flex items-center justify-center">
          <img
            src={icon}
            alt={`icon ${subject}`}
            className="w-[28px] h-[28px] object-contain"
          />
        </div>

        {/* Title — FIX: dari text-[20px] md:text-[24px] → text-[17px] md:text-[20px] */}
        <h3
          className="text-[17px] md:text-[20px] font-bold text-[#111111] leading-snug"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {subject}
        </h3>

        {/* Description — FIX: dari text-[15px] md:text-[17px] → text-[14px] md:text-[15px] */}
        <p
          className="text-[14px] md:text-[15px] text-[#4B4B4B] leading-relaxed"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
