import { Card } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";
import { DashboardStats } from "./DashboardStats";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";

const DASHBOARD_STATS = [
  { label: "Total Users", value: "12,480", hint: "Last 30 days" },
  { label: "Total Sellers", value: "842", hint: "Active storefronts" },
  { label: "Total Orders", value: "3,291", hint: "All statuses" },
] as const;

const RECENT_ACTIVITY = [
  {
    id: "1",
    title: "Seller “Northwind Goods” submitted verification documents",
    time: "2h ago",
  },
  {
    id: "2",
    title: "Order #48291 marked as refunded",
    time: "5h ago",
  },
  {
    id: "3",
    title: "New product queued for moderation: “Artisan mug set”",
    time: "Yesterday",
  },
  {
    id: "4",
    title: "CMS banner “Spring drop” published",
    time: "Yesterday",
  },
] as const;

export function DashboardPage() {
  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.dashboard}
      addon={
        <p className="text-sm text-slate-500">
          Overview of users, sellers, and orders
        </p>
      }
    >
      <DashboardStats stats={[...DASHBOARD_STATS]} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Recent Activity" description="Latest actions across the platform">
          <RecentActivity items={[...RECENT_ACTIVITY]} />
        </Card>

        <Card title="Quick Actions" description="Common moderation tasks">
          <QuickActions
            actions={[
              {
                id: "add-product",
                label: "Add product",
                onClick: () => console.info("admin:quick-add-product"),
              },
              {
                id: "approve-seller",
                label: "Approve seller",
                onClick: () => console.info("admin:quick-approve-seller"),
              },
            ]}
          />
        </Card>
      </div>
    </AdminPageFrame>
  );
}
