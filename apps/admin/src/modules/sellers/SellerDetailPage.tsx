import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TableCard } from "@repo/ui";
import type { OrderListRow, OrderStatus, ProductAdminListItem, ProductStatus } from "@repo/types";
import { resolveUploadUrl } from "@repo/api";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { MemberStatusSelect } from "../../components/MemberStatusSelect";
import { OrderStatusSelect } from "../../components/OrderStatusSelect";
import { ProductStatusSelect } from "../../components/ProductStatusSelect";
import {
  useAdminMemberDetail,
  useAdminMemberUpdate,
} from "../../hooks/admin-members";
import { useAdminProductList, useAdminProductUpdate } from "../../hooks/admin-products";
import { useAdminOrderList, useAdminOrderUpdate } from "../../hooks/admin-orders";
import { useT } from "../../i18n";

function Initials({ name }: { name: string }) {
  const letters = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#E11D48] text-xl font-black text-white">
      {letters || "?"}
    </div>
  );
}

export function SellerDetailPage() {
  const t = useT();
  const navigate = useNavigate();
  const { id = "" } = useParams<{ id: string }>();

  const member = useAdminMemberDetail(id);
  const updateMember = useAdminMemberUpdate();
  const updateProduct = useAdminProductUpdate();
  const updateOrder = useAdminOrderUpdate();

  const products = useAdminProductList({ sellerId: id, page: 1, limit: 50 });
  const orders = useAdminOrderList({ sellerId: id, page: 1, limit: 50 });

  const seller = member.data;
  const avatarUrl = resolveUploadUrl(seller?.image);

  const productCols = useMemo(
    () => [
      t("common.adminColEmpty"),
      t("common.adminColTitle"),
      t("common.adminColPrice"),
      t("common.adminColStock"),
      t("common.adminColStatus"),
      t("common.adminColCreated"),
    ],
    [t],
  );

  const orderCols = useMemo(
    () => [
      t("common.adminColOrder"),
      t("common.adminColBuyer"),
      t("common.adminColTotal"),
      t("common.adminColStatus"),
      t("common.adminColPlaced"),
    ],
    [t],
  );

  const productRows =
    products.data?.list.length ?
      products.data.list.map((p: ProductAdminListItem) => (
        <tr key={p._id} className="border-t border-neutral-100 transition hover:bg-[#FAFAFB]">
          <td className="px-4 py-3">
            {p.images?.[0] ? (
              <img
                src={resolveUploadUrl(p.images[0])}
                alt=""
                className="h-10 w-10 rounded-xl border border-neutral-200 object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl border border-neutral-200 bg-neutral-100" />
            )}
          </td>
          <td className="px-4 py-3 font-black text-slate-950">{p.title}</td>
          <td className="px-4 py-3 tabular-nums text-slate-700">${p.price.toFixed(2)}</td>
          <td className="px-4 py-3 tabular-nums text-slate-700">{p.stockCount}</td>
          <td className="px-4 py-3">
            <ProductStatusSelect
              value={p.status as ProductStatus}
              disabled={updateProduct.isPending}
              onChange={(status) => updateProduct.mutate({ id: p._id, status })}
            />
          </td>
          <td className="px-4 py-3 text-slate-600">
            {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
          </td>
        </tr>
      ))
    : undefined;

  const orderRows =
    orders.data?.list.length ?
      orders.data.list.map((o: OrderListRow) => (
        <tr key={o._id} className="border-t border-neutral-100 transition hover:bg-[#FAFAFB]">
          <td className="px-4 py-3 font-mono text-xs text-slate-600">{o._id.slice(-8)}</td>
          <td className="px-4 py-3 font-black text-slate-950">{o.memberId?.nick ?? "—"}</td>
          <td className="px-4 py-3 font-black tabular-nums text-slate-950">
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

  return (
    <AdminPageFrame
      title={seller?.nick ?? "…"}
      addon={
        <button
          type="button"
          onClick={() => navigate("/sellers/list")}
          className="text-sm font-semibold text-[#E11D48] hover:underline"
        >
          ← {t("common.adminSellerDetailBack")}
        </button>
      }
    >
      <div className="space-y-6">
        {/* Profile card */}
        <div className="flex flex-wrap items-start gap-5 rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={seller?.nick}
              className="h-16 w-16 shrink-0 rounded-2xl border border-neutral-200 object-cover"
            />
          ) : (
            <Initials name={seller?.nick ?? "?"} />
          )}
          <div className="flex-1 space-y-1">
            <p className="text-xl font-black text-slate-950">{seller?.nick ?? "—"}</p>
            <p className="text-sm text-slate-600">{seller?.email ?? "—"}</p>
            {seller?.phone ? (
              <p className="text-sm text-slate-500">
                <span className="font-semibold">{t("common.adminSellerDetailPhone")}:</span>{" "}
                {seller.phone}
              </p>
            ) : null}
            <p className="text-xs text-slate-400">
              {t("common.adminColJoined")}:{" "}
              {seller?.createdAt ? new Date(seller.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
          {seller ? (
            <MemberStatusSelect
              value={seller.status}
              disabled={updateMember.isPending}
              onChange={(status) =>
                updateMember.mutate({ id: seller._id, body: { status } })
              }
            />
          ) : null}
        </div>

        {/* Products */}
        <TableCard
          title={t("common.adminSellerDetailProductsTitle")}
          description={t("common.adminSellerDetailProductsDesc")}
          className="rounded-3xl border-neutral-200 shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
        >
          <DataTablePlaceholder
            columns={productCols}
            emptyMessage={
              products.isPending ? "…" : t("common.adminSellerDetailNoProducts")
            }
          >
            {productRows}
          </DataTablePlaceholder>
        </TableCard>

        {/* Orders */}
        <TableCard
          title={t("common.adminSellerDetailOrdersTitle")}
          description={t("common.adminSellerDetailOrdersDesc")}
          className="rounded-3xl border-neutral-200 shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
        >
          <DataTablePlaceholder
            columns={orderCols}
            emptyMessage={
              orders.isPending ? "…" : t("common.adminSellerDetailNoOrders")
            }
          >
            {orderRows}
          </DataTablePlaceholder>
        </TableCard>
      </div>
    </AdminPageFrame>
  );
}
