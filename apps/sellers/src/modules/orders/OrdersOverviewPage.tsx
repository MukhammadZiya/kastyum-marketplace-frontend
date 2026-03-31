import { Card, StatCard } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SELLER_PAGE_COPY } from "../../constants/sellerNavigation";

const c = SELLER_PAGE_COPY.ordersOverview;

const STATS = [
  { label: "Awaiting ship", value: "5", hint: "Needs fulfillment" },
  { label: "In transit", value: "12", hint: "Last 7 days" },
  { label: "Completed (30d)", value: "48", hint: "Closed orders" },
] as const;

export function OrdersOverviewPage() {
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
          title="Pipeline"
          description="Where attention is needed"
        >
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>Payment pending</span>
              <span className="font-medium text-amber-700">1</span>
            </li>
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>Ready to pack</span>
              <span className="font-medium text-slate-900">5</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Returns open</span>
              <span className="font-medium text-slate-900">0</span>
            </li>
          </ul>
        </Card>

        <Card title="Shortcuts" description="Operational views">
          <SellerShortcutNav
            links={[
              { to: "/orders/list", label: "All orders" },
              { to: "/orders", label: "Overview", end: true },
            ]}
          />
          <p className="mt-4 text-xs text-slate-400">
            Replace static counts with order aggregates from your API.
          </p>
        </Card>
      </div>
    </SellerPageFrame>
  );
}
