import type { SubNavItem } from "../../components/ModuleSubNav";

export const USERS_SUBNAV: SubNavItem[] = [
  { to: "/users", label: "Overview", end: true },
  { to: "/users/list", label: "All users" },
  { to: "/users/new", label: "Add user" },
];
