import { useMemo, useState } from "react";
import type { ProductSellerListItem, ProductStatus } from "@repo/types";
import { getAuthToken } from "@repo/api";
import { Button, Card } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerProductDrawer } from "../../components/seller/SellerProductDrawer";
import { SellerTableScaffold } from "../../components/seller/SellerTableScaffold";
import { SELLER_PAGE_COPY_KEYS } from "../../constants/sellerNavigation";
import { useSellerProductList, useSellerProductUpdateStatus } from "../../hooks/seller-products";
import { useT } from "../../i18n";

const copy = SELLER_PAGE_COPY_KEYS.inventoryPage;

const productStatuses: ProductStatus[] = ["ACTIVE", "INACTIVE"];

export function SellerInventoryPage() {
  const t = useT();
  const signedIn = !!getAuthToken();
  const { data, isPending, isError, error } = useSellerProductList({
    page: 1,
    limit: 50,
  });
  const updateStatus = useSellerProductUpdateStatus();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editProductId, setEditProductId] = useState<string | null>(null);

  function openCreate() {
    setDrawerMode("create");
    setEditProductId(null);
    setDrawerOpen(true);
  }

  function openEdit(id: string) {
    setDrawerMode("edit");
    setEditProductId(id);
    setDrawerOpen(true);
  }

  const columns = useMemo(
    () => [
      t("common.sellerColProduct"),
      t("common.sellerColSku"),
      t("common.sellerColPrice"),
      t("common.sellerColStock"),
      t("common.sellerColAvailable"),
      t("common.sellerColSold"),
      t("common.sellerColStatus"),
      t("common.sellerColUpdated"),
    ],
    [t],
  );

  const emptyLabel = !signedIn
    ? t("common.sellerEmptySignInProducts")
    : isPending
      ? t("common.sellerLoading")
      : isError
        ? error instanceof Error
          ? error.message
          : t("common.sellerErrorLoadProducts")
        : t("common.sellerEmptyNoProducts");

  const rowEls =
    data?.list.length ?
      data.list.map((p: ProductSellerListItem) => (
        <tr key={p._id} className="border-t border-neutral-100 transition hover:bg-[#FAFAFB]">
          <td className="px-4 py-4">
            <button
              type="button"
              onClick={() => openEdit(p._id)}
              className="text-left font-black text-slate-950 underline-offset-2 transition hover:text-[#BE123C] hover:underline"
            >
              {p.title}
            </button>
          </td>
          <td className="px-4 py-4 text-slate-600">{p.modelNumber}</td>
          <td className="px-4 py-4 font-black tabular-nums text-slate-950">
            ${p.price.toFixed(2)}
          </td>
          <td className="px-4 py-4 tabular-nums">{p.stockCount}</td>
          <td className="px-4 py-4 tabular-nums">
            {p.status === "ACTIVE" ? p.stockCount : 0}
          </td>
          <td className="px-4 py-4 tabular-nums">{p.soldCount ?? 0}</td>
          <td className="px-4 py-4">
            <select
              value={p.status}
              disabled={updateStatus.isPending}
              onChange={(e) =>
                updateStatus.mutate({ id: p._id, status: e.target.value as ProductStatus })
              }
              className={`cursor-pointer rounded-full border-0 px-3 py-1 text-xs font-black outline-none ring-1 transition focus:ring-2 ${
                p.status === "ACTIVE"
                  ? "bg-[#FFF1F2] text-[#BE123C] ring-[#FECDD3] focus:ring-[#BE123C]"
                  : "bg-slate-100 text-slate-500 ring-slate-200 focus:ring-slate-400"
              }`}
            >
              {productStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </td>
          <td className="px-4 py-4 text-slate-600">
            {p.updatedAt
              ? new Date(p.updatedAt).toLocaleDateString()
              : t("common.sellerEmDash")}
          </td>
        </tr>
      ))
    : undefined;

  return (
    <>
      <SellerPageFrame
        title={t(copy.titleKey)}
        addon={
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-500">{t(copy.descriptionKey)}</p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={openCreate}
              className="shrink-0 !border-[#E11D48] !bg-[#E11D48] hover:!bg-[#BE123C]"
            >
              + {t("common.sellerInventoryNewProduct")}
            </Button>
          </div>
        }
      >
        <Card
          title={t("common.sellerProductsListInventoryTitle")}
          description={t("common.sellerProductsListInventoryDesc")}
          className="rounded-3xl border-neutral-200 shadow-[0_20px_60px_-52px_rgba(15,23,42,0.8)]"
        >
          <SellerTableScaffold columns={columns} emptyLabel={emptyLabel}>
            {rowEls}
          </SellerTableScaffold>
        </Card>
      </SellerPageFrame>

      <SellerProductDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={drawerMode}
        productId={editProductId}
      />
    </>
  );
}
