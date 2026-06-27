import { useMemo } from "react";
import { TableCard } from "@repo/ui";
import type { ProductAdminListItem, ProductStatus } from "@repo/types";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { ProductStatusSelect } from "../../components/ProductStatusSelect";
import { ADMIN_PAGE_TITLE_KEYS } from "../../constants/adminNavigation";
import {
  useAdminProductDelete,
  useAdminProductList,
  useAdminProductUpdate,
} from "../../hooks/admin-products";
import { getAuthToken } from "@repo/api";
import { getAdminListEmptyMessage } from "../../lib/adminListEmptyMessage";
import { useT } from "../../i18n";

export function ProductsListPage() {
  const t = useT();
  const signedIn = !!getAuthToken();
  const { data, isPending, isError, error } = useAdminProductList({
    page: 1,
    limit: 50,
  });
  const deleteProduct = useAdminProductDelete();
  const updateProduct = useAdminProductUpdate();

  const emptyMessage = getAdminListEmptyMessage({
    signedIn,
    isPending,
    isError,
    error,
    signInHint: t("common.adminEmptySignInProducts"),
    whenEmpty: t("common.adminEmptyProducts"),
  });

  const columns = useMemo(
    () => [
      t("common.adminColTitle"),
      t("common.adminColSku"),
      t("common.adminColCategory"),
      t("common.adminColSeller"),
      t("common.adminColStatus"),
      t("common.adminColUpdated"),
      t("common.adminColEmpty"),
    ],
    [t],
  );

  const rowEls =
    data?.list.length ?
      data.list.map((p: ProductAdminListItem) => (
        <tr
          key={p._id}
          className="border-t border-neutral-100 transition hover:bg-[#FAFAFB]"
        >
          <td className="px-4 py-3 font-black text-slate-950">{p.title}</td>
          <td className="px-4 py-3 text-slate-600">{p.modelNumber}</td>
          <td className="px-4 py-3 text-slate-600">{p.category?.name || "—"}</td>
          <td className="px-4 py-3 font-medium text-slate-800">
            {p.sellerId.nick}
          </td>
          <td className="px-4 py-3">
            <ProductStatusSelect
              value={p.status as ProductStatus}
              disabled={updateProduct.isPending}
              onChange={(status) => updateProduct.mutate({ id: p._id, status })}
            />
          </td>
          <td className="px-4 py-3 text-slate-600">
            {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "—"}
          </td>
          <td className="px-4 py-3">
            <button
              type="button"
              className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
              disabled={deleteProduct.isPending}
              onClick={() => {
                if (
                  typeof window !== "undefined" &&
                  !window.confirm(t("common.adminProductsDeleteConfirm"))
                ) {
                  return;
                }
                deleteProduct.mutate(p._id);
              }}
            >
              {t("common.adminRemove")}
            </button>
          </td>
        </tr>
      ))
    : undefined;

  const tableDescription = `${t("common.adminTotal")} ${data?.total ?? 0} ${t("common.adminInCatalog")} (${t("common.adminThisPage")} ${data?.list.length ?? 0}).`;

  return (
    <AdminPageFrame
      title={t(ADMIN_PAGE_TITLE_KEYS.products)}
      addon={
        <p className="text-sm text-slate-500">
          {t("common.adminProductsListAddon")}
        </p>
      }
    >
      <TableCard
        title={t("common.adminProductsListTitle")}
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
