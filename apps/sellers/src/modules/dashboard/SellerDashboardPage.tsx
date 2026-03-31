import { Card, StatCard } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SELLER_PAGE_COPY } from "../../constants/sellerNavigation";

const c = SELLER_PAGE_COPY.dashboard;

const STATS = [
  { label: "Active listings", value: "24", hint: "Published" },
  { label: "Open orders", value: "7", hint: "Awaiting fulfillment" },
  { label: "Revenue (30d)", value: "€4.2k", hint: "Estimated" },
] as const;

export function SellerDashboardPage() {
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
          title="Today"
          description="Orders and messages that need attention"
        >
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>New orders</span>
              <span className="font-medium text-slate-900">3</span>
            </li>
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>Low stock SKUs</span>
              <span className="font-medium text-amber-700">2</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Buyer messages</span>
              <span className="font-medium text-slate-900">0</span>
            </li>
          </ul>
        </Card>

        <Card title="Shortcuts" description="Jump to common tasks">
          <SellerShortcutNav
            links={[
              { to: "/products/new", label: "Add product" },
              { to: "/orders/list", label: "View orders" },
              { to: "/store/edit", label: "Edit store" },
            ]}
          />
          <p className="mt-4 text-xs text-slate-400">
            Same navigation pattern as Products, Orders, and Store sections.
          </p>
        </Card>
      </div>
    </SellerPageFrame>
  );
}
