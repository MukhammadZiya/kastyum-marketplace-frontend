import { useMemo } from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { useProductHomeShowcase, useProductList } from "../../../hooks/products";
import { apiProductToStorefront } from "../../../lib/apiProductToStorefront";
import { useI18n } from "../../../i18n";
import ProductItem from "../NewArrivals/ProductItem";

const SKELETON_COUNT = 5;

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-3 aspect-[3/4] rounded-2xl bg-neutral-100" />
      <div className="mb-1.5 h-3 w-2/3 rounded bg-neutral-100" />
      <div className="h-4 w-1/2 rounded bg-neutral-100" />
    </div>
  );
}

export default function FrequentlyBought() {
  const { locale, t } = useI18n();
  const { data: showcase, isPending: showcasePending } = useProductHomeShowcase();
  const { data: listData, isPending: listPending } = useProductList({ page: 1, limit: 8 });

  const isPending = showcasePending || listPending;

  const items = useMemo(() => {
    if (!showcase && !listData) return [];
    if (showcase?.mostPurchased?.length) {
      return showcase.mostPurchased.map((slot) =>
        apiProductToStorefront(slot.product, { customPreviewPath: slot.customImage, locale }),
      );
    }
    return (listData?.list ?? []).map((p) => apiProductToStorefront(p, { locale })).slice(0, 8);
  }, [showcase, listData, locale]);

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
          {isPending
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            : items.map((item) => (
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
