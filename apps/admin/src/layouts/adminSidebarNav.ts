import type { SidebarNavItem, SidebarSubItem } from "@repo/ui";
import {
  ADMIN_NAV_ITEMS,
  type AdminNavId,
} from "../constants/adminNavigation";
import { PRODUCTS_SUBNAV_SPECS } from "../modules/products/productsNav";
import { SELLERS_SUBNAV_SPECS } from "../modules/sellers/sellersNav";
import { USERS_SUBNAV_SPECS } from "../modules/users/usersNav";
import type { TranslateFn } from "../i18n/types";

const SUB_SPECS: Partial<
  Record<AdminNavId, readonly { to: string; labelKey: string; end?: boolean }[]>
> = {
  users: USERS_SUBNAV_SPECS,
  sellers: SELLERS_SUBNAV_SPECS,
  products: PRODUCTS_SUBNAV_SPECS,
};

export function buildAdminSidebarItems(t: TranslateFn): SidebarNavItem[] {
  return ADMIN_NAV_ITEMS.map((n) => {
    const specs = SUB_SPECS[n.id];
    const subItems: SidebarSubItem[] | undefined =
      specs && specs.length > 0
        ? specs.map((s) => ({
            to: s.to,
            label: t(s.labelKey),
            end: s.end,
          }))
        : undefined;
    return {
      id: n.id,
      label: t(n.labelKey),
      to: n.path,
      subItems,
    };
  });
}

export function isSidebarSubActive(
  pathname: string,
  sub: SidebarSubItem,
): boolean {
  if (sub.end) return pathname === sub.to;
  return pathname === sub.to || pathname.startsWith(`${sub.to}/`);
}
