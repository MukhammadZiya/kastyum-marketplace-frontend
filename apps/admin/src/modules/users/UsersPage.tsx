import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@repo/ui";
import { ActivityFeed } from "../../components/ActivityFeed";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { QuickActions } from "../../components/QuickActions";
import { StatGrid } from "../../components/StatGrid";
import { ADMIN_PAGE_TITLE_KEYS } from "../../constants/adminNavigation";
import { useT } from "../../i18n";

export function UsersPage() {
  const navigate = useNavigate();
  const t = useT();

  const stats = useMemo(
    () => [
      {
        label: t("common.adminUsersStatRegLabel"),
        value: "12,480",
        hint: t("common.adminUsersStatRegHint"),
      },
      {
        label: t("common.adminUsersStatActiveLabel"),
        value: "6,910",
        hint: t("common.adminUsersStatActiveHint"),
      },
      {
        label: t("common.adminUsersStatNewLabel"),
        value: "214",
        hint: t("common.adminUsersStatNewHint"),
      },
    ],
    [t],
  );

  const events = useMemo(
    () => [
      {
        id: "u1",
        title: t("common.adminUsersAct1Title"),
        time: t("common.adminTime35m"),
      },
      {
        id: "u2",
        title: t("common.adminUsersAct2Title"),
        time: t("common.adminTime2h"),
      },
      {
        id: "u3",
        title: t("common.adminUsersAct3Title"),
        time: t("common.adminTime5h"),
      },
      {
        id: "u4",
        title: t("common.adminUsersAct4Title"),
        time: t("common.adminTimeYesterday"),
      },
    ],
    [t],
  );

  return (
    <AdminPageFrame
      title={t(ADMIN_PAGE_TITLE_KEYS.users)}
      addon={
        <p className="text-sm text-slate-500">
          {t("common.adminUsersAddon")}
        </p>
      }
    >
      <StatGrid stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title={t("common.adminUsersEventsTitle")}
          description={t("common.adminUsersEventsDesc")}
        >
          <ActivityFeed items={events} />
        </Card>

        <Card
          title={t("common.adminUsersQuickTitle")}
          description={t("common.adminUsersQuickDesc")}
        >
          <QuickActions
            actions={[
              {
                id: "see-users",
                label: t("common.adminUsersQuickSeeAll"),
                onClick: () => navigate("/users/list"),
              },
              {
                id: "add-user",
                label: t("common.adminUsersQuickAdd"),
                onClick: () => navigate("/users/new"),
              },
            ]}
          />
        </Card>
      </div>
    </AdminPageFrame>
  );
}
