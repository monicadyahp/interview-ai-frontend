import React, { useState, useEffect } from "react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Tutup menu saat resize ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll saat menu mobile terbuka
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const menuItems = ["Home", "Interview AI", "Chatbot AI", "Insight", "About Us"];

  return (
    <>
      <nav
        className="
          fixed flex justify-between items-center left-1/2 -translate-x-1/2
          bg-white z-[9999] shadow-[0_2px_4px_0_rgba(0,0,0,0.25)] transition-all duration-300
          w-[92%] h-[60px] top-4 rounded-3xl
          md:w-[95%] md:max-w-[740px] md:h-[68px] md:top-6 md:rounded-[36px]
          lg:max-w-[960px] lg:h-[76px]
          xl:w-[1243px] xl:max-w-none xl:top-[39px]
        "
      >
        {/* Logo Section */}
        <div
          className="
            flex items-center gap-2.5 px-3.5 h-[60px]
            md:gap-2.5 md:px-4 md:h-[68px]
            lg:gap-3 lg:px-5
            xl:gap-[17px] xl:w-[350px] xl:h-[76px] xl:px-[30px] xl:justify-center
          "
        >
          <img
            src="/logo/Icon_Insight.png"
            alt="Logo Insight"
            className="
              w-9 h-9 object-cover object-center
              md:w-[38px] md:h-[38px]
              lg:w-11 lg:h-11
              xl:w-14 xl:h-14
            "
          />
          <h1
            className="
              font-bold leading-tight tracking-[0.02em] fontIntersight
              text-xl
              lg:text-2xl
              xl:text-[32px]
            "
          >
            Intersight
          </h1>
        </div>

        {/* Menu Section (Desktop & Tablet) */}
        <div className="hidden md:flex md:justify-center md:items-center md:py-1">
          <ul className="list-none nav-menu-item flex items-center md:gap-3.5 lg:gap-5 xl:gap-10">
            {menuItems.map((item) => (
              <li key={item}>
                <p
                  className="
                    cursor-pointer whitespace-nowrap transition-colors duration-200
                    hover:text-[var(--primary-color)]
                    md:text-sm lg:text-base xl:text-xl
                  "
                >
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Section (Desktop & Tablet) */}
        <div className="hidden navbar-cta md:flex md:items-center md:px-4 lg:px-5 xl:px-[30px]">
          <button className="buttonDashboard">
            <p className="textButtonDashboard">Dashboard</p>
          </button>
        </div>

        {/* Hamburger Button (Mobile Only) */}
        <button
          className={`navbar-hamburger mr-2.5 md:hidden ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="navbar-hamburger-line"></span>
          <span className="navbar-hamburger-line"></span>
          <span className="navbar-hamburger-line"></span>
        </button>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`navbar-mobile-overlay ${isMenuOpen ? "active" : ""}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Dropdown Menu */}
      <div className={`navbar-mobile-menu ${isMenuOpen ? "active" : ""}`}>
        <ul className="navbar-mobile-menu-list">
          {menuItems.map((item) => (
            <li key={item}>
              <p
                className="navbar-mobile-menu-item"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </p>
            </li>
          ))}
        </ul>
        <div className="navbar-mobile-cta">
          <button
            className="buttonDashboard"
            onClick={() => setIsMenuOpen(false)}
          >
            <p className="textButtonDashboard">Dashboard</p>
          </button>
        </div>
      </div>
    </>
  );
};
