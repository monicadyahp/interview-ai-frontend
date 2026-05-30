import React from "react";

const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

const projectLinks = ["Project Kami", "Tentang Kami", "Hubungi Kami", "Blog", "FAQ"];
const productLinks = ["Interview AI", "Smart Dashboard", "Chat Bot"];

export default function FooterLinks() {
  return (
    <div className="grid grid-cols-2 gap-12 md:gap-24" style={ff}>

      {/* Project — FIX: font digedein text-[15px] */}
      <div>
        <ul className="flex flex-col gap-3">
          {projectLinks.map((item, index) => (
            <li key={index}>
              <a href="#" className="text-[15px] text-[#666666] hover:text-black transition-colors duration-300">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Product — FIX: "Product" tidak bold, sama dengan yang lain */}
      <div>
        {/* FIX: hapus font-semibold biar sama dengan link lain */}
        <p className="text-[15px] text-[#666666] pb-3">Product</p>
        <ul className="flex flex-col gap-3">
          {productLinks.map((item, index) => (
            <li key={index}>
              <a href="#" className="text-[15px] text-[#666666] hover:text-black transition-colors duration-300">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
