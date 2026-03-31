import type { SidebarNavItem, SidebarSubItem } from "@repo/ui";

export const SELLER_SIDEBAR_ITEMS: SidebarNavItem[] = [
  { id: "dashboard", label: "Dashboard", to: "/" },
  {
    id: "products",
    label: "Products",
    to: "/products",
    subItems: [
      { to: "/products", label: "Overview", end: true },
      { to: "/products/list", label: "All products" },
      { to: "/products/new", label: "Add product" },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    to: "/orders",
    subItems: [
      { to: "/orders", label: "Overview", end: true },
      { to: "/orders/list", label: "All orders" },
    ],
  },
  {
    id: "store",
    label: "Store profile",
    to: "/store",
    subItems: [
      { to: "/store", label: "Overview", end: true },
      { to: "/store/edit", label: "Edit store" },
    ],
  },
];

export function isSellerSubActive(pathname: string, sub: SidebarSubItem): boolean {
  if (sub.end) return pathname === sub.to;
  return pathname === sub.to || pathname.startsWith(`${sub.to}/`);
}
