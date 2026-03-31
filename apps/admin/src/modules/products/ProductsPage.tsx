import { Card } from "@repo/ui";
import { ActivityFeed } from "../../components/ActivityFeed";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { QuickActions } from "../../components/QuickActions";
import { StatGrid } from "../../components/StatGrid";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";

const PRODUCT_STATS = [
  { label: "Live listings", value: "48,200", hint: "Buyer-visible" },
  { label: "In moderation", value: "156", hint: "Awaiting decision" },
  { label: "Rejected (7d)", value: "41", hint: "Policy or quality" },
] as const;

const PRODUCT_EVENTS = [
  {
    id: "p1",
    title: "Listing flagged: possible counterfeit — “Pro headphones X”",
    time: "1h ago",
  },
  {
    id: "p2",
    title: "Bulk approve: 12 SKUs from verified seller",
    time: "3h ago",
  },
  {
    id: "p3",
    title: "Category remap requested for “Handmade ceramics”",
    time: "5h ago",
  },
  {
    id: "p4",
    title: "Product delisted: IP complaint reference #8821",
    time: "Yesterday",
  },
] as const;

export function ProductsPage() {
  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.products}
      addon={
        <p className="text-sm text-slate-500">
          Moderation, policy, and catalog health
        </p>
      }
    >
      <StatGrid stats={[...PRODUCT_STATS]} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Recent product events"
          description="Flags, approvals, and takedowns"
        >
          <ActivityFeed items={[...PRODUCT_EVENTS]} />
        </Card>

        <Card title="Quick actions" description="Common moderation tasks">
          <QuickActions
            actions={[
              {
                id: "moderation-queue",
                label: "Moderation queue",
                onClick: () => console.info("admin:products-moderation-queue"),
              },
              {
                id: "bulk-unlist",
                label: "Bulk unlist",
                onClick: () => console.info("admin:products-bulk-unlist"),
              },
            ]}
          />
        </Card>
      </div>
    </AdminPageFrame>
  );
}
