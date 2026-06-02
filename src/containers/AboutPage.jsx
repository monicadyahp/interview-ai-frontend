import React, { useState } from "react";

const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

const LEARNING_PATHS = [
  {
    id: "ds",
    label: "Data Science",
    emoji: "📊",
    color: "#8039FF",
    bg: "linear-gradient(135deg, #f3eeff 0%, #ede4ff 100%)",
    border: "#c9b0f5",
    badgeBg: "linear-gradient(90deg, #8039FF, #a855f7)",
    members: [
      {
        name: "Monica Dyah Pudyowati",
        credential: "CDCC254D6X1534",
        university: "Universitas Mercu Buana",
        linkedin: "https://www.linkedin.com/in/monica-dyah-pudyowati/",
        photo: "/profile/monica.png",
      },
      {
        name: "Via Angelya",
        credential: "CDCC009D6X1931",
        university: "Universitas Gunadarma",
        linkedin: "https://www.linkedin.com/in/viaangelya/",
        photo: "/profile/angel.png",
      },
    ],
  },
  {
    id: "fwd",
    label: "Full-Stack Web Developer",
    emoji: "💻",
    color: "#0A66C2",
    bg: "linear-gradient(135deg, #e8f1fb 0%, #dbeafe 100%)",
    border: "#93c5fd",
    badgeBg: "linear-gradient(90deg, #0A66C2, #3b82f6)",
    members: [
      {
        name: "Syasmi Permata Oktavia",
        credential: "CFCC009D6X2797",
        university: "Universitas Gunadarma",
        linkedin: "https://www.linkedin.com/in/syasmi-permata-oktavia/",
        photo: "/profile/syasmi.png",
      },
      {
        name: "Prasetyo Dio",
        credential: "CFCC290D6Y1707",
        university: "Universitas Pancasila",
        linkedin: "https://www.linkedin.com/in/dio-prasetyo-72268b340/",
        photo: "/profile/dio.png",
      },
    ],
  },
  {
    id: "ai",
    label: "AI Engineer",
    emoji: "🤖",
    color: "#fe63c8",
    bg: "linear-gradient(135deg, #fff0f9 0%, #fce7f3 100%)",
    border: "#f9a8d4",
    badgeBg: "linear-gradient(90deg, #fe63c8, #f5a159)",
    members: [
      {
        name: "Zahwa Annisa Hendajani",
        credential: "CACC009D6X2184",
        university: "Universitas Gunadarma",
        linkedin: "https://www.linkedin.com/in/zahwannisa44/",
        photo: "/profile/zahwa.png",
      },
      {
        name: "Aqilla Zeba Fakhira",
        credential: "CACC009D6X2486",
        university: "Universitas Gunadarma",
        linkedin: "https://www.linkedin.com/in/aqilla-fakhira-873269284/?locale=en",
        photo: "/profile/aqilla.png",
      },
    ],
  },
];

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MemberCard({ member, pathColor, badgeBg, pathEmoji }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-[#f0ebfa]"
      style={ff}
    >
      {/* Photo */}
      <div className="relative mb-4">
        <div
          className="w-24 h-24 rounded-full overflow-hidden border-[3px] shadow-md"
          style={{ borderColor: pathColor }}
        >
          {!imgError ? (
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ background: badgeBg }}
            >
              {member.name.charAt(0)}
            </div>
          )}
        </div>
        {/* emoji badge */}
        <div
          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-sm shadow"
          style={{ background: badgeBg }}
        >
          {pathEmoji}
        </div>
      </div>

      {/* Name */}
      <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-1 leading-tight">
        {member.name}
      </h3>

      {/* University */}
      <p className="text-[12px] text-[#888] mb-3">{member.university}</p>

      {/* Credential */}
      <div
        className="text-[11px] font-mono px-3 py-1 rounded-full mb-4 font-semibold"
        style={{
          background: "linear-gradient(90deg, #f3eeff, #ede4ff)",
          color: "#8039FF",
          border: "1px solid #d4b8ff",
        }}
      >
        {member.credential}
      </div>

      {/* LinkedIn button */}
      <a
        href={member.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-[12px] font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200"
        style={{ background: badgeBg }}
      >
        <LinkedInIcon />
        LinkedIn
      </a>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div
      className="min-h-screen w-full bg-[#faf9ff] px-4 py-20"
      style={ff}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold tracking-widest uppercase text-[#fe63c8] mb-3">
            CC26-PSU188 · Coding Camp 2026
          </p>
          <h1
            className="text-[36px] md:text-[48px] font-bold mb-4 leading-tight"
            style={{
              background: "linear-gradient(90deg, #071097, #fe63c8, #f5a159, #8039ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Tentang Kami
          </h1>
          <p className="text-[#888] text-[15px] max-w-xl mx-auto leading-relaxed">
            Tim pengembang Intersight — 6 mahasiswa dari berbagai universitas yang
            berkolaborasi membangun platform AI interview terbaik untuk Indonesia.
          </p>

          {/* DBS badge */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white border border-[#e5e7eb] rounded-full px-5 py-2 shadow-sm">
            <span className="text-[13px] text-[#666]">Supported by</span>
            <span className="text-[13px] font-bold text-[#8039FF]">DBS Foundation</span>
            <span className="text-[#ccc]">·</span>
            <span className="text-[13px] text-[#666]">Coding Camp 2026</span>
          </div>
        </div>

        {/* Learning Path Sections */}
        <div className="flex flex-col gap-14">
          {LEARNING_PATHS.map((path) => (
            <div key={path.id}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
                  style={{ background: path.bg, border: `1px solid ${path.border}` }}
                >
                  {path.emoji}
                </div>
                <div>
                  <p className="text-[11px] text-[#aaa] uppercase tracking-widest font-semibold">
                    Learning Path
                  </p>
                  <h2 className="text-[18px] font-bold" style={{ color: path.color }}>
                    {path.label}
                  </h2>
                </div>
                {/* divider line */}
                <div
                  className="flex-1 h-px ml-2"
                  style={{
                    background: `linear-gradient(90deg, ${path.border}, transparent)`,
                  }}
                />
              </div>

              {/* Member cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
                {path.members.map((member) => (
                  <MemberCard
                    key={member.credential}
                    member={member}
                    pathColor={path.color}
                    badgeBg={path.badgeBg}
                    pathEmoji={path.emoji}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-16 text-center">
          <p className="text-[13px] text-[#bbb]">
            Ada yang ingin kamu tanyakan?{" "}
            <a href="/contact" className="text-[#8039FF] hover:underline">
              Hubungi kami
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
