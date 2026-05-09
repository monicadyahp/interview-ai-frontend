import React from "react";

export default function Card({ icon, subject, description }) {
  return (
    <div
      className="
        bg-white
        rounded-3xl
        border border-[#E9E9E9]
        shadow-sm
        p-6
        transition-all
        duration-300
        hover:shadow-md
        hover:-translate-y-1
        h-full
      "
    >
      <div className="flex flex-col gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-[#F6EAFE] flex items-center justify-center">
          <img
            src={icon}
            alt={`icon ${subject}`}
            className="w-[32px] h-[32px] object-contain"
          />
        </div>

        {/* Title */}
        <h3 className="text-[20px] md:text-[24px] font-bold text-[#111111] leading-snug">
          {subject}
        </h3>

        {/* Description */}
        <p className="text-[15px] md:text-[17px] text-[#4B4B4B] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
