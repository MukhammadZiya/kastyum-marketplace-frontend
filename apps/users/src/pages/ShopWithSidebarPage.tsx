import { useMemo, useState } from "react";
import Breadcrumb from "../components/Common/Breadcrumb";
import { shopData } from "../data/shopData";
import SingleGridItem from "../components/Shop/SingleGridItem";
import SingleListItem from "../components/Shop/SingleListItem";

export function ShopWithSidebarPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const products = useMemo(() => shopData, []);

  return (
    <>
      <Breadcrumb title="Explore All Products" pages={["shop", "shop with sidebar"]} />
      <section className="bg-neutral-100 py-10">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 flex gap-8">
          <aside className="hidden xl:block w-[270px] bg-white rounded-lg border border-neutral-200 p-5 h-fit">
            <h3 className="font-semibold text-neutral-900 mb-3">Filters</h3>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>Category</p>
              <p>Price</p>
              <p>Color</p>
              <p>Size</p>
            </div>
          </aside>

          <div className="flex-1">
            <div className="bg-white rounded-lg border border-neutral-200 p-3 mb-6 flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                Showing <span className="text-neutral-900">{products.length}</span> products
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

            <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7" : "flex flex-col gap-6"}>
              {products.map((item) =>
                view === "grid" ? (
                  <SingleGridItem key={item.id} item={item} />
                ) : (
                  <SingleListItem key={item.id} item={item} />
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

