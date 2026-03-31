import { Card } from "@repo/ui";
import { ActivityFeed } from "../../components/ActivityFeed";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { QuickActions } from "../../components/QuickActions";
import { StatGrid } from "../../components/StatGrid";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";

const USER_STATS = [
  { label: "Registered buyers", value: "12,480", hint: "All time" },
  { label: "Active (30d)", value: "6,910", hint: "Signed in or ordered" },
  { label: "New this week", value: "214", hint: "Awaiting first order" },
] as const;

const USER_EVENTS = [
  {
    id: "u1",
    title: "Account flagged: repeated failed logins for user@example.com",
    time: "35m ago",
  },
  {
    id: "u2",
    title: "Profile email verified: jane.d@mail.com",
    time: "2h ago",
  },
  {
    id: "u3",
    title: "Buyer role elevated to wholesale for “Acme Retail”",
    time: "5h ago",
  },
  {
    id: "u4",
    title: "User self-deletion requested (cooling-off)",
    time: "Yesterday",
  },
] as const;

export function UsersPage() {
  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.users}
      addon={
        <p className="text-sm text-slate-500">
          Buyer accounts, verification, and access
        </p>
      }
    >
      <StatGrid stats={[...USER_STATS]} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Recent user events"
          description="Sign-ins, changes, and flags"
        >
          <ActivityFeed items={[...USER_EVENTS]} />
        </Card>

        <Card title="Quick actions" description="Common user admin tasks">
          <QuickActions
            actions={[
              {
                id: "export-users",
                label: "Export CSV",
                onClick: () => console.info("admin:users-export"),
              },
              {
                id: "invite-user",
                label: "Invite buyer",
                onClick: () => console.info("admin:users-invite"),
              },
            ]}
          />
        </Card>
      </div>
    </AdminPageFrame>
  );
}
