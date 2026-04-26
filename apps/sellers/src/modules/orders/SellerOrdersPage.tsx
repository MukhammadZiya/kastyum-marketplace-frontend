import { useMemo, useState } from "react";
import type { OrderListRow, OrderStatus } from "@repo/types";
import { formatRequestFailureMessage, getAuthToken } from "@repo/api";
import { Button, Card } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerTableScaffold } from "../../components/seller/SellerTableScaffold";
import { SELLER_PAGE_COPY_KEYS } from "../../constants/sellerNavigation";
import { useSellerOrders, useSellerOrderUpdateStatus } from "../../hooks/seller-orders";
import { useT } from "../../i18n";

const copy = SELLER_PAGE_COPY_KEYS.ordersList;

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "ACCEPTED",
  "SHIPPED",
  "CANCELLED",
];

const selectClass =
  "min-w-[140px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-[#00966d] focus:ring-2 focus:ring-[#00966d]/20";

function orderStatusLabelKey(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "common.sellerOrderStPending";
    case "ACCEPTED":
      return "common.sellerOrderStAccepted";
    case "SHIPPED":
      return "common.sellerOrderStShipped";
    case "CANCELLED":
      return "common.sellerOrderStCancelled";
    default:
      return status;
  }
}

function buyerLabel(row: OrderListRow): string {
  const m = row.memberId;
  if (!m || typeof m !== "object") return "—";
  const nick = "nick" in m && typeof m.nick === "string" ? m.nick.trim() : "";
  const email = "email" in m && typeof m.email === "string" ? m.email.trim() : "";
  if (nick) return nick;
  if (email) return email;
  return "—";
}

function buyerSubline(row: OrderListRow): string | null {
  const m = row.memberId;
  if (!m || typeof m !== "object") return null;
  const nick = "nick" in m && typeof m.nick === "string" ? m.nick.trim() : "";
  const email = "email" in m && typeof m.email === "string" ? m.email.trim() : "";
  if (nick && email && nick !== email) return email;
  return null;
}

function itemsSummary(row: OrderListRow): string {
  const items = row.items ?? [];
  if (items.length === 0) return "—";
  const head = items.slice(0, 2).map((i) => `${i.productTitle} ×${i.quantity}`);
  const extra = items.length > 2 ? ` +${items.length - 2}` : "";
  return head.join(" · ") + extra;
}

export function SellerOrdersPage() {
  const t = useT();
  const signedIn = !!getAuthToken();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [statusMutationError, setStatusMutationError] = useState<string | null>(
    null,
  );
  const limit = 10;

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(statusFilter ? { status: statusFilter } : {}),
    }),
    [page, limit, statusFilter],
  );

  const { data, isPending, isError, error } = useSellerOrders(queryParams);
  const updateStatus = useSellerOrderUpdateStatus();

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const columns = useMemo(
    () => [
      t("common.sellerColOrder"),
      t("common.sellerColBuyer"),
      t("common.sellerColShipping"),
      t("common.sellerColItems"),
      t("common.sellerColTotal"),
      t("common.sellerColPlaced"),
      t("common.sellerColStatus"),
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
      data.list.map((row: OrderListRow) => {
        const placed = row.createdAt
          ? new Date(row.createdAt).toLocaleString()
          : t("common.sellerEmDash");
        const sub = buyerSubline(row);
        const busyThis =
          updateStatus.isPending && updateStatus.variables?.orderId === row._id;
        const frozen = row.status === "CANCELLED";

        return (
          <tr key={row._id} className="border-t border-slate-100 align-top">
            <td className="px-4 py-3 font-mono text-xs text-slate-600">
              {row._id.slice(-8)}
            </td>
            <td className="px-4 py-3">
              <div className="font-medium text-slate-900">{buyerLabel(row)}</div>
              {sub ? (
                <div className="text-xs text-slate-500">{sub}</div>
              ) : null}
            </td>
            <td className="max-w-[min(280px,32vw)] px-4 py-3 text-sm text-slate-700">
              <span className="line-clamp-3 break-words">
                {row.shippingAddress?.trim() || t("common.sellerEmDash")}
              </span>
            </td>
            <td className="max-w-[280px] px-4 py-3 text-sm text-slate-700">
              <span className="line-clamp-2">{itemsSummary(row)}</span>
            </td>
            <td className="px-4 py-3 tabular-nums text-slate-900">
              ${Number(row.totalAmount).toFixed(2)}
            </td>
            <td className="px-4 py-3 text-sm text-slate-600">{placed}</td>
            <td className="px-4 py-3">
              <select
                className={selectClass}
                aria-label={t("common.sellerColStatus")}
                value={row.status}
                disabled={frozen || busyThis}
                onChange={(e) => {
                  const next = e.target.value as OrderStatus;
                  if (next === row.status) return;
                  setStatusMutationError(null);
                  updateStatus.mutate(
                    { orderId: row._id, body: { status: next } },
                    {
                      onSuccess: () => setStatusMutationError(null),
                      onError: (err) => {
                        setStatusMutationError(formatRequestFailureMessage(err));
                      },
                    },
                  );
                }}
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t(orderStatusLabelKey(s))}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        );
      })
    : undefined;

  return (
    <SellerPageFrame
      title={t(copy.titleKey)}
      addon={<p className="text-sm text-slate-500">{t(copy.descriptionKey)}</p>}
    >
      <div className="space-y-6">
        <Card
          title={t("common.sellerOrdersListCardTitle")}
          description={t("common.sellerOrdersListCardDesc")}
        >
          <div className="mb-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                {t("common.sellerOrdersFilterLabel")}
              </label>
              <select
                className={selectClass + " min-w-[180px]"}
                value={statusFilter}
                onChange={(e) => {
                  setPage(1);
                  setStatusFilter((e.target.value || "") as OrderStatus | "");
                }}
              >
                <option value="">{t("common.sellerOrdersFilterAll")}</option>
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t(orderStatusLabelKey(s))}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {statusMutationError ?
            <p className="mb-4 text-sm text-red-600" role="alert">
              {statusMutationError}
            </p>
          : null}

          <SellerTableScaffold columns={columns} emptyLabel={emptyLabel}>
            {rowEls}
          </SellerTableScaffold>

          {data && data.total > limit ?
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-600">
                {t("common.sellerOrdersPageOf")
                  .replace("{{page}}", String(page))
                  .replace("{{pages}}", String(totalPages))}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1 || updateStatus.isPending}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  {t("common.sellerOrdersPrev")}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages || updateStatus.isPending}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  {t("common.sellerOrdersNext")}
                </Button>
              </div>
            </div>
          : null}
        </Card>
      </div>
    </SellerPageFrame>
  );
}
