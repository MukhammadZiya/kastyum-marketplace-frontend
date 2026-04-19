import type { SidebarNavItem } from "@repo/ui";
import type { TranslateFn } from "../i18n/types";

export function buildSellerSidebarItems(t: TranslateFn): SidebarNavItem[] {
  return [
    {
      id: "products",
      label: t("common.sellerNavProducts"),
      to: "/",
    },
  ];
}
