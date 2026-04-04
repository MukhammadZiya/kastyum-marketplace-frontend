import { useMemo } from "react";
import { Card, StatCard } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SELLER_PAGE_COPY_KEYS } from "../../constants/sellerNavigation";
import { useT } from "../../i18n";

const copy = SELLER_PAGE_COPY_KEYS.dashboard;

export function SellerDashboardPage() {
  const t = useT();

  const stats = useMemo(
    () => [
      {
        id: "listings",
        label: t("common.sellerDashStatActiveListings"),
        value: "24",
        hint: t("common.sellerDashStatActiveListingsHint"),
      },
      {
        id: "orders",
        label: t("common.sellerDashStatOpenOrders"),
        value: "7",
        hint: t("common.sellerDashStatOpenOrdersHint"),
      },
      {
        id: "revenue",
        label: t("common.sellerDashStatRevenue"),
        value: "€4.2k",
        hint: t("common.sellerDashStatRevenueHint"),
      },
    ],
    [t],
  );

  return (
    <SellerPageFrame
      title={t(copy.titleKey)}
      addon={<p className="text-sm text-slate-500">{t(copy.descriptionKey)}</p>}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.id} label={s.label} value={s.value} hint={s.hint} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title={t("common.sellerDashTodayTitle")}
          description={t("common.sellerDashTodayDesc")}
        >
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>{t("common.sellerDashTodayNewOrders")}</span>
              <span className="font-medium text-slate-900">3</span>
            </li>
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>{t("common.sellerDashTodayLowStock")}</span>
              <span className="font-medium text-amber-700">2</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>{t("common.sellerDashTodayMessages")}</span>
              <span className="font-medium text-slate-900">0</span>
            </li>
          </ul>
        </Card>

        <Card
          title={t("common.sellerDashShortcutsTitle")}
          description={t("common.sellerDashShortcutsDesc")}
        >
          <SellerShortcutNav
            links={[
              { to: "/products/new", labelKey: "common.sellerLinkAddProduct" },
              { to: "/orders/list", labelKey: "common.sellerLinkViewOrders" },
              { to: "/store/edit", labelKey: "common.sellerLinkEditStore" },
            ]}
          />
          <p className="mt-4 text-xs text-slate-400">
            {t("common.sellerDashShortcutsFootnote")}
          </p>
        </Card>
      </div>
    </SellerPageFrame>
  );
}
