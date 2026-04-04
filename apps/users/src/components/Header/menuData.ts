import type { MenuItem } from "../../types/menu";
import { categoryDataUniqueForNav } from "../../data/categoryData";
import type { TranslateFn } from "../../i18n/types";

export function getNavMenuItems(t: TranslateFn): MenuItem[] {
  return categoryDataUniqueForNav().map((c) => ({
    id: 100 + c.id,
    title: t(c.titleKey),
    newTab: false,
    path: `/shop-with-sidebar?q=${encodeURIComponent(c.shopSearchQuery)}`,
  }));
}
