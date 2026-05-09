import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function TrustedBy() {
  const logos = [
    "/logo/ui.png",
    "/logo/ugm.png",
    "/logo/mercubuana.png",
    "/logo/ug.png",
    "/logo/up.png",
    "/logo/ipb.png",
    "/logo/ug.png",
    "/logo/itb.png",
    "/logo/binus.png",
    "/logo/upn.png",
    "/logo/unair.png",
    "/logo/unpad.png",
  ];

  return (
    <section className="pt-8 pb-24 bg-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* TEXT */}
        <p className="text-center text-[#8E8E8E] text-[28px] font-semibold mb-10 leading-normal">
          Trusted by 15.000+ University Student in Indonesia
        </p>

        {/* SLIDER */}
        <Swiper
          modules={[Autoplay]}
          slidesPerView={6}
          spaceBetween={30}
          loop={true}
          speed={2500}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          allowTouchMove={false}
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
              <div className="flex items-center justify-center h-[110px]">
                <img
                  src={logo}
                  alt="University Logo"
                  className="h-[82px] object-contain transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}