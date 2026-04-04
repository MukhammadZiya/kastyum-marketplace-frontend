import { useMemo } from "react";
import { Link } from "react-router-dom";
import { shopData } from "../../../data/shopData";
import { useProductList } from "../../../hooks/products";
import { apiProductToStorefront } from "../../../lib/apiProductToStorefront";
import { useT } from "../../../i18n";
import ProductItem from "./ProductItem";

export default function NewArrivals() {
  const t = useT();
  const { data, isPending } = useProductList({ page: 1, limit: 8 });
  const hasListItems = Boolean(data?.list?.length);

  const items = useMemo(() => {
    if (data?.list?.length) {
      return data.list.map(apiProductToStorefront);
    }
    return shopData.slice(0, 8);
  }, [data]);

  return (
    <section className="overflow-hidden pt-[60px]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-[10px] font-medium text-neutral-900 mb-[6px]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.11826 15.4622C4.11794 16.6668 5.97853 16.6668 9.69971 16.6668H10.3007C14.0219 16.6668 15.8825 16.6668 16.8821 15.4622M3.11826 15.4622C2.11857 14.2577 2.46146 12.429 3.14723 8.77153C3.63491 6.17055 3.87875 4.87006 4.8045 4.10175M16.8821 15.4622C17.8818 14.2577 17.5389 12.429 16.8532 8.77153C16.3655 6.17055 16.1216 4.87006 15.1959 4.10175M15.1959 4.10175C14.2701 3.33345 12.947 3.33345 10.3007 3.33345H9.69971C7.0534 3.33345 5.73025 3.33345 4.8045 4.10175"
                  stroke="#3C50E0"
                  strokeWidth="1.5"
                />
                <path
                  d="M7.64258 6.66678C7.98578 7.63778 8.91181 8.33345 10.0003 8.33345C11.0888 8.33345 12.0149 7.63778 12.3581 6.66678"
                  stroke="#3C50E0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {t("homeNewArrivalsEyebrow")}
            </span>
            <h2 className="font-semibold text-xl xl:text-[28px] text-neutral-900">
              {t("homeNewArrivalsTitle")}
            </h2>
          </div>

          <Link
            to="/shop-with-sidebar"
            className="inline-flex font-medium text-[14px] py-2.5 px-7 rounded-md border-neutral-200 border bg-neutral-50 text-neutral-900 ease-out duration-200 hover:bg-neutral-900 hover:text-white hover:border-transparent"
          >
            {t("common.viewAll")}
          </Link>
        </div>

        {isPending && !hasListItems ? (
          <p className="text-sm text-neutral-600 py-8">{t("common.loadingProducts")}</p>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[30px] gap-y-9">
          {items.map((item) => (
            <ProductItem
              item={item}
              key={item.mongoId ?? String(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
