import type { SubNavItem } from "../../components/ModuleSubNav";

export const SELLERS_SUBNAV: SubNavItem[] = [
  { to: "/sellers", label: "Overview", end: true },
  { to: "/sellers/list", label: "All sellers" },
  { to: "/sellers/new", label: "Add seller" },
];
