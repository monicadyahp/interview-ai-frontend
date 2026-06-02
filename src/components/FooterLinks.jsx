import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function FooterLinks() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const projectLinks = [
    {
      label: "Project Kami",
      action: () => navigate("/"),
    },
    {
      label: "Tentang Kami",
      action: () => navigate("/about"),
    },
    {
      label: "Hubungi Kami",
      action: () => navigate("/contact"),
    },
  ];

  const productLinks = [
    {
      label: "Interview AI",
      action: () => {
        if (user) {
          navigate("/interview");
        } else {
          navigate("/login");
        }
      },
    },
    {
      label: "Smart Dashboard",
      action: () =>
        window.open(
          "https://interview-ai-dashboard-su7byt4utngvkc3yqvtifr.streamlit.app/",
          "_blank",
          "noopener,noreferrer"
        ),
    },
    {
      label: "Chatbot",
      action: () => {
        if (user) {
          navigate("/chatbot");
        } else {
          navigate("/login");
        }
      },
    },
  ];

  const linkClass =
    "text-[14px] text-[#666666] hover:text-black transition-colors duration-300 cursor-pointer text-left";

  return (
    <div className="grid grid-cols-2 gap-12 md:gap-24" style={ff}>
      {/* Project Links */}
      <ul className="flex flex-col gap-2.5">
        {projectLinks.map(({ label, action }) => (
          <li key={label}>
            <button onClick={action} className={linkClass}>
              {label}
            </button>
          </li>
        ))}
      </ul>

      {/* Product Links */}
      <div>
        <p className="text-[14px] text-[#666666] pb-2.5">Product</p>
        <ul className="flex flex-col gap-2.5">
          {productLinks.map(({ label, action }) => (
            <li key={label}>
              <button onClick={action} className={linkClass}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
