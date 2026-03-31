export type AdminNavId =
  | "dashboard"
  | "users"
  | "sellers"
  | "products"
  | "orders";

export type AdminNavItem = {
  id: AdminNavId;
  label: string;
  path: string;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: "dashboard", label: "Dashboard", path: "/" },
  { id: "users", label: "Users", path: "/users" },
  { id: "sellers", label: "Sellers", path: "/sellers" },
  { id: "products", label: "Products", path: "/products" },
  { id: "orders", label: "Orders", path: "/orders" },
];

export const ADMIN_PAGE_TITLES: Record<AdminNavId, string> = {
  dashboard: "Dashboard",
  users: "Users",
  sellers: "Sellers",
  products: "Products",
  orders: "Orders",
};
