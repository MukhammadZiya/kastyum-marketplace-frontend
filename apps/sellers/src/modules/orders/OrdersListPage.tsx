import { Card, StatCard } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SellerTableScaffold } from "../../components/seller/SellerTableScaffold";
import { SELLER_PAGE_COPY } from "../../constants/sellerNavigation";

const c = SELLER_PAGE_COPY.ordersList;

const STATS = [
  { label: "Open", value: "7", hint: "Not completed" },
  { label: "Due today", value: "2", hint: "Ship-by date" },
  { label: "SLA risk", value: "0", hint: "Overdue ship" },
] as const;

const COLUMNS = [
  "Order",
  "Buyer",
  "Items",
  "Total",
  "Status",
  "Placed",
] as const;

export function OrdersListPage() {
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
          title="Orders"
          description="Filters, export, and row actions attach here"
        >
          <SellerTableScaffold
            columns={COLUMNS}
            emptyLabel="No orders loaded — bind your orders list API to fill this grid."
          />
        </Card>

        <Card title="Shortcuts" description="Related pages">
          <SellerShortcutNav
            links={[
              { to: "/orders", label: "Orders overview", end: true },
              { to: "/", label: "Dashboard" },
            ]}
          />
        </Card>
      </div>
    </SellerPageFrame>
  );
}
