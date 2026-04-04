export type AdminNavId =
  | "dashboard"
  | "users"
  | "sellers"
  | "products"
  | "orders";

export type AdminNavItem = {
  id: AdminNavId;
  labelKey: string;
  path: string;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: "dashboard", labelKey: "common.adminNavDashboard", path: "/" },
  { id: "users", labelKey: "common.adminNavUsers", path: "/users" },
  { id: "sellers", labelKey: "common.adminNavSellers", path: "/sellers" },
  { id: "products", labelKey: "common.adminNavProducts", path: "/products" },
  { id: "orders", labelKey: "common.adminNavOrders", path: "/orders" },
];

export const ADMIN_PAGE_TITLE_KEYS: Record<AdminNavId, string> = {
  dashboard: "common.adminPageDashboard",
  users: "common.adminPageUsers",
  sellers: "common.adminPageSellers",
  products: "common.adminPageProducts",
  orders: "common.adminPageOrders",
};
