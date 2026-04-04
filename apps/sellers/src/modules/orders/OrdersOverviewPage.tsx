import { useMemo } from "react";
import { Card, StatCard } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SELLER_PAGE_COPY_KEYS } from "../../constants/sellerNavigation";
import { useT } from "../../i18n";

const copy = SELLER_PAGE_COPY_KEYS.ordersOverview;

export function OrdersOverviewPage() {
  const t = useT();

  const stats = useMemo(
    () => [
      {
        id: "await",
        label: t("common.sellerOrdersOvStatAwaiting"),
        value: "5",
        hint: t("common.sellerOrdersOvStatAwaitingHint"),
      },
      {
        id: "transit",
        label: t("common.sellerOrdersOvStatTransit"),
        value: "12",
        hint: t("common.sellerOrdersOvStatTransitHint"),
      },
      {
        id: "done",
        label: t("common.sellerOrdersOvStatCompleted"),
        value: "48",
        hint: t("common.sellerOrdersOvStatCompletedHint"),
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
          title={t("common.sellerOrdersOvPipelineTitle")}
          description={t("common.sellerOrdersOvPipelineDesc")}
        >
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>{t("common.sellerOrdersOvPaymentPending")}</span>
              <span className="font-medium text-amber-700">1</span>
            </li>
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>{t("common.sellerOrdersOvReadyPack")}</span>
              <span className="font-medium text-slate-900">5</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>{t("common.sellerOrdersOvReturnsOpen")}</span>
              <span className="font-medium text-slate-900">0</span>
            </li>
          </ul>
        </Card>

        <Card
          title={t("common.sellerOrdersOvShortcutsTitle")}
          description={t("common.sellerOrdersOvShortcutsDesc")}
        >
          <SellerShortcutNav
            links={[
              { to: "/orders/list", labelKey: "common.sellerLinkAllOrders" },
              {
                to: "/orders",
                labelKey: "common.sellerSubOverview",
                end: true,
              },
            ]}
          />
          <p className="mt-4 text-xs text-slate-400">
            {t("common.sellerOrdersOvFootnote")}
          </p>
        </Card>
      </div>
    </SellerPageFrame>
  );
}
