import React from "react";
import { Instagram } from "lucide-react";

export default function FooterBrand() {
  return (
    <div
      className="flex flex-col gap-7 w-full max-w-[520px]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Logo + Border */}
      <div className="w-full border-b border-[#E5E5E5] pb-5">
        <div className="flex items-center gap-3">
          <img
            src="/logo/Icon_Insight.png"
            alt="Logo Insight"
            className="w-10 h-10 object-contain"
          />
          {/* FIX: font size logo dari text-[44px] → text-[28px] */}
          <h1
            className="
              font-bold fontIntersight
              text-[28px]
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

      {/* Social Media — FIX: ikon dari w-14 h-14 → w-10 h-10, rounded-xl → rounded-full */}
      <div className="flex items-center gap-4">
        {/* Instagram */}
        <a
          href="#"
          className="
            w-10 h-10 rounded-full
            bg-[radial-gradient(circle_at_30%_107%,#FDF497_0%,#FDF497_5%,#FD5949_45%,#D6249F_60%,#285AEB_90%)]
            flex items-center justify-center
            hover:scale-110 transition-all duration-300
          "
        >
          <Instagram className="text-white w-5 h-5" />
        </a>

        {/* Facebook */}
        <a
          href="#"
          className="
            w-10 h-10 rounded-full
            bg-[#1877F2]
            flex items-center justify-center
            hover:scale-110 transition-all duration-300
          "
        >
          <img src="/icons/facebook.png" className="w-4" />
        </a>

        {/* LinkedIn */}
        <a
          href="#"
          className="
            w-10 h-10 rounded-full
            bg-[#0A66C2]
            flex items-center justify-center
            hover:scale-110 transition-all duration-300
          "
        >
          <img src="/icons/linkedin.png" className="w-5" />
        </a>

        {/* YouTube */}
        <a
          href="#"
          className="
            w-10 h-10 rounded-full
            bg-[#FF0000]
            flex items-center justify-center
            hover:scale-110 transition-all duration-300
          "
        >
          <img src="/icons/youtube.png" className="w-5" />
        </a>

        {/* Discord */}
        <a
          href="#"
          className="
            w-10 h-10 rounded-full
            bg-[#5865F2]
            flex items-center justify-center
            hover:scale-110 transition-all duration-300
          "
        >
          <img src="/icons/discord.png" className="w-5" />
        </a>
      </div>
    </div>
  );
}
