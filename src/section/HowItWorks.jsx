import React from "react";
import StepCard from "../components/StepCard";
import { dataHowItWorks } from "../data/data";

export default function HowItWorks() {
  return (
    <section className="w-full px-4 md:px-8 lg:px-12 pt-15 md:pt-18 lg:pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-[30px] md:text-[42px] font-extrabold text-black">
            How It Works ?
          </h1>

          <p className="mt-4 text-[18px] md:text-[28px] leading-relaxed text-[#222222] max-w-4xl mx-auto">
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
