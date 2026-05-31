import React from "react";
const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
export default function Card({ icon, subject, description }) {
  return (
    <div className="bg-white rounded-3xl border border-[#E9E9E9] shadow-sm p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 h-full" style={ff}>
      <div className="flex flex-col gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#F6EAFE] flex items-center justify-center">
          <img src={icon} alt={`icon ${subject}`} className="w-[28px] h-[28px] object-contain" />
        </div>
        {/* text-[18px] md:text-[20px] */}
        <h3 className="text-[18px] md:text-[20px] font-bold text-[#111111] leading-snug" style={ff}>{subject}</h3>
        {/* text-[15px] md:text-[16px] */}
        <p className="text-[15px] md:text-[16px] text-[#4B4B4B] leading-relaxed" style={ff}>{description}</p>
      </div>
    </div>
  );
}
