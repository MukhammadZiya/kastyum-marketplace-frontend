export type AdminNavId = "users" | "sellers" | "products" | "orders" | "search";

export type AdminNavItem = {
  id: AdminNavId;
  labelKey: string;
  path: string;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: "users", labelKey: "common.adminNavUsers", path: "/users/list" },
  { id: "sellers", labelKey: "common.adminNavSellers", path: "/sellers/list" },
  { id: "products", labelKey: "common.adminNavProducts", path: "/products" },
  { id: "orders", labelKey: "common.adminNavOrders", path: "/orders/list" },
  { id: "search", labelKey: "common.adminNavSearch", path: "/search" },
];

export const ADMIN_PAGE_TITLE_KEYS: Record<AdminNavId, string> = {
  users: "common.adminPageUsers",
  sellers: "common.adminPageSellers",
  products: "common.adminPageProducts",
  orders: "common.adminPageOrders",
  search: "common.adminPageSearch",
};
