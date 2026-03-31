import type { SubNavItem } from "../../components/ModuleSubNav";

export const ORDERS_SUBNAV: SubNavItem[] = [
  { to: "/orders", label: "Overview", end: true },
  { to: "/orders/list", label: "All orders" },
];
