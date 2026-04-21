import type { AdminSubNavSpec } from "../users/usersNav";

export const SELLERS_SUBNAV_SPECS: readonly AdminSubNavSpec[] = [
  { to: "/sellers/list", labelKey: "common.adminSellersSubAll", end: true },
  { to: "/sellers/new", labelKey: "common.adminSellersSubAdd" },
];
