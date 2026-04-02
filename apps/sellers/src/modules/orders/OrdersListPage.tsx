import { Card, StatCard } from "@repo/ui";
import type { OrderListRow, OrderStatus } from "@repo/types";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SellerTableScaffold } from "../../components/seller/SellerTableScaffold";
import { SELLER_PAGE_COPY } from "../../constants/sellerNavigation";
import {
  useSellerOrders,
  useUpdateOrderStatus,
} from "../../hooks/seller-orders";
import { getAuthToken } from "@repo/api";

const c = SELLER_PAGE_COPY.ordersList;

const COLUMNS = [
  "Order",
  "Buyer",
  "Items",
  "Total",
  "Status",
  "Placed",
] as const;

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
  const signedIn = !!getAuthToken();
  const { data, isPending, isError, error } = useSellerOrders({
    page: 1,
    limit: 50,
  });
  const updateStatus = useUpdateOrderStatus();

  const pendingCount =
    data?.list.filter((o: OrderListRow) => o.status === "PENDING").length ??
    0;

  const stats = [
    { label: "Open", value: String(data?.total ?? 0), hint: "Listed" },
    { label: "Pending", value: String(pendingCount), hint: "Awaiting action" },
    { label: "SLA risk", value: "—", hint: "Placeholder" },
  ] as const;

  const emptyLabel = !signedIn
    ? "Sign in as a seller to load orders."
    : isPending
      ? "Loading…"
      : isError
        ? error instanceof Error
          ? error.message
          : "Could not load orders."
        : "No orders yet.";

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
              : "—"}
          </td>
        </tr>
      ))
    : undefined;

  return (
    <SellerPageFrame
      title={c.title}
      addon={<p className="text-sm text-slate-500">{c.description}</p>}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,280px)]">
        <Card
          title="Orders"
          description="Filters, export, and row actions attach here"
        >
          <SellerTableScaffold columns={COLUMNS} emptyLabel={emptyLabel}>
            {rowEls}
          </SellerTableScaffold>
        </Card>

        <Card title="Shortcuts" description="Related pages">
          <SellerShortcutNav
            links={[
              { to: "/orders", label: "Orders overview", end: true },
              { to: "/", label: "Dashboard" },
            ]}
          />
        </Card>
      </div>
    </SellerPageFrame>
  );
}
