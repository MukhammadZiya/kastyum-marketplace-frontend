import type { AdminSubNavSpec } from "../users/usersNav";

export const PRODUCTS_SUBNAV_SPECS: readonly AdminSubNavSpec[] = [
  { to: "/products/list", labelKey: "common.adminProductsSubAll", end: true },
  { to: "/products/new", labelKey: "common.adminProductsSubAdd" },
];
