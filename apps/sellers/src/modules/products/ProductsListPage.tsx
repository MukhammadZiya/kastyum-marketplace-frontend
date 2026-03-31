import { Card, StatCard } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SellerTableScaffold } from "../../components/seller/SellerTableScaffold";
import { SELLER_PAGE_COPY } from "../../constants/sellerNavigation";

const c = SELLER_PAGE_COPY.productsList;

const STATS = [
  { label: "Total SKUs", value: "27", hint: "All states" },
  { label: "Published", value: "24", hint: "Buyer-visible" },
  { label: "Archived", value: "0", hint: "Hidden history" },
] as const;

const COLUMNS = [
  "Product",
  "SKU",
  "Price",
  "Stock",
  "Status",
  "Updated",
] as const;

export function ProductsListPage() {
  return (
    <SellerPageFrame
      title={c.title}
      addon={<p className="text-sm text-slate-500">{c.description}</p>}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,280px)]">
        <Card
          title="Inventory"
          description="Search, filters, and bulk actions map here"
        >
          <SellerTableScaffold
            columns={COLUMNS}
            emptyLabel="No rows yet — connect your list endpoint to populate this table."
          />
        </Card>

        <Card title="Shortcuts" description="Related pages">
          <SellerShortcutNav
            links={[
              { to: "/products", label: "Products overview", end: true },
              { to: "/products/new", label: "Add product" },
            ]}
          />
        </Card>
      </div>
    </SellerPageFrame>
  );
}
