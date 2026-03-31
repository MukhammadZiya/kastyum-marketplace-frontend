import type { SidebarSubItem } from "@repo/ui";

export const ORDERS_SUBNAV: SidebarSubItem[] = [
  { to: "/orders", label: "Overview", end: true },
  { to: "/orders/list", label: "All orders" },
];
