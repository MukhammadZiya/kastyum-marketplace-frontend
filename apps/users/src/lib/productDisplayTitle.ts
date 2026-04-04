import type { TranslateFn } from "../i18n/types";
import type { Product } from "../types/product";

export type ProductWithOptionalTitleKey = Product & { titleKey?: string };

export function productDisplayTitle(
  product: ProductWithOptionalTitleKey,
  t: TranslateFn,
): string {
  if (product.titleKey) {
    const translated = t(product.titleKey);
    if (translated !== product.titleKey) return translated;
  }
  return product.title;
}
