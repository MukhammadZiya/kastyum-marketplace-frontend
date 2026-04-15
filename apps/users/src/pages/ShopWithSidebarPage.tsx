import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ProductsQueryParams } from "@repo/types";
import Breadcrumb from "../components/Common/Breadcrumb";
import { headerCatalogLabel } from "../data/headerCatalogOptions";
import {
  emptyShopFilterState,
  PRICE_FILTER_SPECS,
  SHOP_DEPARTMENT_CATEGORY_LABELS,
  shopData,
  shopFilterOptionLists,
  type PriceFilterId,
  type ShopFilterState,
} from "../data/shopData";
import SingleGridItem from "../components/Shop/SingleGridItem";
import SingleListItem from "../components/Shop/SingleListItem";
import { useAllAttributes } from "../hooks/attributes";
import { useProductList } from "../hooks/products";
import { useT } from "../i18n";
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
  t,
  priceOptions,
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
  t: TranslateFn;
  priceOptions: { id: PriceFilterId; label: string }[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-neutral-900">{t("common.filters")}</h3>
        {activeFilterCount > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            {t("common.clearAll")} ({activeFilterCount})
          </button>
        ) : null}
      </div>

      <fieldset className="space-y-2 border-0 p-0">
        <legend className="mb-2 text-sm font-medium text-neutral-900">
          {t("shopFilterCategory")}
        </legend>
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
        <legend className="mb-2 text-sm font-medium text-neutral-900">
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

      <fieldset className="space-y-2 border-0 p-0">
        <legend className="mb-2 text-sm font-medium text-neutral-900">
          {t("shopFilterColor")}
        </legend>
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
        <legend className="mb-2 text-sm font-medium text-neutral-900">
          {t("shopFilterSize")}
        </legend>
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
  const t = useT();
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

  const { data: attrBundle } = useAllAttributes();

  const categories = useMemo(
    () => [...SHOP_DEPARTMENT_CATEGORY_LABELS],
    [],
  );

  const { colors: fallbackColors, sizes: fallbackSizes } = useMemo(
    () => shopFilterOptionLists(shopData),
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
    if (attrBundle?.color?.length && filters.colors.size > 0) {
      const ids = [...filters.colors]
        .map((name) => attrBundle.color!.find((c) => c.name === name)?._id)
        .filter((x): x is string => Boolean(x));
      if (ids.length === 1) p.color = ids[0];
      else if (ids.length > 1) p.colors = ids.join(",");
    }
    if (attrBundle?.size?.length && filters.sizes.size > 0) {
      const ids = [...filters.sizes]
        .map((name) => attrBundle.size!.find((s) => s.name === name)?._id)
        .filter((x): x is string => Boolean(x));
      if (ids.length === 1) p.size = ids[0];
      else if (ids.length > 1) p.sizes = ids.join(",");
    }
    return p;
  }, [q, device, filters, catParam, attrBundle]);

  const { data, isPending, isError } = useProductList(listParams);

  const products: Product[] = useMemo(() => {
    if (!data?.list?.length) return [];
    return data.list.map((row) => apiProductToStorefront(row));
  }, [data]);

  const resultTotal = data?.total ?? 0;

  const colors = useMemo(() => {
    if (attrBundle?.color?.length) {
      return [...new Set(attrBundle.color.map((c) => c.name))].sort();
    }
    return fallbackColors;
  }, [attrBundle, fallbackColors]);

  const sizes = useMemo(() => {
    if (attrBundle?.size?.length) {
      return [...new Set(attrBundle.size.map((s) => s.name))].sort();
    }
    return fallbackSizes;
  }, [attrBundle, fallbackSizes]);

  useEffect(() => {
    if (!catParam) return;
    if (!categories.includes(catParam)) return;
    setFilters((prev) => ({
      ...prev,
      categories: new Set([catParam]),
    }));
  }, [catParam, categories]);

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
        <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-blue-100 bg-blue-50/90 px-4 py-3 text-sm text-neutral-700">
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
              className="ml-auto text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {t("shopClearSearchFilters")}
            </button>
          </div>
        </div>
      ) : null}
      <section className="bg-neutral-100 py-10">
        <div className="mx-auto flex max-w-[1170px] flex-col gap-6 px-4 sm:px-8 xl:flex-row xl:gap-8 xl:px-0">
          <details className="xl:hidden rounded-lg border border-neutral-200 bg-white [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-semibold text-neutral-900">
              {t("common.filters")}
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
              <div className="flex gap-2">
                <button
                  onClick={() => setView("grid")}
                  className={`rounded px-3 py-1.5 ${view === "grid" ? "bg-blue-600 text-white" : "bg-neutral-100"}`}
                  type="button"
                >
                  {t("common.grid")}
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`rounded px-3 py-1.5 ${view === "list" ? "bg-blue-600 text-white" : "bg-neutral-100"}`}
                  type="button"
                >
                  {t("common.list")}
                </button>
              </div>
            </div>

            {isError ? (
              <div className="rounded-lg border border-dashed border-red-200 bg-white p-12 text-center text-red-800">
                <p className="font-medium">{t("shopProductListError")}</p>
              </div>
            ) : products.length === 0 && !isPending ? (
              <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-600">
                <p className="font-medium text-neutral-900">{t("shopNoProductsMatch")}</p>
                <p className="mt-2 text-sm">{t("shopAdjustFiltersHint")}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {hasHeaderSearch ? (
                    <button
                      type="button"
                      onClick={clearHeaderParams}
                      className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800 hover:bg-blue-100"
                    >
                      {t("shopClearSearchFilters")}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={onClear}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    {t("shopClearSidebarFilters")}
                  </button>
                </div>
              </div>
            ) : isPending && products.length === 0 ? (
              <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center text-neutral-600">
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
