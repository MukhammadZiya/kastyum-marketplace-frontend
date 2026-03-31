import { TableCard } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { DataTablePlaceholder } from "../../components/DataTablePlaceholder";
import { ModuleSubNav } from "../../components/ModuleSubNav";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";
import { PRODUCTS_SUBNAV } from "./productsNav";

export function ProductsListPage() {
  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.products}
      tabs={<ModuleSubNav items={PRODUCTS_SUBNAV} />}
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
          emptyMessage="No rows loaded yet — fetch from your API and map rows here."
        />
      </TableCard>
    </AdminPageFrame>
  );
}
