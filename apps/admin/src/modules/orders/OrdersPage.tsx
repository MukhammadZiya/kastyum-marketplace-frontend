import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@repo/ui";
import { ActivityFeed } from "../../components/ActivityFeed";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { QuickActions } from "../../components/QuickActions";
import { StatGrid } from "../../components/StatGrid";
import { ADMIN_PAGE_TITLE_KEYS } from "../../constants/adminNavigation";
import { useT } from "../../i18n";

export function OrdersPage() {
  const navigate = useNavigate();
  const t = useT();

  const stats = useMemo(
    () => [
      {
        label: t("common.adminOrdersStatAttentionLabel"),
        value: "37",
        hint: t("common.adminOrdersStatAttentionHint"),
      },
      {
        label: t("common.adminOrdersStatShippedLabel"),
        value: "89",
        hint: t("common.adminOrdersStatShippedHint"),
      },
      {
        label: t("common.adminOrdersStatRefundsLabel"),
        value: "12",
        hint: t("common.adminOrdersStatRefundsHint"),
      },
    ],
    [t],
  );

  const events = useMemo(
    () => [
      {
        id: "o1",
        title: t("common.adminOrdersAct1Title"),
        time: t("common.adminTime25m"),
      },
      {
        id: "o2",
        title: t("common.adminOrdersAct2Title"),
        time: t("common.adminTime1h"),
      },
      {
        id: "o3",
        title: t("common.adminOrdersAct3Title"),
        time: t("common.adminTime3h"),
      },
      {
        id: "o4",
        title: t("common.adminOrdersAct4Title"),
        time: t("common.adminTimeYesterday"),
      },
    ],
    [t],
  );

  return (
    <AdminPageFrame
      title={t(ADMIN_PAGE_TITLE_KEYS.orders)}
      addon={
        <p className="text-sm text-slate-500">
          {t("common.adminOrdersAddon")}
        </p>
      }
    >
      <StatGrid stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title={t("common.adminOrdersEventsTitle")}
          description={t("common.adminOrdersEventsDesc")}
        >
          <ActivityFeed items={events} />
        </Card>

        <Card
          title={t("common.adminOrdersQuickTitle")}
          description={t("common.adminOrdersQuickDesc")}
        >
          <QuickActions
            actions={[
              {
                id: "see-orders",
                label: t("common.adminOrdersQuickSeeAll"),
                onClick: () => navigate("/orders/list"),
              },
              {
                id: "export-orders",
                label: t("common.adminOrdersQuickExport"),
                onClick: () => console.info("admin:orders-export"),
              },
            ]}
          />
        </Card>
      </div>
    </AdminPageFrame>
  );
}
