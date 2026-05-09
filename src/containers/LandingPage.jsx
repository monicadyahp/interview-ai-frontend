import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../section/HeroSection";
import { Everything } from "../section/Everything";
import HowItWorks from "../section/HowItWorks";
import Testimonials from "../section/Testimonials";
import CTASection from "../section/CTASection";
import FAQSection from "../section/FAQSection";

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  // 1. Tambahkan state untuk mengecek login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dailyTip, setDailyTip] = useState("");

  useEffect(() => {
    const tips = [
      "Gunakan metode STAR (Situation, Task, Action, Result) saat menjawab pertanyaan.",
      "Kontak mata yang stabil mencerminkan kepercayaan diri yang tinggi.",
      "Siapkan minimal dua pertanyaan berbobot untuk diajukan ke pewawancara.",
      "Bicara dengan tempo yang tenang agar poin jawabanmu tersampaikan jelas.",
      "Tunjukkan antusiasme lewat ekspresi wajah yang ramah dan positif.",
    ];
    setDailyTip(tips[Math.floor(Math.random() * tips.length)]);

    // 2. Cek status login dari localStorage (atau cookies/context)
    const token = localStorage.getItem("token"); // Sesuaikan dengan key tokenmu
    if (token) {
      setIsLoggedIn(true);
    }

    // --- TAMBAHKAN LOGIKA SCROLL REVEAL DI SINI ---
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.1 },
    ); // Muncul saat 10% elemen terlihat

    document
      .querySelectorAll(".reveal-scroll")
      .forEach((el) => observer.observe(el));

    // Simulasi loading aset
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader-content">
          <h1 className="loader-logo">
            Interview<span> AI</span>
          </h1>
          <div className="loader-bar"></div>
          <p>Menyiapkan pengalaman interview terbaikmu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* CSS KHUSUS ANIMASI FADE-IN */}
      <style>{`
                    .reveal-scroll {
                        opacity: 0;
                        transform: translateY(30px);
                        transition: all 0.8s ease-out;
                    }
                    .reveal-visible {
                        opacity: 1;
                        transform: translateY(0);
                    }
            `}</style>
      <HeroSection />
      <Everything />
      <HowItWorks />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </>
  );
};

export default LandingPage;
