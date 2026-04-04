import { useMemo } from "react";
import { Card, StatCard } from "@repo/ui";
import type { OrderListRow, OrderStatus } from "@repo/types";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SellerTableScaffold } from "../../components/seller/SellerTableScaffold";
import { SELLER_PAGE_COPY_KEYS } from "../../constants/sellerNavigation";
import {
  useSellerOrders,
  useUpdateOrderStatus,
} from "../../hooks/seller-orders";
import { getAuthToken } from "@repo/api";
import { useT } from "../../i18n";

const copy = SELLER_PAGE_COPY_KEYS.ordersList;

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "ACCEPTED",
  "SHIPPED",
  "CANCELLED",
];

function OrderStatusSelect({
  order,
  disabled,
  onChange,
}: {
  order: OrderListRow;
  disabled: boolean;
  onChange: (orderId: string, status: OrderStatus) => void;
}) {
  return (
    <select
      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs"
      value={order.status}
      disabled={disabled}
      onChange={(e) =>
        onChange(order._id, e.target.value as OrderStatus)
      }
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

export function OrdersListPage() {
  const t = useT();
  const signedIn = !!getAuthToken();
  const { data, isPending, isError, error } = useSellerOrders({
    page: 1,
    limit: 50,
  });
  const updateStatus = useUpdateOrderStatus();

  const pendingCount =
    data?.list.filter((o: OrderListRow) => o.status === "PENDING").length ??
    0;

  const stats = useMemo(
    () => [
      {
        id: "open",
        label: t("common.sellerOrdersListStatOpen"),
        value: String(data?.total ?? 0),
        hint: t("common.sellerOrdersListStatOpenHint"),
      },
      {
        id: "pend",
        label: t("common.sellerOrdersListStatPending"),
        value: String(pendingCount),
        hint: t("common.sellerOrdersListStatPendingHint"),
      },
      {
        id: "sla",
        label: t("common.sellerOrdersListStatSla"),
        value: t("common.sellerEmDash"),
        hint: t("common.sellerOrdersListStatSlaHint"),
      },
    ],
    [t, data?.total, pendingCount],
  );

  const columns = useMemo(
    () => [
      t("common.sellerColOrder"),
      t("common.sellerColBuyer"),
      t("common.sellerColItems"),
      t("common.sellerColTotal"),
      t("common.sellerColStatus"),
      t("common.sellerColPlaced"),
    ],
    [t],
  );

  const emptyLabel = !signedIn
    ? t("common.sellerEmptySignInOrders")
    : isPending
      ? t("common.sellerLoading")
      : isError
        ? error instanceof Error
          ? error.message
          : t("common.sellerErrorLoadOrders")
        : t("common.sellerEmptyNoOrders");

  const rowEls =
    data?.list.length ?
      data.list.map((o: OrderListRow) => (
        <tr key={o._id} className="border-t border-slate-100">
          <td className="px-4 py-3 font-mono text-xs text-slate-600">
            {o._id.slice(-8)}
          </td>
          <td className="px-4 py-3">{o.memberId.nick}</td>
          <td className="px-4 py-3">{o.items.length}</td>
          <td className="px-4 py-3 font-medium">${o.totalAmount.toFixed(2)}</td>
          <td className="px-4 py-3">
            <OrderStatusSelect
              order={o}
              disabled={updateStatus.isPending}
              onChange={(orderId, status) => {
                if (status === o.status) return;
                updateStatus.mutate({ orderId, body: { status } });
              }}
            />
          </td>
          <td className="px-4 py-3 text-slate-600">
            {o.createdAt
              ? new Date(o.createdAt).toLocaleString()
              : t("common.sellerEmDash")}
          </td>
        </tr>
      ))
    : undefined;

  return (
    <SellerPageFrame
      title={t(copy.titleKey)}
      addon={<p className="text-sm text-slate-500">{t(copy.descriptionKey)}</p>}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.id} label={s.label} value={s.value} hint={s.hint} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,280px)]">
        <Card
          title={t("common.sellerOrdersListCardTitle")}
          description={t("common.sellerOrdersListCardDesc")}
        >
          <SellerTableScaffold columns={columns} emptyLabel={emptyLabel}>
            {rowEls}
          </SellerTableScaffold>
        </Card>

        <Card
          title={t("common.sellerOrdersListShortcutsTitle")}
          description={t("common.sellerOrdersListShortcutsDesc")}
        >
          <SellerShortcutNav
            links={[
              {
                to: "/orders",
                labelKey: "common.sellerLinkOrdersOverview",
                end: true,
              },
              { to: "/", labelKey: "common.sellerLinkDashboard" },
            ]}
          />
        </Card>
      </div>
    </SellerPageFrame>
  );
}
