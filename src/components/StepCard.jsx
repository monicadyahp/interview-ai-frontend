import React from "react";

export default function StepCard({
  step,
  title,
  description,
  image,
  large = false,
}) {
  return (
    <div
      className="
        bg-white border border-[#E8E8E8] rounded-[28px] shadow-sm
        overflow-hidden p-6 md:p-8 transition-all duration-300
        hover:shadow-md h-full
      "
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div
        className={`
          flex flex-col flex-1 h-full gap-8
          ${large ? "lg:flex-row lg:items-stretch lg:justify-between" : "justify-between"}
        `}
      >
        {/* Content */}
        <div className={`flex flex-col ${large ? "lg:max-w-[420px] justify-center" : "flex-1"}`}>

          {/* Badge — FIX: text-[14px] */}
          <div className="inline-flex w-fit items-center justify-center px-4 py-1.5 rounded-full border border-[#5A5DFF] text-[#3F46FF] text-[14px] font-medium mb-5">
            {step}
          </div>

          {/* Title — FIX: dari text-[28px] md:text-[40px] → text-[22px] md:text-[28px] */}
          <h2 className="text-[22px] md:text-[28px] font-bold leading-tight text-black"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {title}
          </h2>

          {/* Description — FIX: dari text-[18px] md:text-[24px] → text-[15px] md:text-[17px] */}
          <p className="mt-3 text-[15px] md:text-[17px] leading-relaxed text-[#333333]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {description}
          </p>
        </div>

        {/* Image */}
        <div
          className={`
            bg-[#D9D9D9] rounded-xl w-full overflow-hidden
            ${large ? "lg:max-w-[620px] h-[220px] md:h-[320px]" : "h-[220px] md:h-[280px]"}
          `}
        >
          {image && (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          )}
        </div>
      </div>
    </div>
  );
}
