import React from "react";
import { dataEverything } from "../data/data";
import Card from "../components/Card";

export const Everything = () => {
  return (
    <section className="w-full px-6 py-[54px]">
      <div className="bg-[#F3ECFF] rounded-[28px] max-w-7xl mx-auto px-5 py-12 md:px-10 md:py-16">
        <div className="flex flex-col items-center text-center gap-3 mb-10">
          {/* FIX: text-[28px] md:text-[36px] */}
          <h1 className="text-[28px] md:text-[36px] font-extrabold text-[#111111] leading-tight">
            Everything you need to walk in confident
          </h1>
          {/* FIX: text-[16px] md:text-[20px] */}
          <p className="text-[16px] md:text-[20px] font-medium text-[#2A2A2A]">
            Built for real candidates, powered by real AI
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dataEverything.map((data) => (
            <Card
              key={data.id}
              icon={data.icon}
              subject={data.subject}
              description={data.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
