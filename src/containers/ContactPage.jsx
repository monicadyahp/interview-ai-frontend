import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const CONTACT_EMAIL = "CC26-PSU188@student.devacademy.id";

const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function ContactPage() {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: "",
  });
  const [status, setStatus] = useState(""); // "sending" | "sent" | ""

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus("sending");

    const subject = encodeURIComponent(
      `Pesan dari ${form.name} via Intersight`
    );
    const body = encodeURIComponent(
      `Nama: ${form.name}\nEmail: ${form.email}\n\nPesan:\n${form.message}`
    );

    const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    setTimeout(() => setStatus("sent"), 1000);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-20 bg-[#faf9ff]"
      style={ff}
    >
      {/* Card */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-[0_8px_40px_rgba(128,57,255,0.10)] px-8 py-10 md:px-12 md:py-12">

        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-[32px] md:text-[36px] font-bold mb-3"
            style={{
              background: "linear-gradient(90deg, #8039FF, #fe63c8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Hubungi Kami
          </h1>
          <p className="text-[#888] text-[15px] leading-relaxed">
            Ada pertanyaan atau ingin berkolaborasi?<br />
            Kirim pesan dan kami akan membalasmu!
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="block text-[13px] font-semibold text-[#8039FF] mb-1.5">
              Nama
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama lengkapmu"
              className="w-full px-4 py-3 rounded-xl border border-[#e0d4f7] bg-[#faf7ff] text-[#444] text-[14px] placeholder:text-[#bbb] focus:outline-none focus:border-[#8039FF] focus:ring-2 focus:ring-[#8039FF]/20 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[13px] font-semibold text-[#8039FF] mb-1.5">
              Email Kamu
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="kamu@email.com"
              className="w-full px-4 py-3 rounded-xl border border-[#e0d4f7] bg-[#faf7ff] text-[#444] text-[14px] placeholder:text-[#bbb] focus:outline-none focus:border-[#8039FF] focus:ring-2 focus:ring-[#8039FF]/20 transition"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-[13px] font-semibold text-[#8039FF] mb-1.5">
              Pesan
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tulis pesanmu di sini..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-[#e0d4f7] bg-[#faf7ff] text-[#444] text-[14px] placeholder:text-[#bbb] focus:outline-none focus:border-[#8039FF] focus:ring-2 focus:ring-[#8039FF]/20 transition resize-none"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!form.name || !form.email || !form.message}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-[15px] transition-all duration-300 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(90deg, #8039FF, #fe63c8)",
            }}
          >
            {status === "sending" ? "Membuka email client..." : "Kirim Pesan"}
          </button>

          {/* Status */}
          {status === "sending" && (
            <p className="text-center text-[13px] text-[#999] -mt-2 animate-pulse">
              Membuka aplikasi email kamu...
            </p>
          )}
          {status === "sent" && (
            <p className="text-center text-[13px] text-[#8039FF] -mt-2">
              ✓ Email siap dikirim lewat aplikasi emailmu!
            </p>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-[12px] text-[#bbb] mt-6">
          Pesan akan dikirim ke{" "}
          <span className="text-[#8039FF]">{CONTACT_EMAIL}</span>
        </p>
      </div>
    </div>
  );
}
