import { useMemo } from "react";
import { TableCard } from "@repo/ui";
import type { OrderListRow } from "@repo/types";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { ADMIN_PAGE_TITLE_KEYS } from "../../constants/adminNavigation";
import { useAdminOrderList } from "../../hooks/admin-orders";
import { getAuthToken } from "@repo/api";
import { getAdminListEmptyMessage } from "../../lib/adminListEmptyMessage";
import { useT } from "../../i18n";

export function OrdersListPage() {
  const t = useT();
  const signedIn = !!getAuthToken();
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
    data?.list.length ?
      data.list.map((o: OrderListRow) => (
        <tr key={o._id} className="border-t border-slate-100">
          <td className="px-4 py-3 font-mono text-xs text-slate-600">
            {o._id.slice(-8)}
          </td>
          <td className="px-4 py-3">{o.memberId?.nick ?? "—"}</td>
          <td className="max-w-[min(280px,32vw)] px-4 py-3 text-sm text-slate-700">
            <span className="line-clamp-3 break-words">
              {o.shippingAddress?.trim() || "—"}
            </span>
          </td>
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

  const tableDescription = `${t("common.adminTotal")} ${data?.total ?? 0} ${t("common.adminOrdersTotalSuffix")} (${t("common.adminThisPage")} ${data?.list.length ?? 0}).`;

  return (
    <AdminPageFrame
      title={t(ADMIN_PAGE_TITLE_KEYS.orders)}
      addon={
        <p className="text-sm text-slate-500">
          {t("common.adminOrdersListAddon")}
        </p>
      }
    >
      <TableCard title={t("common.adminOrdersListTitle")} description={tableDescription}>
        <DataTablePlaceholder columns={columns} emptyMessage={emptyMessage}>
          {rowEls}
        </DataTablePlaceholder>
      </TableCard>
    </AdminPageFrame>
  );
}
