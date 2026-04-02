import { TableCard } from "@repo/ui";
import type { Member } from "@repo/types";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";
import { useAdminMemberList } from "../../hooks/admin-members";
import { getAuthToken } from "@repo/api";

export function UsersListPage() {
  const signedIn = !!getAuthToken();
  const { data, isPending, isError, error } = useAdminMemberList({
    page: 1,
    limit: 200,
  });

  const buyers =
    data?.list.filter((m: Member) => m.type === "USER") ?? [];

  const emptyMessage = !signedIn
    ? "Sign in as admin to load members."
    : isPending
      ? "Loading…"
      : isError
        ? error instanceof Error
          ? error.message
          : "Request failed."
        : "No buyers in this result set.";

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

  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.users}
      addon={
        <p className="text-sm text-slate-500">
          Buyers (role USER) from admin member list.
        </p>
      }
    >
      <TableCard
        title="All buyers"
        description={`Showing ${buyers.length} of ${data?.list.length ?? 0} loaded members.`}
      >
        <DataTablePlaceholder
          columns={["Email", "Name", "Status", "Joined"]}
          emptyMessage={emptyMessage}
        >
          {rowEls}
        </DataTablePlaceholder>
      </TableCard>
    </AdminPageFrame>
  );
}
