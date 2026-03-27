export default function PromoBanner() {
  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative z-[1] overflow-hidden rounded-lg bg-[#F5F5F7] py-[50px] lg:py-[70px] xl:py-[90px] px-4 sm:px-[30px] lg:px-14 xl:px-[76px] mb-[30px]">
          <div className="max-w-[550px] w-full">
            <span className="block font-medium text-xl text-neutral-900 mb-3">
              Apple iPhone 14 Plus
            </span>

            <h2 className="font-bold text-xl lg:text-[32px] xl:text-[40px] text-neutral-900 mb-5">
              UP TO 30% OFF
            </h2>

            <p>
              iPhone 14 has the same superspeedy chip that’s in iPhone 13 Pro, A15
              Bionic, with a 5‑core GPU, powers all the latest features.
            </p>

            <a
              href="#"
              className="inline-flex font-medium text-[14px] text-white bg-blue-600 py-[11px] px-[38px] rounded-md ease-out duration-200 hover:bg-blue-700 mt-[30px]"
            >
              Buy Now
            </a>
          </div>

          <img
            src="/images/promo/promo-01.png"
            alt="promo"
            className="absolute bottom-0 right-4 lg:right-[104px] -z-[1]"
            width={274}
            height={350}
          />
        </div>

        <div className="grid gap-[30px] grid-cols-1 lg:grid-cols-2">
          <div className="relative z-[1] overflow-hidden rounded-lg bg-[#DBF4F3] py-10 xl:py-16 px-4 sm:px-[30px] xl:px-10">
            <img
              src="/images/promo/promo-02.png"
              alt="promo"
              className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-[1]"
              width={241}
              height={241}
            />

            <div className="text-right">
              <span className="block text-lg text-neutral-900 mb-[6px]">
                Foldable Motorised Treadmill
              </span>

              <h2 className="font-bold text-xl lg:text-[32px] text-neutral-900 mb-[10px]">
                Workout At Home
              </h2>

              <p className="font-semibold text-[20px] text-teal-600">Flat 20% off</p>

              <a
                href="#"
                className="inline-flex font-medium text-[14px] text-white bg-teal-600 py-2.5 px-[34px] rounded-md ease-out duration-200 hover:bg-teal-700 mt-9"
              >
                Grab Now
              </a>
            </div>
          </div>

          <div className="relative z-[1] overflow-hidden rounded-lg bg-[#FFECE1] py-10 xl:py-16 px-4 sm:px-[30px] xl:px-10">
            <img
              src="/images/promo/promo-03.png"
              alt="promo"
              className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-[34px] -z-[1]"
              width={200}
              height={200}
            />

            <div>
              <span className="block text-lg text-neutral-900 mb-[6px]">
                Apple Watch Ultra
              </span>

              <h2 className="font-bold text-xl lg:text-[32px] text-neutral-900 mb-[10px]">
                Up to <span className="text-orange-500">40%</span> off
              </h2>

              <p className="max-w-[285px] text-[14px]">
                The aerospace-grade titanium case strikes the perfect balance of
                everything.
              </p>

              <a
                href="#"
                className="inline-flex font-medium text-[14px] text-white bg-orange-500 py-2.5 px-[34px] rounded-md ease-out duration-200 hover:bg-orange-600 mt-[30px]"
              >
                Buy Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

