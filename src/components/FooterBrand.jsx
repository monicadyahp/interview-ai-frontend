import React from "react";
import { Instagram } from "lucide-react";

const socialLinks = [
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    bg: "radial-gradient(circle at 30% 107%, #FDF497 0%, #FDF497 5%, #FD5949 45%, #D6249F 60%, #285AEB 90%)",
    icon: <Instagram className="text-white w-5 h-5" />,
  },
  {
    href: "https://www.facebook.com/",
    label: "Facebook",
    bg: "#1877F2",
    icon: <img src="/icons/facebook.png" className="w-4" alt="Facebook" />,
  },
  {
    href: "https://www.linkedin.com/",
    label: "LinkedIn",
    bg: "#0A66C2",
    icon: <img src="/icons/linkedin.png" className="w-5" alt="LinkedIn" />,
  },
  {
    href: "https://www.youtube.com/",
    label: "YouTube",
    bg: "#FF0000",
    icon: <img src="/icons/youtube.png" className="w-5" alt="YouTube" />,
  },
  {
    href: "https://discord.com/",
    label: "Discord",
    bg: "#5865F2",
    icon: <img src="/icons/discord.png" className="w-5" alt="Discord" />,
  },
];

export default function FooterBrand() {
  return (
    <div
      className="flex flex-col gap-5 w-full max-w-[320px]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#E5E5E5]">
        <img
          src="/logo/Icon_Insight.png"
          alt="Logo Insight"
          className="w-9 h-9 object-contain"
        />
        <h1 className="font-bold fontIntersight text-[24px] leading-tight tracking-wide">
          Intersight
        </h1>
      </div>

      {/* Social Media */}
      <div className="flex items-center gap-3">
        {socialLinks.map(({ href, label, bg, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300"
            style={{ background: bg }}
          >
            {icon}
          </a>
        ))}
      </div>
    </div>
  );
}
