import { TableCard } from "@repo/ui";
import type { Member } from "@repo/types";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";
import { useAdminMemberList } from "../../hooks/admin-members";
import { getAuthToken } from "@repo/api";
import { getAdminListEmptyMessage } from "../../lib/adminListEmptyMessage";

export function SellersListPage() {
  const signedIn = !!getAuthToken();
  const { data, isPending, isError, error } = useAdminMemberList({
    page: 1,
    limit: 200,
  });

  const sellers =
    data?.list.filter((m: Member) => m.type === "SELLER") ?? [];

  const emptyMessage = getAdminListEmptyMessage({
    signedIn,
    isPending,
    isError,
    error,
    signInHint: "Sign in as admin to load members.",
    whenEmpty: "No sellers in this result set.",
  });

  const rowEls =
    sellers.length > 0 ?
      sellers.map((m: Member) => (
        <tr key={m._id} className="border-t border-slate-100">
          <td className="px-4 py-3 font-medium text-slate-900">{m.nick}</td>
          <td className="px-4 py-3">{m.email}</td>
          <td className="px-4 py-3">{m.status}</td>
          <td className="px-4 py-3 text-slate-600">
            {m.createdAt
              ? new Date(m.createdAt).toLocaleDateString()
              : "—"}
          </td>
        </tr>
      ))
    : undefined;

  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.sellers}
      addon={
        <p className="text-sm text-slate-500">
          Sellers (role SELLER) from admin member list.
        </p>
      }
    >
      <TableCard
        title="All sellers"
        description={`Showing ${sellers.length} of ${data?.list.length ?? 0} loaded members.`}
      >
        <DataTablePlaceholder
          columns={["Store / nick", "Owner email", "Status", "Created"]}
          emptyMessage={emptyMessage}
        >
          {rowEls}
        </DataTablePlaceholder>
      </TableCard>
    </AdminPageFrame>
  );
}
