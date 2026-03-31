import { TableCard } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { ModuleSubNav } from "../../components/ModuleSubNav";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";
import { USERS_SUBNAV } from "./usersNav";

export function UsersListPage() {
  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.users}
      tabs={<ModuleSubNav items={USERS_SUBNAV} />}
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
          emptyMessage="No rows loaded yet — fetch from your API and map rows here."
        />
      </TableCard>
    </AdminPageFrame>
  );
}
