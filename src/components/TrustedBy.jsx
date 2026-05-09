<section className="pt-10 pb-20 bg-white text-center overflow-hidden">

  {/* TITLE */}
  <p className="text-[#9A9A9A] mb-4 text-[18px] font-semibold">
    Trusted by 15.000+ University Student in Indonesia
  </p>

  {/* LOGOS */}
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