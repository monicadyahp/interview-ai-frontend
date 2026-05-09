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
        bg-white
        border
        border-[#E8E8E8]
        rounded-[28px]
        shadow-sm
        overflow-hidden
        p-6
        md:p-8
        transition-all
        duration-300
        hover:shadow-md
        h-full
      "
    >
      <div
        className={`
          flex
          flex-col
          flex-1
          h-full
          ${
            large
              ? "lg:flex-row lg:items-stretch lg:justify-between"
              : "justify-between"
          }
          gap-8
        `}
      >
        {/* Content */}
        <div
          className={`
            flex
            flex-col
            ${large ? "lg:max-w-[420px] justify-center" : "flex-1"}
          `}
        >
          {/* Badge */}
          <div className="inline-flex w-fit items-center justify-center px-5 py-2 rounded-full border border-[#5A5DFF] text-[#3F46FF] text-[18px] font-medium mb-6">
            {step}
          </div>

          {/* Title */}
          <h2 className="text-[28px] md:text-[40px] font-bold leading-tight text-black">
            {title}
          </h2>

          {/* Description */}
          <p className="mt-4 text-[18px] md:text-[24px] leading-relaxed text-[#333333]">
            {description}
          </p>
        </div>

        {/* Image */}
        <div
          className={`
            bg-[#D9D9D9]
            rounded-xl
            w-full
            overflow-hidden
            ${
              large
                ? "lg:max-w-[620px] h-[220px] md:h-[320px]"
                : "h-[220px] md:h-[280px]"
            }
          `}
        >
          {image && (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}
