import type { AdminSubNavSpec } from "../users/usersNav";

export const ORDERS_SUBNAV_SPECS: readonly AdminSubNavSpec[] = [
  { to: "/orders", labelKey: "common.adminOrdersSubOverview", end: true },
  { to: "/orders/list", labelKey: "common.adminOrdersSubAll" },
];
