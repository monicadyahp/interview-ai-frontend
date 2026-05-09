import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";

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

      {/* --- HERO SECTION --- */}
      {/* <section className="home section" id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
                <div className="home__container container grid">
                    <div className="home__data">
                        <span className="section__tag" style={{ background: '#F3EAFB', color: '#8C5EAD', padding: '5px 15px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700' }}>
                            <i className='bx bxs-zap'></i> AI-Powered Preparation
                        </span>
                        <h1 className="home__title" style={{ marginTop: '1rem', fontSize: '3rem', lineHeight: '1.2' }}>
                            Kuasai Interview <br /> <span style={{ color: '#8C5EAD' }}>dengan Bantuan AI.</span>
                        </h1>
                        <p className="home__description" style={{ fontSize: '1rem', color: '#666', margin: '1.5rem 0' }}>
                            Latih ekspresi wajah dan kepercayaan diri Anda secara real-time. 
                            Dapatkan feedback instan dari asisten cerdas kami untuk karir impian Anda.
                        </p>
                        <div className="home__buttons" style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/interview" className="button" style={{ padding: '1rem 2rem', borderRadius: '15px' }}>Mulai Simulasi</Link>
                            {!isLoggedIn && (
                                <Link to="/login" className="button--secondary" style={{ padding: '1rem 2rem', border: '2px solid #8C5EAD', borderRadius: '15px', color: '#8C5EAD' }}>Masuk Akun</Link>
                            )}
                        </div>
                    </div>

                    <div className="home__img-wrapper" style={{ position: 'relative' }}>
                        <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000" alt="Hero AI" className="home__img-hero" style={{ borderRadius: '30px', boxShadow: '0 30px 60px rgba(140, 94, 173, 0.2)' }} />
                        <div className="home__blob"></div>
                    </div>
                </div>
            </section> */}
      <HeroSection />

      {/* --- TEMPELKAN KODE TIPS DI SINI (DI LUAR SECTION) --- */}
      {/* <div
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
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Tips Cepat Hari Ini
          </span>
          <p
            style={{
              margin: 0,
              fontSize: "0.85rem",
              color: "#555",
              fontStyle: "italic",
            }}
          >
            "{dailyTip}"
          </p>
        </div>
      </div> */}

      {/* --- FEATURES SECTION (Penjelasan Ringkas) --- */}
      {/* <section className="section container" style={{ paddingBottom: "5rem" }}>
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
          <div
            style={{
              background: "#FFF",
              padding: "2rem",
              borderRadius: "25px",
              border: "1px solid #F3EAFB",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
            }}
          >
            <i
              className="bx bx-face"
              style={{ fontSize: "3rem", color: "#8C5EAD" }}
            ></i>
            <h3 style={{ margin: "1rem 0" }}>Analisis Wajah</h3>
            <p style={{ fontSize: "0.85rem", color: "#777" }}>
              AI kami mendeteksi 7 emosi dasar secara real-time untuk memastikan
              aura positifmu terpancar.
            </p>
          </div>

          <div
            style={{
              background: "#FFF",
              padding: "2rem",
              borderRadius: "25px",
              border: "1px solid #F3EAFB",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
            }}
          >
            <i
              className="bx bx-stats"
              style={{ fontSize: "3rem", color: "#8C5EAD" }}
            ></i>
            <h3 style={{ margin: "1rem 0" }}>Statistik Progres</h3>
            <p style={{ fontSize: "0.85rem", color: "#777" }}>
              Pantau perkembangan latihanmu melalui grafik mingguan dan total
              sesi yang terukur.
            </p>
          </div>

          <div
            style={{
              background: "#FFF",
              padding: "2rem",
              borderRadius: "25px",
              border: "1px solid #F3EAFB",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
            }}
          >
            <i
              className="bx bx-share-alt"
              style={{ fontSize: "3rem", color: "#8C5EAD" }}
            ></i>
            <h3 style={{ margin: "1rem 0" }}>Export & Bagikan</h3>
            <p style={{ fontSize: "0.85rem", color: "#777" }}>
              Simpan hasil analisismu dalam desain Instastory premium dan
              bagikan progresmu ke dunia.
            </p>
          </div>
        </div>
      </section> */}
      {/* --- FINAL CTA BANNER --- */}
      {/* <section className="section container" style={{ paddingBottom: "7rem" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #8C5EAD 0%, #6A4687 100%)",
            padding: "4rem 2rem",
            borderRadius: "40px",
            textAlign: "center",
            color: "#FFF",
            boxShadow: "0 20px 50px rgba(140, 94, 173, 0.3)",
          }}
        >
          <h2
            style={{
              color: "#FFF",
              fontSize: "2.2rem",
              marginBottom: "1rem",
              fontWeight: "800",
            }}
          >
            Siap Menguasai Interview Kamu?
          </h2>
          <p
            style={{
              marginBottom: "2.5rem",
              opacity: 0.9,
              fontSize: "1.1rem",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
            }}
          >
            Jangan biarkan rasa gugup menghalangi karir impianmu. Mulai simulasi
            sekarang dan jadilah kandidat yang tak terlupakan.
          </p>
          <Link
            to="/interview"
            className="button"
            style={{
              background: "#8C5EAD",
              color: "#c497e4",
              padding: "1.2rem 3rem",
              borderRadius: "18px",
              fontWeight: "800",
              fontSize: "1rem",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            Mulai Sekarang{" "}
            <i
              className="bx bx-right-arrow-alt"
              style={{ fontSize: "1.4rem" }}
            ></i>
          </Link>
        </div>
      </section> */}
    </>
  );
};

export default LandingPage;
