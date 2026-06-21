export type AdminSubNavSpec = {
  to: string;
  labelKey: string;
  end?: boolean;
};

export const USERS_SUBNAV_SPECS: readonly AdminSubNavSpec[] = [
  { to: "/users/list", labelKey: "common.adminUsersSubAll", end: true },
];
