import React from "react";
import FooterBrand from "../components/FooterBrand";
import FooterLinks from "../components/FooterLinks";
import FooterBottom from "../components/FooterBottom";

export default function Footer() {
  return (
    <footer className="w-full px-6 md:px-10 pt-10 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Top */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 pb-8 border-b border-[#E5E5E5]">
          <FooterBrand />
          <FooterLinks />
        </div>

        {/* Bottom */}
        <FooterBottom />
      </div>
    </footer>
  );
}
