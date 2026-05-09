import React from "react";
import CTAImage from "../components/CTAImage";
import CTAContent from "../components/CTAContent";

export default function CTASection() {
  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-20">
      <div
        className="
          max-w-7xl
          mx-auto
          rounded-[40px]
          overflow-hidden
          bg-gradient-to-r
          from-[#D7C2FF]
          via-[#F8D8DF]
          to-[#C8C8FF]
          px-6
          md:px-10
          lg:px-14
          py-10
          pt-15 md:pt-18 lg:pt-20
        "
      >
        <div
          className="
            flex
            flex-col
            lg:flex-row
            items-center
            justify-between
            gap-12
          "
        >
          {/* Left Content */}
          <CTAContent />

          {/* Right Image */}
          <CTAImage image="CTA/CTA-Image.png" />
        </div>
      </div>
    </section>
  );
}
