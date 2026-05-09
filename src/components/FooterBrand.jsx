import React from "react";
import { Instagram } from "lucide-react";

export default function FooterBrand() {
  return (
    <div className="flex flex-col gap-7 w-full max-w-[520px]">
      {/* Logo + Border */}
      <div className="w-full border-b border-[#E5E5E5] pb-5">
        <div
          className="
            flex items-center gap-3
            lg:gap-4
          "
        >
          <img
            src="/logo/Icon_Insight.png"
            alt="Logo Insight"
            className="
              w-14 h-14 object-contain
              lg:w-16 lg:h-16
            "
          />

          <h1
            className="
    font-bold
    fontIntersight
    text-[44px]
    leading-[1.15]
    tracking-[0.02em]
    pb-1
    overflow-visible
  "
          >
            Intersight
          </h1>
        </div>
      </div>

      {/* Social Media */}
      <div className="flex items-center gap-5">
        {/* Instagram */}
        <a
          href="#"
          className="
            w-14 h-14 rounded-xl
            bg-[radial-gradient(circle_at_30%_107%,#FDF497_0%,#FDF497_5%,#FD5949_45%,#D6249F_60%,#285AEB_90%)]
            flex items-center justify-center
            hover:scale-110 transition-all duration-300
          "
        >
          <Instagram className="text-white w-9 h-9" />
        </a>

        {/* Facebook */}
        <a
          href="#"
          className="
            w-14 h-14 rounded-xl
            bg-[#1877F2]
            flex items-center justify-center
          "
        >
          <img src="/icons/facebook.png" className="w-5" />
        </a>

        {/* LinkedIn */}
        <a
          href="#"
          className="
            w-14 h-14 rounded-xl
            bg-[#0A66C2]
            flex items-center justify-center
          "
        >
          <img src="/icons/linkedin.png" className="w-8" />
        </a>

        {/* YouTube */}
        <a
          href="#"
          className="
            w-14 h-14 rounded-xl
            bg-[#FF0000]
            flex items-center justify-center
          "
        >
          <img src="/icons/youtube.png" className="w-8" />
        </a>

        {/* Discord */}
        <a
          href="#"
          className="
            w-14 h-14 rounded-xl
            bg-[#5865F2]
            flex items-center justify-center
          "
        >
          <img src="/icons/discord.png" className="w-8" />
        </a>
      </div>
    </div>
  );
}
