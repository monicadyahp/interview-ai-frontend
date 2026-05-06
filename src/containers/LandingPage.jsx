import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";

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
      { threshold: 0.1 }
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

      {/* HERO */}
      <HeroSection />

      {/* DAILY TIP */}
      <div
        className="container"
        style={{
          marginTop: "-1rem",
          marginBottom: "3rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "#FDFBFF",
            padding: "12px 20px",
            borderRadius: "15px",
            border: "1px solid #F3EAFB",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            boxShadow: "0 5px 15px rgba(140, 94, 173, 0.05)",
          }}
        >
          <span
            style={{
              background: "#8C5EAD",
              color: "#FFF",
              padding: "4px 10px",
              borderRadius: "8px",
              fontSize: "0.7rem",
              fontWeight: "800",
            }}
          >
            Tips Cepat Hari Ini
          </span>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#555" }}>
            "{dailyTip}"
          </p>
        </div>
      </div>

      {/* FEATURES */}
      <section className="section container" style={{ paddingBottom: "5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 className="section__title">Mengapa Memilih Interview AI?</h2>
          <p style={{ color: "#888" }}>
            Tiga pilar utama untuk kesuksesan interview kamu.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          <div style={cardStyle}>
            <i className="bx bx-face" style={iconStyle}></i>
            <h3>Analisis Wajah</h3>
            <p>
              AI kami mendeteksi 7 emosi dasar secara real-time untuk memastikan
              aura positifmu terpancar.
            </p>
          </div>

          <div style={cardStyle}>
            <i className="bx bx-stats" style={iconStyle}></i>
            <h3>Statistik Progres</h3>
            <p>
              Pantau perkembangan latihanmu melalui grafik mingguan dan total
              sesi yang terukur.
            </p>
          </div>

          <div style={cardStyle}>
            <i className="bx bx-share-alt" style={iconStyle}></i>
            <h3>Export & Bagikan</h3>
            <p>
              Simpan hasil analisismu dan bagikan progresmu ke dunia.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section container" style={{ paddingBottom: "7rem" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #8C5EAD 0%, #6A4687 100%)",
            padding: "4rem 2rem",
            borderRadius: "40px",
            textAlign: "center",
            color: "#FFF",
          }}
        >
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            Siap Menguasai Interview Kamu?
          </h2>
          <p style={{ marginBottom: "2rem" }}>
            Mulai sekarang dan jadi kandidat terbaik.
          </p>
          <Link to="/interview" className="button">
            Mulai Sekarang
          </Link>
        </div>
      </section>
    </>
  );
};

const cardStyle = {
  background: "#FFF",
  padding: "2rem",
  borderRadius: "25px",
  textAlign: "center",
  border: "1px solid #F3EAFB",
};

const iconStyle = {
  fontSize: "3rem",
  color: "#8C5EAD",
};

export default LandingPage;