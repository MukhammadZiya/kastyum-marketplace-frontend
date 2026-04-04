import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@repo/ui";
import { ActivityFeed } from "../../components/ActivityFeed";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { QuickActions } from "../../components/QuickActions";
import { StatGrid } from "../../components/StatGrid";
import { ADMIN_PAGE_TITLE_KEYS } from "../../constants/adminNavigation";
import { useT } from "../../i18n";

export function ProductsPage() {
  const navigate = useNavigate();
  const t = useT();

  const stats = useMemo(
    () => [
      {
        label: t("common.adminProductsStatLiveLabel"),
        value: "48,200",
        hint: t("common.adminProductsStatLiveHint"),
      },
      {
        label: t("common.adminProductsStatModLabel"),
        value: "156",
        hint: t("common.adminProductsStatModHint"),
      },
      {
        label: t("common.adminProductsStatRejectLabel"),
        value: "41",
        hint: t("common.adminProductsStatRejectHint"),
      },
    ],
    [t],
  );

  const events = useMemo(
    () => [
      {
        id: "p1",
        title: t("common.adminProductsAct1Title"),
        time: t("common.adminTime1h"),
      },
      {
        id: "p2",
        title: t("common.adminProductsAct2Title"),
        time: t("common.adminTime3h"),
      },
      {
        id: "p3",
        title: t("common.adminProductsAct3Title"),
        time: t("common.adminTime5h"),
      },
      {
        id: "p4",
        title: t("common.adminProductsAct4Title"),
        time: t("common.adminTimeYesterday"),
      },
    ],
    [t],
  );

  return (
    <AdminPageFrame
      title={t(ADMIN_PAGE_TITLE_KEYS.products)}
      addon={
        <p className="text-sm text-slate-500">
          {t("common.adminProductsAddon")}
        </p>
      }
    >
      <StatGrid stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title={t("common.adminProductsEventsTitle")}
          description={t("common.adminProductsEventsDesc")}
        >
          <ActivityFeed items={events} />
        </Card>

        <Card
          title={t("common.adminProductsQuickTitle")}
          description={t("common.adminProductsQuickDesc")}
        >
          <QuickActions
            actions={[
              {
                id: "see-products",
                label: t("common.adminProductsQuickSeeAll"),
                onClick: () => navigate("/products/list"),
              },
              {
                id: "add-product",
                label: t("common.adminProductsQuickAdd"),
                onClick: () => navigate("/products/new"),
              },
            ]}
          />
        </Card>
      </div>
    </AdminPageFrame>
  );
}
