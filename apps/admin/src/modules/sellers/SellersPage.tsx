import { useNavigate } from "react-router-dom";
import { Card } from "@repo/ui";
import { ActivityFeed } from "../../components/ActivityFeed";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { QuickActions } from "../../components/QuickActions";
import { StatGrid } from "../../components/StatGrid";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";

const SELLER_STATS = [
  { label: "Active stores", value: "842", hint: "Live on marketplace" },
  { label: "Pending review", value: "23", hint: "Onboarding / KYC" },
  { label: "Suspended", value: "6", hint: "Policy or fraud" },
] as const;

const SELLER_EVENTS = [
  {
    id: "s1",
    title: "Store “Northwind Goods” submitted verification documents",
    time: "2h ago",
  },
  {
    id: "s2",
    title: "Payout hold released for seller #4412",
    time: "4h ago",
  },
  {
    id: "s3",
    title: "Listing cap raised for “Artisan Co-op”",
    time: "Yesterday",
  },
  {
    id: "s4",
    title: "Seller appeal opened: policy strike dispute",
    time: "Yesterday",
  },
] as const;

export function SellersPage() {
  const navigate = useNavigate();

  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.sellers}
      addon={
        <p className="text-sm text-slate-500">
          Stores, onboarding, compliance, and payouts
        </p>
      }
    >
      <StatGrid stats={[...SELLER_STATS]} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Recent seller events"
          description="Verification, holds, and policy"
        >
          <ActivityFeed items={[...SELLER_EVENTS]} />
        </Card>

        <Card title="Quick actions" description="Common seller admin tasks">
          <QuickActions
            actions={[
              {
                id: "see-sellers",
                label: "See all sellers",
                onClick: () => navigate("/sellers/list"),
              },
              {
                id: "add-seller",
                label: "Add seller",
                onClick: () => navigate("/sellers/new"),
              },
            ]}
          />
        </Card>
      </div>
    </AdminPageFrame>
  );
}
