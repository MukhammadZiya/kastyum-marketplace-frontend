import { useMemo } from "react";
import { TableCard } from "@repo/ui";
import type { Member } from "@repo/types";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { MemberStatusSelect } from "../../components/MemberStatusSelect";
import { ADMIN_PAGE_TITLE_KEYS } from "../../constants/adminNavigation";
import {
  useAdminMemberList,
  useAdminMemberUpdate,
} from "../../hooks/admin-members";
import { getAuthToken } from "@repo/api";
import { getAdminListEmptyMessage } from "../../lib/adminListEmptyMessage";
import { useT } from "../../i18n";

export function SellersListPage() {
  const t = useT();
  const signedIn = !!getAuthToken();
  const { data, isPending, isError, error } = useAdminMemberList({
    page: 1,
    limit: 200,
  });
  const updateMember = useAdminMemberUpdate();

  const sellers = data?.list.filter((m: Member) => m.type === "SELLER") ?? [];

  const emptyMessage = getAdminListEmptyMessage({
    signedIn,
    isPending,
    isError,
    error,
    signInHint: t("common.adminEmptySignInMembers"),
    whenEmpty: t("common.adminEmptySellers"),
  });

  const columns = useMemo(
    () => [
      t("common.adminColStore"),
      t("common.adminColOwnerEmail"),
      t("common.adminColStatus"),
      t("common.adminColCreated"),
    ],
    [t],
  );

  const rowEls =
    sellers.length > 0 ?
      sellers.map((m: Member) => (
        <tr
          key={m._id}
          className="border-t border-neutral-100 transition hover:bg-[#FAFAFB]"
        >
          <td className="px-4 py-3 font-black text-slate-950">{m.nick}</td>
          <td className="px-4 py-3 text-slate-700">{m.email}</td>
          <td className="px-4 py-3">
            <MemberStatusSelect
              value={m.status}
              disabled={updateMember.isPending}
              onChange={(status) =>
                updateMember.mutate({ id: m._id, body: { status } })
              }
            />
          </td>
          <td className="px-4 py-3 text-slate-600">
            {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "—"}
          </td>
        </tr>
      ))
    : undefined;

  const tableDescription = `${t("common.adminUsersListShowing")} ${sellers.length} ${t("common.adminOf")} ${data?.list.length ?? 0} ${t("common.adminMembersLoadedSuffix")}`;

  return (
    <AdminPageFrame
      title={t(ADMIN_PAGE_TITLE_KEYS.sellers)}
      addon={
        <p className="text-sm text-slate-500">
          {t("common.adminSellersListAddon")}
        </p>
      }
    >
      <TableCard
        title={t("common.adminSellersListTitle")}
        description={tableDescription}
        className="rounded-3xl border-neutral-200 shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
      >
        <DataTablePlaceholder columns={columns} emptyMessage={emptyMessage}>
          {rowEls}
        </DataTablePlaceholder>
      </TableCard>
    </AdminPageFrame>
  );
}
