import type { AdminSubNavSpec } from "../users/usersNav";

export const SELLERS_SUBNAV_SPECS: readonly AdminSubNavSpec[] = [
  { to: "/sellers", labelKey: "common.adminSellersSubOverview", end: true },
  { to: "/sellers/list", labelKey: "common.adminSellersSubAll" },
  { to: "/sellers/new", labelKey: "common.adminSellersSubAdd" },
];
