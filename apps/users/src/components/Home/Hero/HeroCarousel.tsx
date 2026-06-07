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
    <div className="trending-hero-carousel group relative overflow-hidden rounded-[1.35rem] bg-[#111827] shadow-[0_24px_80px_-44px_rgba(17,24,39,0.75)] ring-1 ring-black/5">
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
        className="!pb-10 [&_.swiper-pagination]:bottom-3 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:bg-white/40 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet-active]:rounded-full [&_.swiper-pagination-bullet-active]:bg-white"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative grid min-h-[430px] grid-cols-1 items-center gap-4 px-5 py-6 sm:min-h-[460px] sm:px-8 md:min-h-[350px] md:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)] md:gap-8 md:px-10 lg:min-h-[360px] lg:px-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(225,29,72,0.35),transparent_32%),radial-gradient(circle_at_15%_85%,rgba(59,130,246,0.25),transparent_30%)]" />
              <div className="relative z-10 order-1 flex flex-col justify-center">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-rose-200">
                  {slide.eyebrow}
                </p>
                <h1 className="max-w-[500px] text-[2rem] font-black leading-[0.98] tracking-tight text-white sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.65rem]">
                  iBerry
                  <span className="block text-white/82">fashion marketplace</span>
                </h1>
                <h2 className="mt-4 max-w-[440px] text-lg font-semibold leading-snug text-white sm:text-xl">
                  {slide.headline}
                </h2>
                <p className="mt-2 line-clamp-2 max-w-[440px] text-sm leading-6 text-white/72 sm:text-[15px]">
                  {slide.subline}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <p className="rounded-full bg-white/10 px-3.5 py-2 text-sm font-bold text-white ring-1 ring-white/15">
                    {slide.priceLabel}
                  </p>
                  <p className="text-sm font-medium text-white/70">
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

              <div className="relative z-10 order-2 hidden min-h-[150px] items-center justify-center sm:flex md:min-h-[290px] md:justify-end">
                <Link
                  to={`/shop-details?id=${slide.id}`}
                    className="relative flex w-full max-w-[300px] items-center justify-center rounded-[1.25rem] bg-white/94 p-3 shadow-[0_24px_80px_-36px_rgba(0,0,0,0.8)] outline-offset-4 transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white md:max-w-[440px] md:p-4"
                  aria-label={`${t("homeHeroCtaViewProduct")}: ${slide.imageAlt}`}
                >
                  <span className="absolute right-3 top-3 z-10 rounded-full bg-[#FFF1F2] px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-[#BE123C]">
                    {t("homeHeroBadgeFeatured")}
                  </span>
                  <img
                    src={slide.image}
                    alt={slide.imageAlt}
                    width={320}
                    height={320}
                    className="h-[145px] w-full rounded-2xl object-cover object-center sm:h-[170px] md:h-[285px]"
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
