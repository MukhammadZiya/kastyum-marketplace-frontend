import { TableCard } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";
import type { AdminOrderListResponse } from "../../lib/marketplaceTypes";

export function OrdersListPage() {
  const orders: AdminOrderListResponse = { list: [], total: 0 };

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
          emptyMessage={
            orders.total === 0
              ? "No rows loaded yet — fetch from your API and map rows here."
              : ""
          }
        />
      </TableCard>
    </AdminPageFrame>
  );
}
