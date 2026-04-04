import type { SidebarNavItem, SidebarSubItem } from "@repo/ui";
import type { TranslateFn } from "../i18n/types";

type SubSpec = { to: string; labelKey: string; end?: boolean };

const PRODUCTS_SUBS: SubSpec[] = [
  { to: "/products", labelKey: "common.sellerSubOverview", end: true },
  { to: "/products/list", labelKey: "common.sellerSubAllProducts" },
  { to: "/products/new", labelKey: "common.sellerSubAddProduct" },
];

const ORDERS_SUBS: SubSpec[] = [
  { to: "/orders", labelKey: "common.sellerSubOverview", end: true },
  { to: "/orders/list", labelKey: "common.sellerSubAllOrders" },
];

const STORE_SUBS: SubSpec[] = [
  { to: "/store", labelKey: "common.sellerSubOverview", end: true },
  { to: "/store/edit", labelKey: "common.sellerSubEditStore" },
];

type TopSpec = {
  id: string;
  labelKey: string;
  to: string;
  subs?: readonly SubSpec[];
};

const TOP: TopSpec[] = [
  { id: "dashboard", labelKey: "common.sellerNavDashboard", to: "/" },
  {
    id: "products",
    labelKey: "common.sellerNavProducts",
    to: "/products",
    subs: PRODUCTS_SUBS,
  },
  {
    id: "orders",
    labelKey: "common.sellerNavOrders",
    to: "/orders",
    subs: ORDERS_SUBS,
  },
  {
    id: "store",
    labelKey: "common.sellerNavStore",
    to: "/store",
    subs: STORE_SUBS,
  },
];

export function buildSellerSidebarItems(t: TranslateFn): SidebarNavItem[] {
  return TOP.map((item) => {
    const subItems: SidebarSubItem[] | undefined = item.subs?.map((s) => ({
      to: s.to,
      label: t(s.labelKey),
      end: s.end,
    }));
    return {
      id: item.id,
      label: t(item.labelKey),
      to: item.to,
      subItems,
    };
  });
}

export function isSellerSubActive(pathname: string, sub: SidebarSubItem): boolean {
  if (sub.end) return pathname === sub.to;
  return pathname === sub.to || pathname.startsWith(`${sub.to}/`);
}
