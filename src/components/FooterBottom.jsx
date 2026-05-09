import React from "react";

export default function FooterBottom() {
  return (
    <div
      className="
        flex
        flex-col
        md:flex-row
        justify-between
        items-start
        md:items-center
        gap-6
        pt-10
      "
    >
      {/* Copyright */}
      <p
        className="
          text-[18px]
          md:text-[20px]
          text-[#666666]
          leading-relaxed
          max-w-3xl
        "
      >
        © 2026 Intersight | Developed by CC26-PSU188 Team - Coding Camp 2026
        powered by DBS Foundation.
      </p>

      {/* Terms */}
      <div className="flex items-center gap-4">
        <a
          href="#"
          className="
            text-[18px]
            md:text-[20px]
            text-[#666666]
            hover:text-black
            transition-colors
          "
        >
          Terms
        </a>

        <span className="text-[#999999]">|</span>

        <a
          href="#"
          className="
            text-[18px]
            md:text-[20px]
            text-[#666666]
            hover:text-black
            transition-colors
          "
        >
          Rules
        </a>
      </div>
    </div>
  );
}
