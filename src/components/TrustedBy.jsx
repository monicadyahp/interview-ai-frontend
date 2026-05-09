<section className="pt-10 pb-20 bg-white text-center overflow-hidden">

  <p className="h-[95px] w-auto object-contain opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300">
    Trusted by 15.000+ University Student in Indonesia
  </p>

  <div className="max-w-[1350px] mx-auto px-2">
    <Swiper
      modules={[Autoplay]}
      spaceBetween={10}
      slidesPerView={6}
      loop={true}
      speed={2500}
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
      }}
      breakpoints={{
        320: { slidesPerView: 3 },
        640: { slidesPerView: 4 },
        1024: { slidesPerView: 6 },
      }}
    >
      {logos.map((logo, i) => (
        <SwiperSlide key={i}>
          <div className="flex justify-center items-center h-[120px]">
            <img
              src={logo}
              alt="University Logo"
              className="h-[95px] object-contain"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</section>