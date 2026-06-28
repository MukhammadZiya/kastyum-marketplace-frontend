import type { AdminSubNavSpec } from "../users/usersNav";

export const CATEGORIES_SUBNAV_SPECS: readonly AdminSubNavSpec[] = [
  { to: "/categories/list", labelKey: "common.adminCategoriesSubAll", end: true },
];
