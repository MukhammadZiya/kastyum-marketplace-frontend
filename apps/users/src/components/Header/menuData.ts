import type { MenuItem } from "../../types/menu";
import { categoryDataUniqueForNav } from "../../data/categoryData";

const categoryNavItems: MenuItem[] = categoryDataUniqueForNav().map((c) => ({
  id: 100 + c.id,
  title: c.title,
  newTab: false,
  path: `/shop-with-sidebar?q=${encodeURIComponent(c.shopSearchQuery)}`,
}));

/** Header primary nav: category links only. */
export const menuData: MenuItem[] = categoryNavItems;
