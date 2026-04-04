import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useT } from "../../../i18n";
import { getHeroTrendingSlides } from "./heroTrendingSlides";

export default function HeroCarousel() {
  const t = useT();
  const slides = useMemo(() => getHeroTrendingSlides(t), [t]);
  const firstId = slides[0]?.id;

  return (
    <div className="trending-hero-carousel group relative overflow-hidden rounded-2xl bg-[#E8E0D5] shadow-sm ring-1 ring-black/5">
      <span className="absolute right-3 top-3 z-20 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-600 shadow-sm backdrop-blur-sm md:right-4 md:top-4">
        {t("homeHeroBadgeFeatured")}
      </span>

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={slides.length > 1}
        speed={600}
        autoplay={{
          delay: 5200,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        className="!pb-12 [&_.swiper-pagination]:bottom-3 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:bg-white/50 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet-active]:rounded-full [&_.swiper-pagination-bullet-active]:bg-neutral-800/90"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="grid min-h-[200px] grid-cols-1 items-center gap-4 px-5 py-6 sm:min-h-[220px] sm:px-8 sm:py-5 md:grid-cols-2 md:gap-8 md:px-10 lg:min-h-[240px] lg:py-4">
              <div className="order-2 flex flex-col justify-center md:order-1">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
                  {slide.eyebrow}
                </p>
                <h2 className="hero-serif-title text-[1.65rem] font-normal leading-[1.15] tracking-tight text-neutral-900 sm:text-3xl md:text-4xl lg:text-[2.35rem]">
                  {slide.headline}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
                  {slide.subline}
                </p>
                <p className="mt-3 text-sm font-medium text-neutral-800">{slide.priceLabel}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to={`/shop-details?id=${slide.id}`}
                    className="inline-flex w-fit items-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
                  >
                    {t("homeHeroCtaViewProduct")}
                  </Link>
                  <Link
                    to="/shop-with-sidebar"
                    className="inline-flex w-fit items-center rounded-lg border border-neutral-400/60 bg-white/40 px-5 py-2.5 text-sm font-medium text-neutral-800 backdrop-blur-sm transition hover:bg-white/70"
                  >
                    {t("homeHeroCtaBrowseShop")}
                  </Link>
                </div>
              </div>

              <div className="order-1 flex justify-center md:order-2 md:justify-end">
                <Link
                  to={`/shop-details?id=${slide.id}`}
                  className="flex items-center justify-center rounded-lg outline-offset-4 transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-800"
                  aria-label={`${t("homeHeroCtaViewProduct")}: ${slide.imageAlt}`}
                >
                  <img
                    src={slide.image}
                    alt={slide.imageAlt}
                    width={320}
                    height={320}
                    className="h-auto max-h-[140px] w-auto max-w-[min(100%,220px)] object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.12)] sm:max-h-[160px] sm:max-w-[260px] md:max-h-[200px] md:max-w-[300px] lg:max-h-[220px]"
                    loading={slide.id === firstId ? "eager" : "lazy"}
                  />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
