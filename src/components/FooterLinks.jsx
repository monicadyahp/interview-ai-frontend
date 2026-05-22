import React from "react";

const projectLinks = [
  "Project Kami",
  "Tentang Kami",
  "Hubungi Kami",
  "Blog",
  "FAQ",
];

const productLinks = ["Interview AI", "Smart Dashboard", "Chat Bot"];

export default function FooterLinks() {
  return (
    <div
      className="grid grid-cols-2 gap-12 md:gap-24"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Project */}
      <div>
        <ul className="flex flex-col gap-3">
          {projectLinks.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className="
                  text-[14px]
                  text-[#666666]
                  hover:text-black
                  transition-colors
                  duration-300
                "
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Product */}
      <div>
        {/* FIX: "Product" label */}
        <p className="text-[14px] font-semibold text-[#111111] pb-3">
          Product
        </p>
        <ul className="flex flex-col gap-3">
          {productLinks.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className="
                  text-[14px]
                  text-[#666666]
                  hover:text-black
                  transition-colors
                  duration-300
                "
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
