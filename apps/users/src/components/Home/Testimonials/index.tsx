import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";

import { testimonialsData } from "../../../data/testimonialsData";
import TestimonialCard from "./SingleItem";

export default function Testimonials() {
  const sliderRef = useRef<any>(null);

  const handlePrev = useCallback(() => {
    sliderRef.current?.swiper?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    sliderRef.current?.swiper?.slideNext();
  }, []);

  return (
    <section className="overflow-hidden pb-[66px]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="swiper testimonial-carousel common-carousel p-5">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <span className="flex items-center gap-[10px] font-medium text-neutral-900 mb-[6px]">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="icon"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.49984 1.04175C5.31371 1.04175 3.5415 2.81395 3.5415 5.00008C3.5415 7.18621 5.31371 8.95842 7.49984 8.95842C9.68596 8.95842 11.4582 7.18621 11.4582 5.00008C11.4582 2.81395 9.68596 1.04175 7.49984 1.04175ZM4.7915 5.00008C4.7915 3.50431 6.00407 2.29175 7.49984 2.29175C8.99561 2.29175 10.2082 3.50431 10.2082 5.00008C10.2082 6.49585 8.99561 7.70842 7.49984 7.70842C6.00407 7.70842 4.7915 6.49585 4.7915 5.00008Z"
                    fill="#3C50E0"
                  />
                  <path
                    d="M12.4998 1.87508C12.1547 1.87508 11.8748 2.1549 11.8748 2.50008C11.8748 2.84526 12.1547 3.12508 12.4998 3.12508C13.5354 3.12508 14.3748 3.96455 14.3748 5.00008C14.3748 6.03562 13.5354 6.87508 12.4998 6.87508C12.1547 6.87508 11.8748 7.1549 11.8748 7.50008C11.8748 7.84526 12.1547 8.12508 12.4998 8.12508C14.2257 8.12508 15.6248 6.72597 15.6248 5.00008C15.6248 3.27419 14.2257 1.87508 12.4998 1.87508Z"
                    fill="#3C50E0"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.06496 11.2671C4.2311 10.6007 5.80039 10.2084 7.49984 10.2084C9.19928 10.2084 10.7686 10.6007 11.9347 11.2671C13.0832 11.9233 13.9582 12.9252 13.9582 14.1667C13.9582 15.4083 13.0832 16.4102 11.9347 17.0664C10.7686 17.7328 9.19928 18.1251 7.49984 18.1251C5.80039 18.1251 4.2311 17.7328 3.06496 17.0664C1.9165 16.4102 1.0415 15.4083 1.0415 14.1667C1.0415 12.9252 1.9165 11.9233 3.06496 11.2671ZM3.68513 12.3524C2.72234 12.9025 2.2915 13.5674 2.2915 14.1667C2.2915 14.7661 2.72234 15.431 3.68513 15.9811C4.63025 16.5212 5.97762 16.8751 7.49984 16.8751C9.02205 16.8751 10.3694 16.5212 11.3145 15.9811C12.2773 15.431 12.7082 14.7661 12.7082 14.1667C12.7082 13.5674 12.2773 12.9025 11.3145 12.3524C10.3694 11.8123 9.02205 11.4584 7.49984 11.4584C5.97762 11.4584 4.63025 11.8123 3.68513 12.3524Z"
                    fill="#3C50E0"
                  />
                </svg>
                Testimonials
              </span>
              <h2 className="font-semibold text-xl xl:text-[28px] text-neutral-900">
                What our shoppers say
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="flex items-center justify-center w-10 h-10 rounded-md border border-neutral-200 bg-white hover:bg-neutral-50"
                aria-label="Previous"
                type="button"
              >
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.4881 4.43057C15.8026 4.70014 15.839 5.17361 15.5694 5.48811L9.98781 12L15.5694 18.5119C15.839 18.8264 15.8026 19.2999 15.4881 19.5695C15.1736 19.839 14.7001 19.8026 14.4306 19.4881L8.43056 12.4881C8.18981 12.2072 8.18981 11.7928 8.43056 11.5119L14.4306 4.51192C14.7001 4.19743 15.1736 4.161 15.4881 4.43057Z"
                    fill=""
                  />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center justify-center w-10 h-10 rounded-md border border-neutral-200 bg-white hover:bg-neutral-50"
                aria-label="Next"
                type="button"
              >
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.51192 4.43057C8.82641 4.161 9.29989 4.19743 9.56946 4.51192L15.5695 11.5119C15.8102 11.7928 15.8102 12.2072 15.5695 12.4881L9.56946 19.4881C9.29989 19.8026 8.82641 19.839 8.51192 19.5695C8.19743 19.2999 8.161 18.8264 8.43057 18.5119L14.0122 12L8.43057 5.48811C8.161 5.17361 8.19743 4.70014 8.51192 4.43057Z"
                    fill=""
                  />
                </svg>
              </button>
            </div>
          </div>

          <Swiper
            ref={sliderRef}
            slidesPerView={3}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1 },
              1000: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
          >
            {testimonialsData.map((item) => (
              <SwiperSlide key={item.id}>
                <TestimonialCard testimonial={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

