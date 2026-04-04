import type { AdminSubNavSpec } from "../users/usersNav";

export const PRODUCTS_SUBNAV_SPECS: readonly AdminSubNavSpec[] = [
  { to: "/products", labelKey: "common.adminProductsSubOverview", end: true },
  { to: "/products/list", labelKey: "common.adminProductsSubAll" },
  { to: "/products/new", labelKey: "common.adminProductsSubAdd" },
];
