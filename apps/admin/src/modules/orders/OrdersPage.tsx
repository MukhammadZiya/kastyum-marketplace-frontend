import { Card } from "@repo/ui";
import { ActivityFeed } from "../../components/ActivityFeed";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { QuickActions } from "../../components/QuickActions";
import { StatGrid } from "../../components/StatGrid";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";

const ORDER_STATS = [
  { label: "Needs attention", value: "37", hint: "SLA or risk" },
  { label: "Shipped today", value: "89", hint: "Out for delivery" },
  { label: "Refunds (7d)", value: "12", hint: "Completed" },
] as const;

const ORDER_EVENTS = [
  {
    id: "o1",
    title: "Order #48291 — refund approved (buyer dispute)",
    time: "25m ago",
  },
  {
    id: "o2",
    title: "Carrier exception: #91002 delayed at hub",
    time: "1h ago",
  },
  {
    id: "o3",
    title: "Manual capture released for high-value order #48001",
    time: "3h ago",
  },
  {
    id: "o4",
    title: "Chargeback notice received — order #47712",
    time: "Yesterday",
  },
] as const;

export function OrdersPage() {
  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.orders}
      addon={
        <p className="text-sm text-slate-500">
          Fulfillment, payments, and exceptions
        </p>
      }
    >
      <StatGrid stats={[...ORDER_STATS]} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Recent order events"
          description="Refunds, shipping, and risk"
        >
          <ActivityFeed items={[...ORDER_EVENTS]} />
        </Card>

        <Card title="Quick actions" description="Common order operations">
          <QuickActions
            actions={[
              {
                id: "open-orders",
                label: "Open orders list",
                onClick: () => console.info("admin:orders-open-list"),
              },
              {
                id: "export-orders",
                label: "Export orders",
                onClick: () => console.info("admin:orders-export"),
              },
            ]}
          />
        </Card>
      </div>
    </AdminPageFrame>
  );
}
