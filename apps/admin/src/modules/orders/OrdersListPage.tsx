import { TableCard } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";

export function OrdersListPage() {
  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.orders}
      addon={
        <p className="text-sm text-slate-500">
          Operational list — status, refunds, and carrier events map here.
        </p>
      }
    >
      <TableCard
        title="All orders"
        description="Placeholder grid until the orders API is connected."
      >
        <DataTablePlaceholder
          columns={["Order", "Buyer", "Total", "Status", "Placed"]}
          emptyMessage="No rows loaded yet — fetch from your API and map rows here."
        />
      </TableCard>
    </AdminPageFrame>
  );
}
