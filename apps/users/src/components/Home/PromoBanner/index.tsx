import { primaryImageForGroup } from "../../../data/lightWebpImages";
import { useT } from "../../../i18n";

export default function PromoBanner() {
  const t = useT();

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative z-[1] overflow-hidden rounded-lg bg-[#F5F5F7] py-[50px] lg:py-[70px] xl:py-[90px] px-4 sm:px-[30px] lg:px-14 xl:px-[76px] mb-[30px]">
          <div className="max-w-[550px] w-full">
            <span className="block font-medium text-xl text-neutral-900 mb-3">
              {t("promoMainEyebrow")}
            </span>

            <h2 className="font-bold text-xl lg:text-[32px] xl:text-[40px] text-neutral-900 mb-5">
              {t("promoMainTitle")}
            </h2>

            <p>{t("promoMainBody")}</p>

            <a
              href="/shop-with-sidebar"
              className="inline-flex font-medium text-[14px] text-white bg-[#E11D48] py-[11px] px-[38px] rounded-md ease-out duration-200 hover:bg-[#BE123C] mt-[30px]"
            >
              {t("promoMainCta")}
            </a>
          </div>

          <img
            src={primaryImageForGroup(2)}
            alt={t("promoMainImageAlt")}
            className="absolute bottom-0 right-4 lg:right-[104px] -z-[1]"
            width={274}
            height={350}
          />
        </div>

        <div className="grid gap-[30px] grid-cols-1 lg:grid-cols-2">
          <div className="relative z-[1] overflow-hidden rounded-lg bg-[#DBF4F3] py-10 xl:py-16 px-4 sm:px-[30px] xl:px-10">
            <img
              src={primaryImageForGroup(3)}
              alt={t("promoSecondaryLeftImageAlt")}
              className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-[1]"
              width={241}
              height={241}
            />

            <div className="text-right">
              <span className="block text-lg text-neutral-900 mb-[6px]">
                {t("promoSecondaryLeftEyebrow")}
              </span>

              <h2 className="font-bold text-xl lg:text-[32px] text-neutral-900 mb-[10px]">
                {t("promoSecondaryLeftTitle")}
              </h2>

              <p className="font-semibold text-[20px] text-teal-600">
                {t("promoSecondaryLeftDiscount")}
              </p>

              <a
                href="/shop-with-sidebar?q=Beige"
                className="inline-flex font-medium text-[14px] text-white bg-teal-600 py-2.5 px-[34px] rounded-md ease-out duration-200 hover:bg-teal-700 mt-9"
              >
                {t("promoSecondaryLeftCta")}
              </a>
            </div>
          </div>

          <div className="relative z-[1] overflow-hidden rounded-lg bg-[#FFF1F2] py-10 xl:py-16 px-4 sm:px-[30px] xl:px-10">
            <img
              src={primaryImageForGroup(4)}
              alt={t("promoSecondaryRightImageAlt")}
              className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-[34px] -z-[1]"
              width={200}
              height={200}
            />

            <div>
              <span className="block text-lg text-neutral-900 mb-[6px]">
                {t("promoSecondaryRightEyebrow")}
              </span>

              <h2 className="font-bold text-xl lg:text-[32px] text-neutral-900 mb-[10px]">
                {t("promoSecondaryRightTitlePrefix")}{" "}
                <span className="text-[#E11D48]">
                  {t("promoSecondaryRightDiscountHighlight")}
                </span>{" "}
                {t("promoSecondaryRightTitleSuffix")}
              </h2>

              <p className="max-w-[285px] text-[14px]">{t("promoSecondaryRightBody")}</p>

              <a
                href="/shop-with-sidebar?q=Tuxedo"
                className="inline-flex font-medium text-[14px] text-white bg-[#E11D48] py-2.5 px-[34px] rounded-md ease-out duration-200 hover:bg-[#BE123C] mt-[30px]"
              >
                {t("promoSecondaryRightCta")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
