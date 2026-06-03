import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TrustedBy from "../components/TrustedBy";
import WhyQualified from "../components/WhyQualified";
import { Everything } from "../section/Everything";
import HowItWorks from "../section/HowItWorks";
import Testimonials from "../section/Testimonials";
import CTASection from "../section/CTASection";
import FAQSection from "../section/FAQSection";
import HeroSection from "../section/HeroSection";
import Reveal from "../components/Reveal";

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
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

    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    document
      .querySelectorAll(".reveal-scroll")
      .forEach((el) => observer.observe(el));

    const timer = setTimeout(() => setIsLoading(false), 1500);
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
      <Reveal direction="up"><TrustedBy /></Reveal>
      <Reveal direction="up"><WhyQualified /></Reveal>
      <Reveal direction="up"><Everything /></Reveal>
      <Reveal direction="up"><HowItWorks /></Reveal>
      <Reveal direction="up"><Testimonials /></Reveal>
      <Reveal direction="up"><FAQSection /></Reveal>
      <Reveal direction="up"><CTASection /></Reveal>
    </>
  );
};

export default LandingPage;
