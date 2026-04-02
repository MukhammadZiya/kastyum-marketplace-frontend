import { useMemo, useState } from "react";
import Breadcrumb from "../components/Common/Breadcrumb";
import { shopData } from "../data/shopData";
import { useProductList } from "../hooks/products";
import { apiProductToStorefront } from "../lib/apiProductToStorefront";
import SingleGridItem from "../components/Shop/SingleGridItem";
import SingleListItem from "../components/Shop/SingleListItem";

export function ShopWithoutSidebarPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const { data, isPending } = useProductList({ page: 1, limit: 48 });

  const products = useMemo(() => {
    if (data?.list?.length) {
      return data.list.map(apiProductToStorefront);
    }
    return shopData;
  }, [data]);

  return (
    <>
      <Breadcrumb title="Explore All Products" pages={["shop", "shop without sidebar"]} />
      <section className="bg-neutral-100 py-10">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-lg border border-neutral-200 p-3 mb-6 flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              Showing{" "}
              <span className="font-medium text-neutral-900">{products.length}</span>{" "}
              products
              {isPending && !data?.list?.length ? (
                <span className="text-neutral-500"> · loading</span>
              ) : null}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={`px-3 py-1.5 rounded ${view === "grid" ? "bg-blue-600 text-white" : "bg-neutral-100"}`}
                type="button"
              >
                Grid
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 rounded ${view === "list" ? "bg-blue-600 text-white" : "bg-neutral-100"}`}
                type="button"
              >
                List
              </button>
            </div>
          </div>

          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7" : "flex flex-col gap-6"}>
            {products.map((item) =>
              view === "grid" ? (
                <SingleGridItem
                  key={item.mongoId ?? String(item.id)}
                  item={item}
                />
              ) : (
                <SingleListItem
                  key={item.mongoId ?? String(item.id)}
                  item={item}
                />
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}
