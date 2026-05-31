import React from "react";
import { Star } from "lucide-react";
const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
export default function TestimonialCard({ rating, review, name, role }) {
  return (
    <div className="bg-white rounded-[28px] border border-[#E9E9E9] shadow-sm p-6 md:p-8 h-full w-full flex flex-col" style={ff}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-1">
          {[...Array(rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#F4C542] text-[#F4C542]" />)}
        </div>
        <img src="/icons/saying.png" alt="quote" className="w-10 h-10 object-contain opacity-60" />
      </div>
      <div className="flex flex-col flex-1 justify-between">
        {/* text-[16px] md:text-[20px] */}
        <p className="text-[16px] md:text-[20px] leading-relaxed text-[#222222]">"{review}"</p>
        <div className="mt-6">
          {/* text-[18px] md:text-[20px] */}
          <h3 className="font-bold text-[18px] md:text-[20px] text-black">{name}</h3>
          {/* text-[16px] md:text-[18px] */}
          <p className="text-[16px] md:text-[18px] text-[#333333] mt-1">{role}</p>
        </div>
      </div>
    </div>
  );
}
