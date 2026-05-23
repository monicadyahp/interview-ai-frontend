import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import TestimonialCard from "../components/TestimonialCard";
import { testimonialData } from "../data/data";
import { Autoplay } from "swiper/modules";

export default function Testimonials() {
  return (
    <section className="w-full px-6 py-[54px]">
      <div className="max-w-7xl mx-auto bg-[#F6ECF7] rounded-[32px] px-5 py-14 md:px-10 md:py-16">
        <div className="text-center mb-14">
          {/* FIX: text-[28px] md:text-[36px] */}
          <h1 className="text-[28px] md:text-[36px] font-extrabold text-black">
            What candidates are saying
          </h1>
          {/* FIX: text-[16px] md:text-[18px] */}
          <p className="mt-3 text-[16px] md:text-[18px] text-[#222222]">
            Real feedback from real practice session
          </p>
        </div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoHeight={false}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
        >
          {testimonialData.map((item) => (
            <SwiperSlide key={item.id} className="!h-auto flex">
              <TestimonialCard
                rating={item.rating}
                review={item.review}
                name={item.name}
                role={item.role}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
