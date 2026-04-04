import { primaryImageForGroup } from "../../../data/lightWebpImages";

export default function PromoBanner() {
  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative z-[1] overflow-hidden rounded-lg bg-[#F5F5F7] py-[50px] lg:py-[70px] xl:py-[90px] px-4 sm:px-[30px] lg:px-14 xl:px-[76px] mb-[30px]">
          <div className="max-w-[550px] w-full">
            <span className="block font-medium text-xl text-neutral-900 mb-3">
              New season tailoring
            </span>

            <h2 className="font-bold text-xl lg:text-[32px] xl:text-[40px] text-neutral-900 mb-5">
              UP TO 30% OFF SUITS
            </h2>

            <p>
              Italian-inspired wool blends, clean shoulders, and trousers ready to hem—build
              your formal wardrobe with pieces designed for real fittings and long wear.
            </p>

            <a
              href="/shop-with-sidebar"
              className="inline-flex font-medium text-[14px] text-white bg-blue-600 py-[11px] px-[38px] rounded-md ease-out duration-200 hover:bg-blue-700 mt-[30px]"
            >
              Shop suits
            </a>
          </div>

          <img
            src={primaryImageForGroup(2)}
            alt="Featured suit"
            className="absolute bottom-0 right-4 lg:right-[104px] -z-[1]"
            width={274}
            height={350}
          />
        </div>

        <div className="grid gap-[30px] grid-cols-1 lg:grid-cols-2">
          <div className="relative z-[1] overflow-hidden rounded-lg bg-[#DBF4F3] py-10 xl:py-16 px-4 sm:px-[30px] xl:px-10">
            <img
              src={primaryImageForGroup(3)}
              alt="Smart casual tailoring"
              className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-[1]"
              width={241}
              height={241}
            />

            <div className="text-right">
              <span className="block text-lg text-neutral-900 mb-[6px]">
                Smart casual layers
              </span>

              <h2 className="font-bold text-xl lg:text-[32px] text-neutral-900 mb-[10px]">
                Elevated off-duty fits
              </h2>

              <p className="font-semibold text-[20px] text-teal-600">20% off selected blazers</p>

              <a
                href="/shop-with-sidebar?q=Beige"
                className="inline-flex font-medium text-[14px] text-white bg-teal-600 py-2.5 px-[34px] rounded-md ease-out duration-200 hover:bg-teal-700 mt-9"
              >
                Browse edit
              </a>
            </div>
          </div>

          <div className="relative z-[1] overflow-hidden rounded-lg bg-[#FFECE1] py-10 xl:py-16 px-4 sm:px-[30px] xl:px-10">
            <img
              src={primaryImageForGroup(4)}
              alt="Evening formal wear"
              className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-[34px] -z-[1]"
              width={200}
              height={200}
            />

            <div>
              <span className="block text-lg text-neutral-900 mb-[6px]">
                Evening &amp; black tie
              </span>

              <h2 className="font-bold text-xl lg:text-[32px] text-neutral-900 mb-[10px]">
                Up to <span className="text-orange-500">40%</span> off
              </h2>

              <p className="max-w-[285px] text-[14px]">
                Tuxedos and midnight suits with satin lapels, crisp shirting, and the
                accessories to finish the look.
              </p>

              <a
                href="/shop-with-sidebar?q=Tuxedo"
                className="inline-flex font-medium text-[14px] text-white bg-orange-500 py-2.5 px-[34px] rounded-md ease-out duration-200 hover:bg-orange-600 mt-[30px]"
              >
                Shop formal
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
