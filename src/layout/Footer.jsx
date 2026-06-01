import React from "react";
import FooterBrand from "../components/FooterBrand";
import FooterLinks from "../components/FooterLinks";
import FooterBottom from "../components/FooterBottom";
export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#ECECEC] px-4 md:px-8 lg:px-12 pt-10 pb-6 mt-6">
      <div className="max-w-7xl mx-auto">
        {/* Top */}
        <div
          className="
            flex
            flex-col
            lg:flex-row
            justify-between
            gap-14
            pb-16
            border-b
            border-[#E5E5E5]
          "
        >
          {/* Brand */}
          <FooterBrand />

          {/* Links */}
          <FooterLinks />
        </div>

        {/* Bottom */}
        <FooterBottom />
      </div>
    </footer>
  );
}
