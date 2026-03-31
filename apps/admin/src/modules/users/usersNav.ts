import type { SidebarSubItem } from "@repo/ui";

export const USERS_SUBNAV: SidebarSubItem[] = [
  { to: "/users", label: "Overview", end: true },
  { to: "/users/list", label: "All users" },
  { to: "/users/new", label: "Add user" },
];
