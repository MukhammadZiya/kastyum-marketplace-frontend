export type AdminSubNavSpec = {
  to: string;
  labelKey: string;
  end?: boolean;
};

export const USERS_SUBNAV_SPECS: readonly AdminSubNavSpec[] = [
  { to: "/users", labelKey: "common.adminUsersSubOverview", end: true },
  { to: "/users/list", labelKey: "common.adminUsersSubAll" },
  { to: "/users/new", labelKey: "common.adminUsersSubAdd" },
];
