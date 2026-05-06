import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function TrustedBy() {
  const logos = [
    "https://logo.clearbit.com/ui.ac.id",
    "https://logo.clearbit.com/ugm.ac.id",
    "https://logo.clearbit.com/itb.ac.id",
    "https://logo.clearbit.com/binus.ac.id",
    "https://logo.clearbit.com/unpad.ac.id",
  ];

  return (
    <section className="py-16 bg-white text-center">
      
      {/* TEXT */}
      <p className="text-gray-500 mb-8 text-sm">
        Trusted by 15,000+ University Student in Indonesia
      </p>

      {/* SLIDER */}
      <div className="max-w-4xl mx-auto">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={3}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
        >
          {logos.map((logo, index) => (
            <SwiperSlide key={index}>
              <img
                src={logo}
                alt="logo"
                className="h-10 mx-auto object-contain grayscale hover:grayscale-0 transition"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  );
}