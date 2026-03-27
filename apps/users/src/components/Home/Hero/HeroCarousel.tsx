import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function HeroCarousel() {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      <SwiperSlide>
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-[60px] lg:py-[98px] pl-4 sm:pl-[30px] lg:pl-[50px]">
            <div className="flex items-center gap-4 mb-[30px] sm:mb-10">
              <span className="block font-semibold text-[44px] sm:text-[64px] text-blue-600">
                30%
              </span>
              <span className="block text-neutral-900 text-sm sm:text-[20px] sm:leading-[24px]">
                Sale
                <br />
                Off
              </span>
            </div>

            <h1 className="font-semibold text-neutral-900 text-xl sm:text-3xl mb-3">
              <a href="#">True Wireless Noise Cancelling Headphone</a>
            </h1>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at ipsum
              at risus euismod lobortis in
            </p>

            <a
              href="#"
              className="inline-flex font-medium text-white text-[14px] rounded-md bg-neutral-900 py-3 px-9 ease-out duration-200 hover:bg-blue-600 mt-10"
            >
              Shop Now
            </a>
          </div>

          <div>
            <img
              src="/images/hero/hero-01.png"
              alt="headphone"
              width={351}
              height={358}
            />
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-[60px] lg:py-[104px] pl-4 sm:pl-[30px] lg:pl-[50px]">
            <div className="flex items-center gap-4 mb-[30px] sm:mb-10">
              <span className="block font-semibold text-[44px] sm:text-[64px] text-blue-600">
                30%
              </span>
              <span className="block text-neutral-900 text-sm sm:text-[20px] sm:leading-[24px]">
                Sale
                <br />
                Off
              </span>
            </div>

            <h1 className="font-semibold text-neutral-900 text-xl sm:text-3xl mb-3">
              <a href="#">True Wireless Noise Cancelling Headphone</a>
            </h1>

            <p>
              Lorem ipsum dolor sit, consectetur elit nunc suscipit non ipsum nec
              suscipit.
            </p>

            <a
              href="#"
              className="inline-flex font-medium text-white text-[14px] rounded-md bg-neutral-900 py-3 px-9 ease-out duration-200 hover:bg-blue-600 mt-10"
            >
              Shop Now
            </a>
          </div>

          <div>
            <img
              src="/images/hero/hero-01.png"
              alt="headphone"
              width={351}
              height={358}
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}

