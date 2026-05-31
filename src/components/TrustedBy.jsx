import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
export default function TrustedBy() {
  const logos = ["/logo/ui.png","/logo/ugm.png","/logo/mercubuana.png","/logo/ug.png","/logo/up.png","/logo/ipb.png","/logo/ug.png","/logo/itb.png","/logo/binus.png","/logo/upn.png","/logo/unair.png","/logo/unpad.png"];
  return (
    <section className="py-[54px] bg-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* trusted by naik ke text-[18px] md:text-[20px] */}
        <p className="text-center text-[#8A8A8A] text-[18px] md:text-[20px] font-semibold mb-8 leading-normal">
          Trusted by 15.000+ University Student in Indonesia
        </p>
        <Swiper modules={[Autoplay]} slidesPerView={6} spaceBetween={30} loop={true} speed={2500}
          autoplay={{ delay: 0, disableOnInteraction: false }} allowTouchMove={false}
          breakpoints={{ 320: { slidesPerView: 2 }, 640: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 6 } }}>
          {logos.map((logo, index) => (
            <SwiperSlide key={index}>
              <div className="flex items-center justify-center h-[80px]">
                <img src={logo} alt="University Logo" className="h-[60px] object-contain transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
