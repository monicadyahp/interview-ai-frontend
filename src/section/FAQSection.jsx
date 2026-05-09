import React, { useEffect, useRef, useState } from "react";
import FAQItem from "../components/FAQItem";
import { faqData } from "../data/data";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;

      const rect = section.getBoundingClientRect();

      const windowHeight = window.innerHeight;

      // Total scrollable area inside section
      const sectionHeight = rect.height;

      // How much section has entered viewport
      const progress =
        (windowHeight - rect.top) / (sectionHeight + windowHeight);

      // Normalize 0 → 1
      const clampedProgress = Math.max(0, Math.min(progress, 1));

      // Convert progress to FAQ index
      const newIndex = Math.min(
        faqData.length - 1,
        Math.floor(clampedProgress * faqData.length),
      );

      setOpenIndex(newIndex);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        w-full
        px-4
        md:px-8
        lg:px-12
       pt-15 md:pt-18 lg:pt-20
        overflow-hidden
      "
    >
      <div className="max-w-7xl mx-auto">
        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Left Content */}
          <div className="lg:sticky lg:top-24">
            <h1 className="text-[24px] lg:text-[36px] md:text-[26px] font-extrabold leading-tight text-black">
              Frequently Asked Question
            </h1>

            <p className="mt-6 text-[24px] lg:text-[36px] md:text-[26px] leading-relaxed text-[#222222]">
              Find quick answers to common questions about our platform, food
              safety, and how you can start making an impact with Intersight.
            </p>
          </div>

          {/* FAQ List */}
          <div className="flex flex-col gap-6">
            {faqData.map((item, index) => (
              <FAQItem
                key={item.id}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
