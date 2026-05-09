import React from "react";
import { Star, Quote } from "lucide-react";

export default function TestimonialCard({ rating, review, name, role }) {
  return (
    <div
      className="
        bg-white
        rounded-[28px]
        border
        border-[#E9E9E9]
        shadow-sm
        p-6
        md:p-8
        h-full
        w-full
        flex
        flex-col
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        {/* Stars */}
        <div className="flex items-center gap-1">
          {[...Array(rating)].map((_, index) => (
            <Star
              key={index}
              className="w-6 h-6 fill-[#F4C542] text-[#F4C542]"
            />
          ))}
        </div>

        {/* Quote */}
        <Quote className="w-10 h-10 text-[#BDBDBD]" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-between">
        {/* Review */}
        <p className="text-[18px] md:text-[22px] leading-relaxed text-[#222222]">
          "{review}"
        </p>

        {/* Footer */}
        <div className="mt-8">
          <h3 className="font-bold text-[24px] text-black">{name}</h3>

          <p className="text-[20px] text-[#333333] mt-1">{role}</p>
        </div>
      </div>
    </div>
  );
}
