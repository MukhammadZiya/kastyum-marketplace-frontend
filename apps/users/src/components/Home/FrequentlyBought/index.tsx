import { useMemo } from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { shopData } from "../../../data/shopData";
import { useProductHomeShowcase } from "../../../hooks/products";
import { apiProductToStorefront } from "../../../lib/apiProductToStorefront";
import { useT } from "../../../i18n";
import ProductItem from "../NewArrivals/ProductItem";

/** Product order so the grid differs from New Arrivals while reusing the same catalog & images. */
const FREQUENTLY_BOUGHT_ORDER = [6, 7, 4, 1, 3, 8, 2, 5] as const;

export default function FrequentlyBought() {
  const t = useT();
  const { data: showcase } = useProductHomeShowcase();

  const items = useMemo(() => {
    if (showcase?.mostPurchased?.length) {
      return showcase.mostPurchased.map((slot) =>
        apiProductToStorefront(slot.product, {
          customPreviewPath: slot.customImage,
        }),
      );
    }
    return FREQUENTLY_BOUGHT_ORDER.map((id) =>
      shopData.find((p) => p.id === id),
    ).filter((p): p is NonNullable<typeof p> => p != null);
  }, [showcase]);

  return (
    <section className="overflow-hidden pt-12 sm:pt-16">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-8 xl:px-0">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <span className="mb-2 flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.16em] text-[#E11D48]">
              <TrendingUp className="h-5 w-5 shrink-0" strokeWidth={2.1} aria-hidden />
              {t("homeFrequentEyebrow")}
            </span>
            <h2 className="text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl">
              {t("homeFrequentTitle")}
            </h2>
          </div>

          <Link
            to="/shop-with-sidebar"
            className="inline-flex rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-[14px] font-bold text-neutral-900 shadow-sm duration-200 ease-out hover:border-transparent hover:bg-neutral-900 hover:text-white sm:px-6"
          >
            {t("common.viewAll")}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-5 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-5">
          {items.map((item) => (
            <ProductItem
              item={item}
              key={`frequent-${item.mongoId ?? String(item.id)}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
