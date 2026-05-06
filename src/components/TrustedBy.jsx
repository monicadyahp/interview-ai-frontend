import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

export default function TrustedBy() {
  const logos = [
    "/logo/ui.png",
    "/logo/ugm.png",
    "/logo/itb.png",
    "/logo/unpad.png",
    "/logo/binus.png",
    "/logo/ipb.png",
    "/logo/mercu.png",
    "/logo/ug.png",
    "/logo/up.png",
    "/logo/upn.png",
    "/logo/unair.png",
    "/logo/undip.png",
  ];

  return (
    <section className="py-16 bg-white text-center">
      <p className="text-gray-500 mb-8 text-sm">
        Trusted by 15,000+ University Student in Indonesia
      </p>

      <div className="max-w-4xl mx-auto">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={3}
          loop={true}
          autoplay={{ delay: 2000 }}
        >
          {logos.map((logo, i) => (
            <SwiperSlide key={i}>
              <img
                src={logo}
                className="h-12 mx-auto object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}