import React, { useEffect, useRef, useState } from "react";
import FAQItem from "../components/FAQItem";
import { faqData } from "../data/data";

const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (rect.height + window.innerHeight);
      const clamped = Math.max(0, Math.min(progress, 1));
      setOpenIndex(Math.min(faqData.length - 1, Math.floor(clamped * faqData.length)));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="w-full px-6 py-[54px] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

          {/* Left — FIX: font size disesuaikan sesuai Figma (sama dengan section lain) */}
          <div className="lg:sticky lg:top-24">
            <h1
              className="text-[24px] md:text-[32px] font-extrabold leading-tight text-black"
              style={ff}
            >
              Frequently Asked Question
            </h1>
            {/* FIX: subtitle font size sama dengan section lain text-[16px] md:text-[18px] */}
            <p
              className="mt-4 text-[16px] md:text-[18px] leading-relaxed text-[#222222]"
              style={ff}
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
