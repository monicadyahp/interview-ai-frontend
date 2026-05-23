import React from "react";
import { Star } from "lucide-react";

export default function TestimonialCard({ rating, review, name, role }) {
  return (
    <div
      className="
        bg-white rounded-[28px] border border-[#E9E9E9]
        shadow-sm p-6 md:p-8 h-full w-full flex flex-col
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        {/* Stars */}
        <div className="flex items-center gap-1">
          {[...Array(rating)].map((_, index) => (
            <Star key={index} className="w-5 h-5 fill-[#F4C542] text-[#F4C542]" />
          ))}
        </div>

        {/* FIX: icon digedein dari w-8 h-8 → w-10 h-10, ikutin ukuran icon lain */}
        <img
          src="/icons/saying.png"
          alt="quote"
          className="w-10 h-10 object-contain opacity-60"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-between">
        {/* Review — FIX: text-[15px] md:text-[16px] */}
        <p className="text-[15px] md:text-[16px] leading-relaxed text-[#222222]">
          "{review}"
        </p>

        {/* Footer */}
        <div className="mt-6">
          {/* FIX: name text-[16px] md:text-[17px] */}
          <h3 className="font-bold text-[16px] md:text-[17px] text-black">{name}</h3>
          {/* FIX: role text-[14px] md:text-[15px] */}
          <p className="text-[14px] md:text-[15px] text-[#333333] mt-1">{role}</p>
        </div>
      </div>
    </div>
  );
}
