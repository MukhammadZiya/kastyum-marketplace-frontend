import { TableCard } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";
import type { AdminMemberListResponse } from "../../lib/marketplaceTypes";

export function UsersListPage() {
  const members: AdminMemberListResponse = { list: [], total: 0 };

  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.users}
      addon={
        <p className="text-sm text-slate-500">
          Browse buyers — wire search, filters, and pagination with React Query.
        </p>
      }
    >
      <TableCard
        title="All buyers"
        description="Placeholder grid until the users API is connected."
      >
        <DataTablePlaceholder
          columns={["Email", "Name", "Status", "Joined"]}
          emptyMessage={
            members.total === 0
              ? "No rows loaded yet — fetch from your API and map rows here."
              : ""
          }
        />
      </TableCard>
    </AdminPageFrame>
  );
}
