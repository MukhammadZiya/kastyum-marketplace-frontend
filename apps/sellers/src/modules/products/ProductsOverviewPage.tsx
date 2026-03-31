import { Card, StatCard } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SELLER_PAGE_COPY } from "../../constants/sellerNavigation";

const c = SELLER_PAGE_COPY.productsOverview;

const STATS = [
  { label: "Published", value: "24", hint: "Live on marketplace" },
  { label: "Drafts", value: "3", hint: "Not visible" },
  { label: "Low stock", value: "2", hint: "Below threshold" },
] as const;

export function ProductsOverviewPage() {
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Catalog snapshot"
          description="Status mix for your listings"
        >
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>With images</span>
              <span className="font-medium text-slate-900">22</span>
            </li>
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>Missing description</span>
              <span className="font-medium text-amber-700">1</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Scheduled changes</span>
              <span className="font-medium text-slate-900">0</span>
            </li>
          </ul>
        </Card>

        <Card title="Shortcuts" description="Jump to product workflows">
          <SellerShortcutNav
            links={[
              { to: "/products/list", label: "All products" },
              { to: "/products/new", label: "Add product" },
              { to: "/products", label: "Overview", end: true },
            ]}
          />
          <p className="mt-4 text-xs text-slate-400">
            Hook counts and rows to your catalog API when ready.
          </p>
        </Card>
      </div>
    </SellerPageFrame>
  );
}
