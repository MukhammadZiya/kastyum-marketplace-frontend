import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { HEADER_CATALOG_OPTIONS } from "../data/headerCatalogOptions";
import {
  emptyShopFilterState,
  filterByHeaderCatalog,
  filterByTitleSearch,
  filterShopProducts,
  PRICE_FILTER_OPTIONS,
  shopData,
  shopFilterOptionLists,
  type PriceFilterId,
  type ShopFilterState,
} from "../data/shopData";
import SingleGridItem from "../components/Shop/SingleGridItem";
import SingleListItem from "../components/Shop/SingleListItem";

function toggleSetKey<K extends keyof ShopFilterState>(
  key: K,
  value: ShopFilterState[K] extends Set<infer V> ? V : never,
  prev: ShopFilterState,
): ShopFilterState {
  const prevSet = prev[key] as Set<string | PriceFilterId>;
  const nextSet = new Set(prevSet);
  if (nextSet.has(value as never)) nextSet.delete(value as never);
  else nextSet.add(value as never);
  return { ...prev, [key]: nextSet };
}

type FilterCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
};

function FilterCheckbox({ id, label, checked, onChange }: FilterCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
      />
      <span>{label}</span>
    </label>
  );
}

function ShopFiltersBody({
  filters,
  onToggleCategory,
  onTogglePrice,
  onToggleColor,
  onToggleSize,
  onClear,
  categories,
  colors,
  sizes,
  activeFilterCount,
}: {
  filters: ShopFilterState;
  onToggleCategory: (v: string) => void;
  onTogglePrice: (v: PriceFilterId) => void;
  onToggleColor: (v: string) => void;
  onToggleSize: (v: string) => void;
  onClear: () => void;
  categories: string[];
  colors: string[];
  sizes: string[];
  activeFilterCount: number;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-neutral-900">Filters</h3>
        {activeFilterCount > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            Clear all ({activeFilterCount})
          </button>
        ) : null}
      </div>

      <fieldset className="space-y-2 border-0 p-0">
        <legend className="mb-2 text-sm font-medium text-neutral-900">Category</legend>
        <div className="space-y-2">
          {categories.map((cat) => (
            <FilterCheckbox
              key={cat}
              id={`cat-${cat}`}
              label={cat}
              checked={filters.categories.has(cat)}
              onChange={() => onToggleCategory(cat)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2 border-0 p-0">
        <legend className="mb-2 text-sm font-medium text-neutral-900">Price</legend>
        <p className="mb-2 text-xs text-neutral-500">Based on current sale price</p>
        <div className="space-y-2">
          {PRICE_FILTER_OPTIONS.map((opt) => (
            <FilterCheckbox
              key={opt.id}
              id={`price-${opt.id}`}
              label={opt.label}
              checked={filters.priceBuckets.has(opt.id)}
              onChange={() => onTogglePrice(opt.id)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2 border-0 p-0">
        <legend className="mb-2 text-sm font-medium text-neutral-900">Color</legend>
        <div className="space-y-2">
          {colors.map((color) => (
            <FilterCheckbox
              key={color}
              id={`color-${color}`}
              label={color}
              checked={filters.colors.has(color)}
              onChange={() => onToggleColor(color)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2 border-0 p-0">
        <legend className="mb-2 text-sm font-medium text-neutral-900">Size</legend>
        <div className="space-y-2">
          {sizes.map((size) => (
            <FilterCheckbox
              key={size}
              id={`size-${size}`}
              label={size}
              checked={filters.sizes.has(size)}
              onChange={() => onToggleSize(size)}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export function ShopWithSidebarPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<ShopFilterState>(emptyShopFilterState);

  const device = searchParams.get("device");
  const q = searchParams.get("q") ?? "";

  const deviceLabel = useMemo(() => {
    if (!device) return "";
    const opt = HEADER_CATALOG_OPTIONS.find((o) => o.value === device);
    return opt?.label ?? device;
  }, [device]);

  const hasHeaderSearch = Boolean(
    (device && device !== "all") || q.trim().length > 0,
  );

  const clearHeaderParams = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("device");
      next.delete("q");
      return next;
    });
  }, [setSearchParams]);

  const { categories, colors, sizes } = useMemo(
    () => shopFilterOptionLists(shopData),
    [],
  );

  const products = useMemo(() => {
    let list = filterShopProducts(shopData, filters);
    list = filterByHeaderCatalog(list, device);
    list = filterByTitleSearch(list, q);
    return list;
  }, [filters, device, q]);

  const activeFilterCount = useMemo(() => {
    return (
      filters.categories.size +
      filters.priceBuckets.size +
      filters.colors.size +
      filters.sizes.size
    );
  }, [filters]);

  const onToggleCategory = useCallback((v: string) => {
    setFilters((prev) => toggleSetKey("categories", v, prev));
  }, []);
  const onTogglePrice = useCallback((v: PriceFilterId) => {
    setFilters((prev) => toggleSetKey("priceBuckets", v, prev));
  }, []);
  const onToggleColor = useCallback((v: string) => {
    setFilters((prev) => toggleSetKey("colors", v, prev));
  }, []);
  const onToggleSize = useCallback((v: string) => {
    setFilters((prev) => toggleSetKey("sizes", v, prev));
  }, []);
  const onClear = useCallback(() => setFilters(emptyShopFilterState()), []);

  const filterBodyProps = {
    filters,
    onToggleCategory,
    onTogglePrice,
    onToggleColor,
    onToggleSize,
    onClear,
    categories,
    colors,
    sizes,
    activeFilterCount,
  };

  return (
    <>
      <Breadcrumb title="Explore All Products" pages={["shop", "shop with sidebar"]} />
      {hasHeaderSearch ? (
        <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-blue-100 bg-blue-50/90 px-4 py-3 text-sm text-neutral-700">
            <span className="font-medium text-neutral-900">Header search</span>
            {device && device !== "all" ? (
              <span className="rounded-md bg-white px-2 py-0.5 text-neutral-800 ring-1 ring-neutral-200/80">
                {deviceLabel}
              </span>
            ) : null}
            {q.trim() ? (
              <span className="text-neutral-600">
                “<span className="font-medium text-neutral-900">{q.trim()}</span>”
              </span>
            ) : null}
            <button
              type="button"
              onClick={clearHeaderParams}
              className="ml-auto text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Clear header search
            </button>
          </div>
        </div>
      ) : null}
      <section className="bg-neutral-100 py-10">
        <div className="mx-auto flex max-w-[1170px] flex-col gap-6 px-4 sm:px-8 xl:flex-row xl:gap-8 xl:px-0">
          <details className="xl:hidden rounded-lg border border-neutral-200 bg-white [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-semibold text-neutral-900">
              Filters
              {activeFilterCount > 0 ? (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                  {activeFilterCount}
                </span>
              ) : null}
            </summary>
            <div className="border-t border-neutral-100 p-5 pt-2">
              <ShopFiltersBody {...filterBodyProps} />
            </div>
          </details>

          <aside className="hidden h-fit w-[270px] shrink-0 rounded-lg border border-neutral-200 bg-white p-5 xl:block">
            <ShopFiltersBody {...filterBodyProps} />
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3">
              <p className="text-sm text-neutral-600" aria-live="polite">
                Showing{" "}
                <span className="font-medium text-neutral-900">{products.length}</span>{" "}
                {products.length === 1 ? "product" : "products"}
                {activeFilterCount > 0 || hasHeaderSearch ? (
                  <span className="text-neutral-500"> (filtered)</span>
                ) : null}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setView("grid")}
                  className={`rounded px-3 py-1.5 ${view === "grid" ? "bg-blue-600 text-white" : "bg-neutral-100"}`}
                  type="button"
                >
                  Grid
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`rounded px-3 py-1.5 ${view === "list" ? "bg-blue-600 text-white" : "bg-neutral-100"}`}
                  type="button"
                >
                  List
                </button>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-600">
                <p className="font-medium text-neutral-900">No products match these filters</p>
                <p className="mt-2 text-sm">
                  Adjust the sidebar, or clear the header category / search text.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {hasHeaderSearch ? (
                    <button
                      type="button"
                      onClick={clearHeaderParams}
                      className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800 hover:bg-blue-100"
                    >
                      Clear header search
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={onClear}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Clear sidebar filters
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
                    : "flex flex-col gap-6"
                }
              >
                {products.map((item) =>
                  view === "grid" ? (
                    <SingleGridItem key={item.id} item={item} />
                  ) : (
                    <SingleListItem key={item.id} item={item} />
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
