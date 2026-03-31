import type { SidebarSubItem } from "@repo/ui";

export const PRODUCTS_SUBNAV: SidebarSubItem[] = [
  { to: "/products", label: "Overview", end: true },
  { to: "/products/list", label: "All products" },
  { to: "/products/new", label: "Add product" },
];
