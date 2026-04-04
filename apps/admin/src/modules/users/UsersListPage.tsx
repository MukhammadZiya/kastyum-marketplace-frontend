import { useMemo } from "react";
import { TableCard } from "@repo/ui";
import type { Member } from "@repo/types";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { ADMIN_PAGE_TITLE_KEYS } from "../../constants/adminNavigation";
import { useAdminMemberList } from "../../hooks/admin-members";
import { getAuthToken } from "@repo/api";
import { getAdminListEmptyMessage } from "../../lib/adminListEmptyMessage";
import { useT } from "../../i18n";

export function UsersListPage() {
  const t = useT();
  const signedIn = !!getAuthToken();
  const { data, isPending, isError, error } = useAdminMemberList({
    page: 1,
    limit: 200,
  });

  const buyers =
    data?.list.filter((m: Member) => m.type === "USER") ?? [];

  const emptyMessage = getAdminListEmptyMessage({
    signedIn,
    isPending,
    isError,
    error,
    signInHint: t("common.adminEmptySignInMembers"),
    whenEmpty: t("common.adminEmptyBuyers"),
  });

  const columns = useMemo(
    () => [
      t("common.adminColEmail"),
      t("common.adminColName"),
      t("common.adminColStatus"),
      t("common.adminColJoined"),
    ],
    [t],
  );

  const rowEls =
    buyers.length > 0 ?
      buyers.map((m: Member) => (
        <tr key={m._id} className="border-t border-slate-100">
          <td className="px-4 py-3">{m.email}</td>
          <td className="px-4 py-3 font-medium text-slate-900">{m.nick}</td>
          <td className="px-4 py-3">{m.status}</td>
          <td className="px-4 py-3 text-slate-600">
            {m.createdAt
              ? new Date(m.createdAt).toLocaleDateString()
              : "—"}
          </td>
        </tr>
      ))
    : undefined;

  const tableDescription = `${t("common.adminUsersListShowing")} ${buyers.length} ${t("common.adminOf")} ${data?.list.length ?? 0} ${t("common.adminMembersLoadedSuffix")}`;

  return (
    <AdminPageFrame
      title={t(ADMIN_PAGE_TITLE_KEYS.users)}
      addon={
        <p className="text-sm text-slate-500">
          {t("common.adminUsersListAddon")}
        </p>
      }
    >
      <TableCard title={t("common.adminUsersListTitle")} description={tableDescription}>
        <DataTablePlaceholder columns={columns} emptyMessage={emptyMessage}>
          {rowEls}
        </DataTablePlaceholder>
      </TableCard>
    </AdminPageFrame>
  );
}
