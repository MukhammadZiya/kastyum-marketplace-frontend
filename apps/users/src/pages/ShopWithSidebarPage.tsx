import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import type { ProductsQueryParams } from "@repo/types";
import Breadcrumb from "../components/Common/Breadcrumb";
import { headerCatalogLabel } from "../data/headerCatalogOptions";
import {
  departmentCategoryLabel,
  emptyShopFilterState,
  PRICE_FILTER_SPECS,
  SHOP_DEPARTMENT_CATEGORY_LABELS,
  type PriceFilterId,
  type ShopFilterState,
} from "../data/shopData";
import SingleGridItem from "../components/Shop/SingleGridItem";
import SingleListItem from "../components/Shop/SingleListItem";
import { useProductList } from "../hooks/products";
import { useI18nState, useT } from "../i18n";
import type { TranslateFn } from "../i18n/types";
import { apiProductToStorefront } from "../lib/apiProductToStorefront";
import type { Product } from "../types/product";

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
      className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 transition duration-150 hover:bg-[#FFF1F2] hover:text-[#BE123C]"
    >
      <span>{label}</span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 rounded border-neutral-300 accent-[#E11D48] focus:ring-[#FDA4AF]"
      />
    </label>
  );
}

function ShopFiltersBody({
  filters,
  onToggleCategory,
  onTogglePrice,
  onClear,
  categories,
  activeFilterCount,
  t,
  priceOptions,
  showHeading = true,
}: {
  filters: ShopFilterState;
  onToggleCategory: (v: string) => void;
  onTogglePrice: (v: PriceFilterId) => void;
  onClear: () => void;
  categories: string[];
  activeFilterCount: number;
  t: TranslateFn;
  priceOptions: { id: PriceFilterId; label: string }[];
  showHeading?: boolean;
}) {
  const clearButton = (
    <button
      type="button"
      onClick={onClear}
      className="rounded-full bg-[#FFF1F2] px-3 py-1 text-xs font-black text-[#BE123C] transition hover:bg-[#FFE4E6]"
    >
      {t("common.clearAll")} ({activeFilterCount})
    </button>
  );

  return (
    <div className="space-y-6">
      {showHeading ? (
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-black tracking-tight text-neutral-950">
            {t("common.filters")}
          </h3>
          {activeFilterCount > 0 ? clearButton : null}
        </div>
      ) : activeFilterCount > 0 ? (
        <div className="flex justify-end">{clearButton}</div>
      ) : null}

      <fieldset
        className={`space-y-2 border-0 p-0 ${showHeading ? "border-t border-neutral-100 pt-5" : ""}`}
      >
        <legend className="mb-2 text-[12px] font-black uppercase tracking-[0.14em] text-neutral-400">
          {t("shopFilterCategory")}
        </legend>
        <div className="space-y-2">
          {categories.map((cat) => (
            <FilterCheckbox
              key={cat}
              id={`cat-${cat}`}
              label={departmentCategoryLabel(cat, t)}
              checked={filters.categories.has(cat)}
              onChange={() => onToggleCategory(cat)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2 border-0 border-t border-neutral-100 p-0 pt-5">
        <legend className="mb-2 text-[12px] font-black uppercase tracking-[0.14em] text-neutral-400">
          {t("shopFilterPrice")}
        </legend>
        <p className="mb-2 text-xs text-neutral-500">{t("shopFilterPriceHint")}</p>
        <div className="space-y-2">
          {priceOptions.map((opt) => (
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

    </div>
  );
}

export function ShopWithSidebarPage() {
  const t = useT();
  const { locale } = useI18nState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<ShopFilterState>(emptyShopFilterState);

  const device = searchParams.get("device");
  const q = searchParams.get("q") ?? "";
  const catParam = searchParams.get("cat");

  const priceOptions = useMemo(
    () =>
      PRICE_FILTER_SPECS.map(({ id, labelKey }) => ({
        id,
        label: t(labelKey),
      })),
    [t],
  );

  const deviceLabel = useMemo(() => {
    if (!device) return "";
    return headerCatalogLabel(device, t);
  }, [device, t]);

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

  const categories = useMemo(
    () => [...SHOP_DEPARTMENT_CATEGORY_LABELS],
    [],
  );

  const listParams = useMemo((): ProductsQueryParams => {
    const p: ProductsQueryParams = { page: 1, limit: 48 };
    const qt = q.trim();
    if (qt) p.q = qt;
    if (device && device !== "all") p.device = device;
    const deptFromFilters = [...filters.categories];
    if (deptFromFilters.length > 0) {
      p.departmentCategories = deptFromFilters.join(",");
    } else if (
      catParam?.trim() &&
      (SHOP_DEPARTMENT_CATEGORY_LABELS as readonly string[]).includes(catParam.trim())
    ) {
      p.departmentCategories = catParam.trim();
    }
    if (filters.priceBuckets.size > 0) {
      p.priceBuckets = [...filters.priceBuckets].join(",");
    }
    return p;
  }, [q, device, filters, catParam]);

  const { data, isPending, isError } = useProductList(listParams);

  const products: Product[] = useMemo(() => {
    if (!data?.list?.length) return [];
    return data.list.map((row) => apiProductToStorefront(row, { locale }));
  }, [data, locale]);

  const resultTotal = data?.total ?? 0;

  useEffect(() => {
    if (!catParam) return;
    const trimmed = catParam.trim();
    if (
      !(SHOP_DEPARTMENT_CATEGORY_LABELS as readonly string[]).includes(trimmed)
    ) {
      return;
    }
    setFilters((prev) => ({
      ...prev,
      categories: new Set([trimmed]),
    }));
  }, [catParam]);

  const activeFilterCount = useMemo(() => {
    return (
      filters.categories.size +
      filters.priceBuckets.size
    );
  }, [filters]);

  const onToggleCategory = useCallback((v: string) => {
    setFilters((prev) => toggleSetKey("categories", v, prev));
  }, []);
  const onTogglePrice = useCallback((v: PriceFilterId) => {
    setFilters((prev) => toggleSetKey("priceBuckets", v, prev));
  }, []);
  const onClear = useCallback(() => setFilters(emptyShopFilterState()), []);

  const filterBodyProps = {
    filters,
    onToggleCategory,
    onTogglePrice,
    onClear,
    categories,
    activeFilterCount,
    t,
    priceOptions,
  };

  return (
    <>
      <Breadcrumb
        title={t("shopBreadcrumbCollection")}
        pages={[t("breadcrumbShop"), t("shopBreadcrumbAllPieces")]}
      />
      {hasHeaderSearch ? (
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8 xl:px-0">
          <div className="mb-4 mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-[#FFE4EA] bg-white px-4 py-3 text-sm text-neutral-700 shadow-[0_14px_42px_-36px_rgba(15,23,42,0.45)]">
            <span className="font-medium text-neutral-900">
              {t("shopSearchFiltersLabel")}
            </span>
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
              className="ml-auto text-sm font-black text-[#BE123C] hover:text-[#E11D48]"
            >
              {t("shopClearSearchFilters")}
            </button>
          </div>
        </div>
      ) : null}
      <section className="bg-[#FAFAFB] py-8 sm:py-10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 sm:px-8 xl:flex-row xl:gap-8 xl:px-0">
          <details className="group rounded-xl border border-neutral-200 bg-white shadow-[0_20px_70px_-58px_rgba(15,23,42,0.5)] xl:hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-black text-neutral-900">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-neutral-400" strokeWidth={2.2} />
                {t("common.filters")}
                {activeFilterCount > 0 ? (
                  <span className="rounded-full bg-[#E11D48] px-2 py-0.5 text-xs font-black text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </span>
              <ChevronDown
                className="h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-180"
                strokeWidth={2.2}
              />
            </summary>
            <div className="border-t border-neutral-100 p-5 pt-4">
              <ShopFiltersBody {...filterBodyProps} showHeading={false} />
            </div>
          </details>

          <aside className="hidden h-fit w-[282px] shrink-0 rounded-xl border border-neutral-200 bg-white p-5 shadow-[0_18px_70px_-58px_rgba(15,23,42,0.55)] xl:block">
            <ShopFiltersBody {...filterBodyProps} />
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-[0_16px_60px_-54px_rgba(15,23,42,0.5)] sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-600" aria-live="polite">
                {t("common.showing")}{" "}
                <span className="font-medium text-neutral-900">{resultTotal}</span>{" "}
                {resultTotal === 1 ? t("common.productSingular") : t("common.productPlural")}
                {isPending ? (
                  <span className="text-neutral-500"> · {t("common.loading")}</span>
                ) : null}
                {activeFilterCount > 0 || hasHeaderSearch ? (
                  <span className="text-neutral-500"> {t("common.filtered")}</span>
                ) : null}
              </p>
              <div className="grid grid-cols-2 overflow-hidden rounded-xl bg-neutral-100 p-1 text-sm font-black">
                <button
                  onClick={() => setView("grid")}
                  className={`rounded-lg px-3 py-1.5 transition ${view === "grid" ? "bg-neutral-950 text-white shadow-sm" : "text-neutral-600 hover:text-neutral-950"}`}
                  type="button"
                >
                  {t("common.grid")}
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`rounded-lg px-3 py-1.5 transition ${view === "list" ? "bg-neutral-950 text-white shadow-sm" : "text-neutral-600 hover:text-neutral-950"}`}
                  type="button"
                >
                  {t("common.list")}
                </button>
              </div>
            </div>

            {isError ? (
              <div className="rounded-2xl border border-dashed border-red-200 bg-white p-12 text-center text-red-800">
                <p className="font-medium">{t("shopProductListError")}</p>
              </div>
            ) : products.length === 0 && !isPending ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-600">
                <p className="font-medium text-neutral-900">{t("shopNoProductsMatch")}</p>
                <p className="mt-2 text-sm">{t("shopAdjustFiltersHint")}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {hasHeaderSearch ? (
                    <button
                      type="button"
                      onClick={clearHeaderParams}
                      className="rounded-xl border border-[#FFE4EA] bg-[#FFF1F2] px-4 py-2 text-sm font-black text-[#BE123C] hover:bg-[#FFE4EA]"
                    >
                      {t("shopClearSearchFilters")}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={onClear}
                    className="rounded-xl bg-neutral-950 px-4 py-2 text-sm font-black text-white hover:bg-neutral-800"
                  >
                    {t("shopClearSidebarFilters")}
                  </button>
                </div>
              </div>
            ) : isPending && products.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center text-neutral-600">
                {t("common.loading")}
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
            )}
          </div>
        </div>
      </section>
    </>
  );
}
