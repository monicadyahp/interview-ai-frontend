import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");

    setUser(null);

    navigate("/");
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Interview AI", path: "/interview" },
    { name: "Chatbot AI", path: "/chatbot" },
    { name: "Insight", path: "/insight" },
    { name: "About Us", path: "/about" },
  ];

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
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="
            flex items-center gap-2.5 px-3.5 h-[60px]
            cursor-pointer
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

        {/* DESKTOP MENU */}
        <div className="hidden md:flex md:justify-center md:items-center md:py-1">
          <ul className="list-none nav-menu-item flex items-center md:gap-3.5 lg:gap-5 xl:gap-10">
            {menuItems.map((item) => (
              <li key={item.name}>
                <p
                  onClick={() => navigate(item.path)}
                  className="
                    cursor-pointer whitespace-nowrap transition-colors duration-200
                    hover:text-[var(--primary-color)]
                    md:text-sm lg:text-base xl:text-xl
                  "
                >
                  {item.name}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* DASHBOARD + LOGOUT */}
        <div className="hidden navbar-cta md:flex md:items-center md:px-4 lg:px-5 xl:px-[30px] gap-3">
          <button
            className="buttonDashboard"
            onClick={() => navigate(user ? "/interview" : "/login")}
          >
            <p className="textButtonDashboard">
              {user ? "Interview" : "Dashboard"}
            </p>
          </button>

          {user && (
            <button
              onClick={handleLogout}
              className="
                px-5
                h-[45px]
                rounded-full
                border
                border-[#8039FF]
                text-[#8039FF]
                font-semibold
                hover:bg-[#8039FF]
                hover:text-white
                transition
              "
            >
              Logout
            </button>
          )}
        </div>

        {/* HAMBURGER */}
        <button
          className={`navbar-hamburger mr-2.5 md:hidden ${
            isMenuOpen ? "active" : ""
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="navbar-hamburger-line"></span>
          <span className="navbar-hamburger-line"></span>
          <span className="navbar-hamburger-line"></span>
        </button>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        className={`navbar-mobile-overlay ${
          isMenuOpen ? "active" : ""
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* MOBILE MENU */}
      <div className={`navbar-mobile-menu ${isMenuOpen ? "active" : ""}`}>
        <ul className="navbar-mobile-menu-list">
          {menuItems.map((item) => (
            <li key={item.name}>
              <p
                className="navbar-mobile-menu-item"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(item.path);
                }}
              >
                {item.name}
              </p>
            </li>
          ))}
        </ul>

        <div className="navbar-mobile-cta flex flex-col gap-3">
          <button
            className="buttonDashboard"
            onClick={() => {
              setIsMenuOpen(false);
              navigate(user ? "/interview" : "/login");
            }}
          >
            <p className="textButtonDashboard">
              {user ? "Interview" : "Dashboard"}
            </p>
          </button>

          {user && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="
                w-full
                h-[45px]
                rounded-full
                border
                border-[#8039FF]
                text-[#8039FF]
                font-semibold
                hover:bg-[#8039FF]
                hover:text-white
                transition
              "
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};