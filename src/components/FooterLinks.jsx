import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function FooterLinks() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const leftLinks = [
    { label: "Project Kami", action: () => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); } },
    { label: "Tentang Kami", action: () => navigate("/about") },
    { label: "Hubungi Kami", action: () => navigate("/contact") },
  ];

  const rightLinks = [
    {
      label: "Interview AI",
      action: () => user ? navigate("/interview") : navigate("/login"),
    },
    {
      label: "Smart Dashboard",
      action: () => window.open("https://interview-ai-dashboard-su7byt4utngvkc3yqvtifr.streamlit.app/", "_blank", "noopener,noreferrer"),
    },
    {
      label: "Chatbot",
      action: () => user ? navigate("/chatbot") : navigate("/login"),
    },
  ];

  const linkClass = "text-[14px] text-[#666666] hover:text-black transition-colors duration-300 cursor-pointer text-left";

  return (
    <div className="grid grid-cols-2 gap-12 md:gap-24" style={ff}>
      <ul className="flex flex-col gap-2.5">
        {leftLinks.map(({ label, action }) => (
          <li key={label}>
            <button onClick={action} className={linkClass}>{label}</button>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-2.5">
        {rightLinks.map(({ label, action }) => (
          <li key={label}>
            <button onClick={action} className={linkClass}>{label}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
