import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function TrustedBy() {
  return (
    <section className="py-16 bg-white text-center">
      
      {/* TEXT */}
      <p className="text-gray-500 mb-8 text-sm">
        Trusted by 15,000+ University Student in Indonesia
      </p>

      {/* LOGO SLIDER */}
      <div className="max-w-4xl mx-auto">
        <Swiper
          spaceBetween={20}
          slidesPerView={3}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          loop={true}
          autoplay={{ delay: 2000 }}
        >
          <SwiperSlide>
            <img src="/logos/ui.png" alt="UI" className="h-10 mx-auto" />
          </SwiperSlide>

          <SwiperSlide>
            <img src="/logos/ugm.png" alt="UGM" className="h-10 mx-auto" />
          </SwiperSlide>

          <SwiperSlide>
            <img src="/logos/itb.png" alt="ITB" className="h-10 mx-auto" />
          </SwiperSlide>

          <SwiperSlide>
            <img src="/logos/binus.png" alt="Binus" className="h-10 mx-auto" />
          </SwiperSlide>

          <SwiperSlide>
            <img src="/logos/unpad.png" alt="Unpad" className="h-10 mx-auto" />
          </SwiperSlide>
        </Swiper>
      </div>

    </section>
  );
}