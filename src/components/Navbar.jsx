import React from "react";

export const Navbar = () => {
  return (
    <nav className="fixed flex justify-between items-center w-[1243px] h-[76px] left-1/2 -translate-x-1/2 bg-[#ffffff] rounded-[36px] shadow-[0_2px_4px_0_rgba(0,0,0,0.25)] z-9999">
      <div className="flex justify-center items-center gap-[17px] w-[350px] h-[76px] px-[30px]">
        <img
          src="/logo/Icon_Insight.png"
          alt="Logo Insight"
          className="w-[56px] h-[56px] object-center object-cover shadow-[0_1_1_0,(000000,0.50)]"
        />
        <h1 className="  font-jakarta font-bold text-[32px] leading-tight tracking-[0.02em] fontIntersight">
          Intersight
        </h1>
      </div>
      <div className="flex justify-center items-center pt-[4px] pb-[4px]">
        <ul className="list-none nav-menu-item flex items-center gap-[40px]">
          <li>
            <p className="text-[20px]">Home</p>
          </li>
          <li>
            <p className="text-[20px]">Interview AI</p>
          </li>
          <li>
            <p className="text-[20px]">Chatbot AI</p>
          </li>
          <li>
            <p className="text-[20px]">Insight</p>
          </li>
          <li>
            <p className="text-[20px]">About Us</p>
          </li>
        </ul>
      </div>
      <div className="flex items-center px-[30px]">
        <button className="buttonDashboard">
          <p className="textButtonDashboard">Dashboard</p>
        </button>
      </div>
    </nav>
  );
};
