import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@repo/ui";
import { ActivityFeed } from "../../components/ActivityFeed";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { QuickActions } from "../../components/QuickActions";
import { StatGrid } from "../../components/StatGrid";
import { ADMIN_PAGE_TITLE_KEYS } from "../../constants/adminNavigation";
import { useT } from "../../i18n";

export function SellersPage() {
  const navigate = useNavigate();
  const t = useT();

  const stats = useMemo(
    () => [
      {
        label: t("common.adminSellersStatActiveLabel"),
        value: "842",
        hint: t("common.adminSellersStatActiveHint"),
      },
      {
        label: t("common.adminSellersStatPendingLabel"),
        value: "23",
        hint: t("common.adminSellersStatPendingHint"),
      },
      {
        label: t("common.adminSellersStatSuspendedLabel"),
        value: "6",
        hint: t("common.adminSellersStatSuspendedHint"),
      },
    ],
    [t],
  );

  const events = useMemo(
    () => [
      {
        id: "s1",
        title: t("common.adminSellersAct1Title"),
        time: t("common.adminTime2h"),
      },
      {
        id: "s2",
        title: t("common.adminSellersAct2Title"),
        time: t("common.adminTime4h"),
      },
      {
        id: "s3",
        title: t("common.adminSellersAct3Title"),
        time: t("common.adminTimeYesterday"),
      },
      {
        id: "s4",
        title: t("common.adminSellersAct4Title"),
        time: t("common.adminTimeYesterday"),
      },
    ],
    [t],
  );

  return (
    <AdminPageFrame
      title={t(ADMIN_PAGE_TITLE_KEYS.sellers)}
      addon={
        <p className="text-sm text-slate-500">
          {t("common.adminSellersAddon")}
        </p>
      }
    >
      <StatGrid stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title={t("common.adminSellersEventsTitle")}
          description={t("common.adminSellersEventsDesc")}
        >
          <ActivityFeed items={events} />
        </Card>

        <Card
          title={t("common.adminSellersQuickTitle")}
          description={t("common.adminSellersQuickDesc")}
        >
          <QuickActions
            actions={[
              {
                id: "see-sellers",
                label: t("common.adminSellersQuickSeeAll"),
                onClick: () => navigate("/sellers/list"),
              },
              {
                id: "add-seller",
                label: t("common.adminSellersQuickAdd"),
                onClick: () => navigate("/sellers/new"),
              },
            ]}
          />
        </Card>
      </div>
    </AdminPageFrame>
  );
}
