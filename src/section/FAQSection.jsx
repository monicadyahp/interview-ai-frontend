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
      const sectionHeight = rect.height;
      const progress = (windowHeight - rect.top) / (sectionHeight + windowHeight);
      const clampedProgress = Math.max(0, Math.min(progress, 1));
      const newIndex = Math.min(faqData.length - 1, Math.floor(clampedProgress * faqData.length));
      setOpenIndex(newIndex);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="w-full px-6 py-[54px] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Left */}
          <div className="lg:sticky lg:top-24">
            <h1
              className="text-[24px] md:text-[32px] font-extrabold leading-tight text-black"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Frequently Asked Question
            </h1>
            {/* FIX: subtitle sesuai Figma — hapus "food safety" */}
            <p
              className="mt-4 text-[15px] md:text-[16px] leading-relaxed text-[#222222]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Find quick answers to common questions about our platform,
              and how you can start making an impact with Intersight.
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
