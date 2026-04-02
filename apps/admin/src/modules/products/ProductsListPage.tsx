import { TableCard } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";
import type { AdminProductListResponse } from "../../lib/marketplaceTypes";

export function ProductsListPage() {
  const catalog: AdminProductListResponse = { list: [], total: 0 };

  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.products}
      addon={
        <p className="text-sm text-slate-500">
          Catalog and moderation queue — search and status filters go here.
        </p>
      }
    >
      <TableCard
        title="All products"
        description="Placeholder grid until the catalog API is connected."
      >
        <DataTablePlaceholder
          columns={["Title", "SKU", "Seller", "Status", "Updated"]}
          emptyMessage={
            catalog.total === 0
              ? "No rows loaded yet — fetch from your API and map rows here."
              : ""
          }
        />
      </TableCard>
    </AdminPageFrame>
  );
}
