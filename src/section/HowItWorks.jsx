import React from "react";
import StepCard from "../components/StepCard";
import { dataHowItWorks } from "../data/data";

export default function HowItWorks() {
  return (
    <section className="w-full px-6 py-[54px]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          {/* Sesuai Figma: "How It Works ?" */}
          <h1
            className="text-[28px] md:text-[36px] font-extrabold text-black"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            How It Works ?
          </h1>
          {/* FIX: subtitle sesuai Figma */}
          <p
            className="mt-3 text-[16px] md:text-[20px] leading-relaxed text-[#222222] max-w-2xl mx-auto"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Take your web app codebase and transform it into a cross platform
            desktop app with native functionality
          </p>
        </div>

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
