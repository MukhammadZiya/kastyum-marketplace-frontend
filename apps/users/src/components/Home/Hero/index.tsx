import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";

export default function Hero() {
  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-8 sm:pt-10 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-[1] rounded-[10px] bg-white overflow-hidden">
              <img
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-[1]"
                width={534}
                height={520}
              />

              <HeroCarousel />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-[30px]">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-semibold text-neutral-900 text-xl mb-20">
                      <a href="#"> iPhone 14 Plus &amp; 14 Pro Max </a>
                    </h2>

                    <div>
                      <p className="font-medium text-neutral-500 text-[14px] mb-[6px]">
                        limited time offer
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-[24px] text-red-600">
                          $699
                        </span>
                        <span className="font-medium text-2xl text-neutral-400 line-through">
                          $999
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <img
                      src="/images/hero/hero-02.png"
                      alt="mobile"
                      width={123}
                      height={161}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-[30px]">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-semibold text-neutral-900 text-xl mb-20">
                      <a href="#"> Wireless Headphone </a>
                    </h2>

                    <div>
                      <p className="font-medium text-neutral-500 text-[14px] mb-[6px]">
                        limited time offer
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-[24px] text-red-600">
                          $699
                        </span>
                        <span className="font-medium text-2xl text-neutral-400 line-through">
                          $999
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <img
                      src="/images/hero/hero-01.png"
                      alt="headphone"
                      width={123}
                      height={161}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HeroFeature />
    </section>
  );
}

