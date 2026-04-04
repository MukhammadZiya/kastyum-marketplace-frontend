import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { shopData } from "../../../data/shopData";
import { useT } from "../../../i18n";
import ProductItem from "../NewArrivals/ProductItem";

/** Product order so the grid differs from New Arrivals while reusing the same catalog & images. */
const FREQUENTLY_BOUGHT_ORDER = [6, 7, 4, 1, 3, 8, 2, 5] as const;

export default function FrequentlyBought() {
  const t = useT();
  const items = FREQUENTLY_BOUGHT_ORDER.map((id) =>
    shopData.find((p) => p.id === id),
  ).filter((p): p is NonNullable<typeof p> => p != null);

  return (
    <section className="overflow-hidden pt-[60px]">
      <div className="mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <span className="mb-[6px] flex items-center gap-[10px] font-medium text-neutral-900">
              <TrendingUp className="h-5 w-5 shrink-0 text-[#3C50E0]" strokeWidth={1.75} aria-hidden />
              {t("homeFrequentEyebrow")}
            </span>
            <h2 className="text-xl font-semibold text-neutral-900 xl:text-[28px]">
              {t("homeFrequentTitle")}
            </h2>
          </div>

          <Link
            to="/shop-with-sidebar"
            className="inline-flex rounded-md border border-neutral-200 bg-neutral-50 px-7 py-2.5 text-[14px] font-medium text-neutral-900 duration-200 ease-out hover:border-transparent hover:bg-neutral-900 hover:text-white"
          >
            {t("common.viewAll")}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-[30px] gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ProductItem item={item} key={`frequent-${item.id}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
