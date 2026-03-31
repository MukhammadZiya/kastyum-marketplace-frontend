import { TableCard } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { ModuleSubNav } from "../../components/ModuleSubNav";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";
import { SELLERS_SUBNAV } from "./sellersNav";

export function SellersListPage() {
  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.sellers}
      tabs={<ModuleSubNav items={SELLERS_SUBNAV} />}
      addon={
        <p className="text-sm text-slate-500">
          Browse storefronts — filters and KYC status will plug in next.
        </p>
      }
    >
      <TableCard
        title="All sellers"
        description="Placeholder grid until the sellers API is connected."
      >
        <DataTablePlaceholder
          columns={["Store", "Owner email", "Status", "Created"]}
          emptyMessage="No rows loaded yet — fetch from your API and map rows here."
        />
      </TableCard>
    </AdminPageFrame>
  );
}
