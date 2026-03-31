import type { SubNavItem } from "../../components/ModuleSubNav";

export const PRODUCTS_SUBNAV: SubNavItem[] = [
  { to: "/products", label: "Overview", end: true },
  { to: "/products/list", label: "All products" },
  { to: "/products/new", label: "Add product" },
];
