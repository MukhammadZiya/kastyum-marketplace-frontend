import { useMemo } from "react";
import { Card } from "@repo/ui";
import { ActivityFeed } from "../../components/ActivityFeed";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { QuickActions } from "../../components/QuickActions";
import { StatGrid } from "../../components/StatGrid";
import { ADMIN_PAGE_TITLE_KEYS } from "../../constants/adminNavigation";
import { useT } from "../../i18n";

export function DashboardPage() {
  const t = useT();

  const stats = useMemo(
    () => [
      {
        label: t("common.adminDashStatUsersLabel"),
        value: "12,480",
        hint: t("common.adminDashStatUsersHint"),
      },
      {
        label: t("common.adminDashStatSellersLabel"),
        value: "842",
        hint: t("common.adminDashStatSellersHint"),
      },
      {
        label: t("common.adminDashStatOrdersLabel"),
        value: "3,291",
        hint: t("common.adminDashStatOrdersHint"),
      },
    ],
    [t],
  );

  const recentActivity = useMemo(
    () => [
      {
        id: "1",
        title: t("common.adminDashAct1Title"),
        time: t("common.adminTime2h"),
      },
      {
        id: "2",
        title: t("common.adminDashAct2Title"),
        time: t("common.adminTime5h"),
      },
      {
        id: "3",
        title: t("common.adminDashAct3Title"),
        time: t("common.adminTimeYesterday"),
      },
      {
        id: "4",
        title: t("common.adminDashAct4Title"),
        time: t("common.adminTimeYesterday"),
      },
    ],
    [t],
  );

  return (
    <AdminPageFrame
      title={t(ADMIN_PAGE_TITLE_KEYS.dashboard)}
      addon={
        <p className="text-sm text-slate-500">
          {t("common.adminDashAddon")}
        </p>
      }
    >
      <StatGrid stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title={t("common.adminDashRecentTitle")}
          description={t("common.adminDashRecentDesc")}
        >
          <ActivityFeed items={recentActivity} />
        </Card>

        <Card
          title={t("common.adminDashQuickTitle")}
          description={t("common.adminDashQuickDesc")}
        >
          <QuickActions
            actions={[
              {
                id: "add-product",
                label: t("common.adminDashQuickAddProduct"),
                onClick: () => console.info("admin:quick-add-product"),
              },
              {
                id: "approve-seller",
                label: t("common.adminDashQuickApproveSeller"),
                onClick: () => console.info("admin:quick-approve-seller"),
              },
            ]}
          />
        </Card>
      </div>
    </AdminPageFrame>
  );
}
