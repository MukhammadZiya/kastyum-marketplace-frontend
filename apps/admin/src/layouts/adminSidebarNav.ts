import type { SidebarNavItem, SidebarSubItem } from "@repo/ui";
import {
  ADMIN_NAV_ITEMS,
  type AdminNavId,
} from "../constants/adminNavigation";
import { ORDERS_SUBNAV } from "../modules/orders/ordersNav";
import { PRODUCTS_SUBNAV } from "../modules/products/productsNav";
import { SELLERS_SUBNAV } from "../modules/sellers/sellersNav";
import { USERS_SUBNAV } from "../modules/users/usersNav";

const SUBS: Partial<Record<AdminNavId, readonly SidebarSubItem[]>> = {
  users: USERS_SUBNAV,
  sellers: SELLERS_SUBNAV,
  products: PRODUCTS_SUBNAV,
  orders: ORDERS_SUBNAV,
};

export const ADMIN_SIDEBAR_ITEMS: SidebarNavItem[] = ADMIN_NAV_ITEMS.map(
  (n) => ({
    id: n.id,
    label: n.label,
    to: n.path,
    subItems: SUBS[n.id],
  }),
);

export function isSidebarSubActive(
  pathname: string,
  sub: SidebarSubItem,
): boolean {
  if (sub.end) return pathname === sub.to;
  return pathname === sub.to || pathname.startsWith(`${sub.to}/`);
}
