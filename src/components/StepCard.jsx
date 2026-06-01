import React from "react";
const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
export default function StepCard({ step, title, description, image, large = false }) {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-[28px] shadow-sm p-6 md:p-8 transition-all duration-300 hover:shadow-md h-full" style={ff}>
      <div className={`flex flex-col flex-1 h-full gap-8 ${large ? "lg:flex-row lg:items-center lg:justify-between" : "justify-between"}`}>
        <div className={`flex flex-col ${large ? "lg:max-w-[380px] justify-center" : "flex-1"}`}>
          <div className="inline-flex w-fit items-center justify-center px-4 py-1.5 rounded-full border border-[#5A5DFF] text-[#3F46FF] text-[14px] font-medium mb-5">{step}</div>
          <h2 className="text-[20px] md:text-[28px] font-bold leading-tight text-black" style={ff}>{title}</h2>
          <p className="mt-3 text-[16px] md:text-[20px] leading-relaxed text-[#333333]" style={ff}>{description}</p>
        </div>
        <div className={`rounded-xl w-full flex items-center justify-center ${large ? "lg:max-w-[580px]" : ""}`}>
          {image && (
            <img
              src={image}
              alt={title}
              className="w-full object-contain rounded-xl"
              style={{ height: large ? "340px" : "280px", objectFit: "contain" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
