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
      className="
        grid
        grid-cols-2
        gap-12
        md:gap-24
      "
    >
      {/* Project */}
      <div>
        <ul className="flex flex-col gap-4">
          {projectLinks.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className="
                  text-[22px]
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
        <p
          className="
                  text-[22px]
                  text-[#666666]
                  hover:text-black
                  transition-colors
                  duration-300
                  pb-[10px]
                "
        >
          Product
        </p>
        <ul className="flex flex-col gap-4">
          {productLinks.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className="
                  text-[22px]
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
