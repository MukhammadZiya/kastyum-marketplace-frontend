import { useMemo, useState } from "react";
import { TableCard, DateRangeFilter } from "@repo/ui";
import type { DateRange } from "@repo/ui";
import type { OrderListRow, OrderStatus } from "@repo/types";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { OrderStatusSelect } from "../../components/OrderStatusSelect";
import { ADMIN_PAGE_TITLE_KEYS } from "../../constants/adminNavigation";
import { useAdminOrderList, useAdminOrderUpdate } from "../../hooks/admin-orders";
import { getAuthToken } from "@repo/api";
import { getAdminListEmptyMessage } from "../../lib/adminListEmptyMessage";
import { useT } from "../../i18n";

function inDateRange(dateStr: string | undefined, range: DateRange): boolean {
  if (!range.from && !range.to) return true;
  if (!dateStr) return false;
  const ts = new Date(dateStr).getTime();
  if (range.from && ts < new Date(range.from).getTime()) return false;
  if (range.to && ts > new Date(range.to + "T23:59:59").getTime()) return false;
  return true;
}

export function OrdersListPage() {
  const t = useT();
  const signedIn = !!getAuthToken();
  const updateOrder = useAdminOrderUpdate();
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });

  const { data, isPending, isError, error } = useAdminOrderList({
    page: 1,
    limit: 50,
  });

  const emptyMessage = getAdminListEmptyMessage({
    signedIn,
    isPending,
    isError,
    error,
    signInHint: t("common.adminEmptySignInOrders"),
    whenEmpty: t("common.adminEmptyOrders"),
  });

  const filteredList = useMemo(() => {
    if (!data?.list) return [];
    return data.list.filter((o) => inDateRange(o.createdAt, dateRange));
  }, [data, dateRange]);

  const columns = useMemo(
    () => [
      t("common.adminColOrder"),
      t("common.adminColBuyer"),
      t("common.adminColShipping"),
      t("common.adminColTotal"),
      t("common.adminColStatus"),
      t("common.adminColPlaced"),
    ],
    [t],
  );

  const rowEls =
    filteredList.length ?
      filteredList.map((o: OrderListRow) => (
        <tr
          key={o._id}
          className="border-t border-neutral-100 transition hover:bg-[#FAFAFB]"
        >
          <td className="px-4 py-3 font-mono text-xs text-slate-600">
            {o._id.slice(-8)}
          </td>
          <td className="px-4 py-3 font-black text-slate-950">
            {o.memberId?.nick ?? "—"}
          </td>
          <td className="max-w-[min(280px,32vw)] px-4 py-3 text-sm text-slate-700">
            <span className="line-clamp-3 break-words">
              {o.shippingAddress?.trim() || "—"}
            </span>
          </td>
          <td className="px-4 py-3 font-black text-slate-950">
            ${o.totalAmount.toFixed(2)}
          </td>
          <td className="px-4 py-3">
            <OrderStatusSelect
              value={o.status as OrderStatus}
              disabled={updateOrder.isPending}
              onChange={(status) => updateOrder.mutate({ id: o._id, status })}
            />
          </td>
          <td className="px-4 py-3 text-slate-600">
            {o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}
          </td>
        </tr>
      ))
    : undefined;

  const tableDescription = `${t("common.adminTotal")} ${filteredList.length} ${t("common.adminOrdersTotalSuffix")} (${t("common.adminThisPage")} ${filteredList.length}).`;

  return (
    <AdminPageFrame
      title={t(ADMIN_PAGE_TITLE_KEYS.orders)}
      addon={
        <p className="text-sm text-slate-500">
          {t("common.adminOrdersListAddon")}
        </p>
      }
    >
      <div className="mb-4 flex flex-wrap items-end gap-3 rounded-2xl border border-neutral-200 bg-[#FAFAFB] p-3">
        <DateRangeFilter
          value={dateRange}
          onChange={setDateRange}
          labelFrom={t("common.filterDateFrom")}
          labelTo={t("common.filterDateTo")}
          searchLabel={t("common.filterDateSearch")}
          clearLabel={t("common.filterDateClear")}
        />
      </div>
      <TableCard
        title={t("common.adminOrdersListTitle")}
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
