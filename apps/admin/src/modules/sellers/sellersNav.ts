import type { SidebarSubItem } from "@repo/ui";

export const SELLERS_SUBNAV: SidebarSubItem[] = [
  { to: "/sellers", label: "Overview", end: true },
  { to: "/sellers/list", label: "All sellers" },
  { to: "/sellers/new", label: "Add seller" },
];
