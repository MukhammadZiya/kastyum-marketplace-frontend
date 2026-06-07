import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-[#F5F7FB] pb-8 pt-5 sm:pb-10 sm:pt-6 lg:pb-12">
      <div className="mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <HeroCarousel />
      </div>

      <HeroFeature />
    </section>
  );
}
