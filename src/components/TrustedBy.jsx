import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function TrustedBy() {
  const logos = [
    "/logo/ui.png",
    "/logo/ugm.png",
    "/logo/mercubuana.png",
    "/logo/ug.png",
    "/logo/itb.png",
    "/logo/binus.png",
    "/logo/upn.png",
  ];

  return (
    <section className="pt-8 pb-20 bg-white text-center overflow-hidden">
      
      <p className="text-[#8E8E8E] text-[14px] font-medium mb-6">
        Trusted by 15.000+ University Student in Indonesia
      </p>

      <div className="max-w-[1400px] mx-auto">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={7}
          spaceBetween={10}
          loop={true}
          speed={2500}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
        >
          {logos.map((logo, i) => (
            <SwiperSlide key={i}>
              <div className="flex justify-center items-center h-[90px]">
                <img
                  src={logo}
                  alt="University Logo"
                  className="h-[85px] object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}