import { TableCard } from "@repo/ui";
import type { OrderListRow } from "@repo/types";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";
import { useAdminOrderList } from "../../hooks/admin-orders";
import { getAuthToken } from "@repo/api";

export function OrdersListPage() {
  const signedIn = !!getAuthToken();
  const { data, isPending, isError, error } = useAdminOrderList({
    page: 1,
    limit: 50,
  });

  const emptyMessage = !signedIn
    ? "Sign in as admin to load orders."
    : isPending
      ? "Loading…"
      : isError
        ? error instanceof Error
          ? error.message
          : "Request failed."
        : "No orders.";

  const rowEls =
    data?.list.length ?
      data.list.map((o: OrderListRow) => (
        <tr key={o._id} className="border-t border-slate-100">
          <td className="px-4 py-3 font-mono text-xs text-slate-600">
            {o._id.slice(-8)}
          </td>
          <td className="px-4 py-3">{o.memberId.nick}</td>
          <td className="px-4 py-3 font-medium">${o.totalAmount.toFixed(2)}</td>
          <td className="px-4 py-3">{o.status}</td>
          <td className="px-4 py-3 text-slate-600">
            {o.createdAt
              ? new Date(o.createdAt).toLocaleString()
              : "—"}
          </td>
        </tr>
      ))
    : undefined;

  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.orders}
      addon={
        <p className="text-sm text-slate-500">
          All marketplace orders (admin list).
        </p>
      }
    >
      <TableCard
        title="All orders"
        description={`Total ${data?.total ?? 0} orders (this page ${data?.list.length ?? 0}).`}
      >
        <DataTablePlaceholder
          columns={["Order", "Buyer", "Total", "Status", "Placed"]}
          emptyMessage={emptyMessage}
        >
          {rowEls}
        </DataTablePlaceholder>
      </TableCard>
    </AdminPageFrame>
  );
}
