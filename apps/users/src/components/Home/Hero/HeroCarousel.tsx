import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

import { useT } from "../../../i18n";
import { getHeroTrendingSlides } from "./heroTrendingSlides";

export default function HeroCarousel() {
  const t = useT();
  const slides = useMemo(() => getHeroTrendingSlides(t), [t]);
  const firstId = slides[0]?.id;
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);

  return (
    <div className="trending-hero-carousel group relative overflow-hidden rounded-[1.35rem] shadow-[0_24px_80px_-44px_rgba(17,24,39,0.75)] ring-1 ring-black/5">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={slides.length > 1}
        speed={600}
        autoplay={{ delay: 5200, disableOnInteraction: false }}
        navigation={true}
        onSwiper={setSwiperRef}
        onSlideChange={(s) => setActiveIndex(s.realIndex)}
        className="[&_.swiper-button-next]:opacity-0 [&_.swiper-button-next]:transition [&_.swiper-button-next]:duration-200 [&_.swiper-button-next]:after:text-white [&_.swiper-button-next]:after:text-[24px] [&_.swiper-button-prev]:opacity-0 [&_.swiper-button-prev]:transition [&_.swiper-button-prev]:duration-200 [&_.swiper-button-prev]:after:text-white [&_.swiper-button-prev]:after:text-[24px] group-hover:[&_.swiper-button-next]:opacity-100 group-hover:[&_.swiper-button-prev]:opacity-100"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={slide.id}>
            <div className="relative min-h-[340px] overflow-hidden sm:min-h-[380px] md:min-h-[420px] lg:min-h-[440px]">

              {/* Full-bleed background image */}
              <Link
                to={`/shop-details?id=${slide.id}`}
                className="absolute inset-0 z-0 block"
                aria-label={slide.imageAlt}
                tabIndex={-1}
              >
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  className="h-full w-full object-cover object-[70%_center] md:object-[60%_center]"
                  loading={slide.id === firstId ? "eager" : "lazy"}
                />
              </Link>

              {/* Dark gradient overlay */}
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#111827] via-[#111827]/85 to-[#111827]/10 md:via-[#111827]/75 md:to-transparent" />
              <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_15%_85%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_10%_20%,rgba(225,29,72,0.22),transparent_28%)]" />

              {/* Text content */}
              <div className="relative z-20 flex h-full flex-col justify-center px-6 py-10 sm:px-10 md:max-w-[55%] md:px-12 lg:max-w-[50%] lg:px-14">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-rose-300">
                  {slide.eyebrow}
                </p>
                <h1 className="text-[2rem] font-black leading-[0.98] tracking-tight text-white sm:text-[2.6rem] md:text-[3rem] lg:text-[3.4rem]">
                  iBerry
                  <span className="block text-white/80">fashion marketplace</span>
                </h1>
                <h2 className="mt-4 text-base font-semibold leading-snug text-white sm:text-lg md:text-xl">
                  {slide.headline}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/70 sm:text-[15px]">
                  {slide.subline}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <p className="rounded-full bg-white/10 px-3.5 py-2 text-sm font-bold text-white ring-1 ring-white/15">
                    {slide.priceLabel}
                  </p>
                  <p className="text-sm font-medium text-white/65">
                    Tez yetkazish · Oson qaytarish
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to={`/shop-details?id=${slide.id}`}
                    className="inline-flex w-fit items-center rounded-xl bg-[#E11D48] px-5 py-3 text-sm font-bold text-white shadow-[0_16px_30px_-18px_rgba(225,29,72,1)] transition hover:-translate-y-0.5 hover:bg-[#BE123C]"
                  >
                    {t("homeHeroCtaViewProduct")}
                  </Link>
                  <Link
                    to="/shop-with-sidebar"
                    className="inline-flex w-fit items-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/16"
                  >
                    {t("homeHeroCtaBrowseShop")}
                  </Link>
                </div>
              </div>

              {/* Custom pagination dots — inside the slide, always on image */}
              {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5">
                  {slides.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      type="button"
                      onClick={() => swiperRef?.slideToLoop(dotIndex)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        dotIndex === activeIndex
                          ? "w-6 bg-white"
                          : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                      aria-label={`Go to slide ${dotIndex + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
