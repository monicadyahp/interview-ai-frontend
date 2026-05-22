import React from "react";
import StepCard from "../components/StepCard";
import { dataHowItWorks } from "../data/data";

export default function HowItWorks() {
  return (
    /* FIX: spacing seragam py-[54px] px-6 */
    <section className="w-full px-6 py-[54px]">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-[24px] md:text-[32px] font-extrabold text-black">
            How It Works ?
          </h1>

          <p className="mt-3 text-[15px] md:text-[18px] leading-relaxed text-[#222222] max-w-2xl mx-auto">
            Take your web app codebase and transform it into a cross platform
            desktop app with native functionality
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {dataHowItWorks.map((data, index) => (
            <div key={data.id} className={index === 0 ? "lg:col-span-2" : ""}>
              <StepCard
                step={data.step}
                title={data.title}
                description={data.description}
                image={data.image}
                large={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
