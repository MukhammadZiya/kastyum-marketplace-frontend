import { TableCard } from "@repo/ui";
import type { ProductAdminListItem } from "@repo/types";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";
import {
  useAdminProductDelete,
  useAdminProductList,
} from "../../hooks/admin-products";
import { getAuthToken } from "@repo/api";
import { getAdminListEmptyMessage } from "../../lib/adminListEmptyMessage";

export function ProductsListPage() {
  const signedIn = !!getAuthToken();
  const { data, isPending, isError, error } = useAdminProductList({
    page: 1,
    limit: 50,
  });
  const deleteProduct = useAdminProductDelete();

  const emptyMessage = getAdminListEmptyMessage({
    signedIn,
    isPending,
    isError,
    error,
    signInHint: "Sign in as admin to load products.",
    whenEmpty: "No products.",
  });

  const rowEls =
    data?.list.length ?
      data.list.map((p: ProductAdminListItem) => (
        <tr key={p._id} className="border-t border-slate-100">
          <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
          <td className="px-4 py-3 text-slate-600">{p.modelNumber}</td>
          <td className="px-4 py-3">{p.sellerId.nick}</td>
          <td className="px-4 py-3">{p.status}</td>
          <td className="px-4 py-3 text-slate-600">
            {p.updatedAt
              ? new Date(p.updatedAt).toLocaleDateString()
              : "—"}
          </td>
          <td className="px-4 py-3">
            <button
              type="button"
              className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
              disabled={deleteProduct.isPending}
              onClick={() => {
                if (
                  typeof window !== "undefined" &&
                  !window.confirm("Delete or soft-delete this product?")
                ) {
                  return;
                }
                deleteProduct.mutate(p._id);
              }}
            >
              Remove
            </button>
          </td>
        </tr>
      ))
    : undefined;

  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.products}
      addon={
        <p className="text-sm text-slate-500">
          Catalog moderation — remove runs admin delete endpoint.
        </p>
      }
    >
      <TableCard
        title="All products"
        description={`Total ${data?.total ?? 0} in catalog (this page ${data?.list.length ?? 0}).`}
      >
        <DataTablePlaceholder
          columns={["Title", "SKU", "Seller", "Status", "Updated", ""]}
          emptyMessage={emptyMessage}
        >
          {rowEls}
        </DataTablePlaceholder>
      </TableCard>
    </AdminPageFrame>
  );
}
