import React from "react";

export default function CTAContent() {
  return (
    <div className="flex-1 w-full">
      {/* Small Text */}
      <p
        className="
          text-[18px]
          md:text-[24px]
          text-black
          leading-relaxed
        "
      >
        Ready to turn your anxiety into an offer letter?
      </p>

      {/* Heading */}
      <h1
        className="
          mt-6
          lg:text-[32px]
          md:text-[26px]
          text-[24px]
          font-extrabold
          leading-tight
          text-black
          max-w-3xl
        "
      >
        Join 5,000+ Indonesian grads who are leveling up their career game while
        you're still guessing.
      </h1>

      {/* CTA Button */}
      <button
        className="
          mt-10
          bg-gradient-to-r
          from-[#7A3CFF]
          to-[#5D49FF]
          hover:scale-[1.02]
          transition-all
          duration-300
          text-white
          font-bold
          lg:text-[28px]
          md:text-[26px]
          text-[18px]
          px-8
          py-4
          md:px-12
          md:py-5
          rounded-full
          shadow-lg
          w-full
        "
      >
        Launch Intersight Now 🚀
      </button>
    </div>
  );
}
