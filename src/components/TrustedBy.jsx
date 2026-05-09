import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function TrustedBy() {
  const logos = [
    "/logo/ui.png",
    "/logo/ugm.png",
    "/logo/itb.png",
    "/logo/unpad.png",
    "/logo/binus.png",
    "/logo/ipb.png",
    "/logo/mercubuana.png",
    "/logo/ug.png",
    "/logo/up.png",
    "/logo/upn.png",
    "/logo/unair.png",
    "/logo/undip.png",
  ];

  return (
    <section className="py-24 bg-white text-center overflow-hidden">
     
      <p className="text-gray-500 mb-14 text-[18px] font-medium">
        Trusted by 15,000+ University Students in Indonesia
      </p>

      <div className="max-w-[1200px] mx-auto px-6">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={40}
          slidesPerView={2}
          loop={true}
          speed={3000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
            1280: {
              slidesPerView: 6,
            },
          }}
        >
          {logos.map((logo, i) => (
            <SwiperSlide key={i}>
              <div className="flex items-center justify-center h-[120px]">
                <img
                  src={logo}
                  alt="University Logo"
                  className="
                    h-20
                    object-contain
                    grayscale
                    hover:grayscale-0
                    hover:scale-110
                    transition-all
                    duration-300
                  "
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}