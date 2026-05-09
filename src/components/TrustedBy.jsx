import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function TrustedBy() {
  const logos = [
    "/logo/ui.png",
    "/logo/ugm.png",
    "/logo/mercubuana.png",
    "/logo/ipb.png",
    "/logo/ug.png",
    "/logo/itb.png",
    "/logo/binus.png",
    "/logo/upn.png",
  ];

  return (
    <section className="pt-10 pb-20 bg-white">
      <div className="max-w-[1250px] mx-auto px-6">
    
        <p className="text-center text-[#8E8E8E] text-[16px] font-medium mb-8">
          Trusted by 15.000+ University Student in Indonesia
        </p>

        <Swiper
          modules={[Autoplay]}
          slidesPerView={6}
          spaceBetween={40}
          loop={true}
          autoplay={{
            delay: 2200,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: {
              slidesPerView: 2,
            },
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 6,
            },
          }}
        >
          {logos.map((logo, index) => (
            <SwiperSlide key={index}>
              <div className="flex items-center justify-center h-[90px]">
                <img
                  src={logo}
                  alt="University Logo"
                  className="h-[78px] object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}