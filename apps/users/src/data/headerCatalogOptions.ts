import type { TranslateFn } from "../i18n/types";

export const HEADER_CATALOG_SPECS = [
  { value: "all", labelKey: "headerCatalogAll" },
  { value: "men", labelKey: "headerCatalogMen" },
  { value: "women", labelKey: "headerCatalogWomen" },
  { value: "suits", labelKey: "headerCatalogSuits" },
  { value: "dresses", labelKey: "headerCatalogDresses" },
  { value: "outerwear", labelKey: "headerCatalogOuterwear" },
  { value: "shirts", labelKey: "headerCatalogShirts" },
  { value: "shoes", labelKey: "headerCatalogShoes" },
  { value: "accessories", labelKey: "headerCatalogAccessories" },
] as const;

export type HeaderCatalogValue = (typeof HEADER_CATALOG_SPECS)[number]["value"];

export function headerCatalogOptions(t: TranslateFn) {
  return HEADER_CATALOG_SPECS.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }));
}

export function headerCatalogLabel(device: string, t: TranslateFn): string {
  const spec = HEADER_CATALOG_SPECS.find((o) => o.value === device);
  return spec ? t(spec.labelKey) : device;
}
