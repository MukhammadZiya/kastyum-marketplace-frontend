import { Card, StatCard } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SELLER_PAGE_COPY } from "../../constants/sellerNavigation";

const c = SELLER_PAGE_COPY.storeOverview;

const STATS = [
  { label: "Profile complete", value: "85%", hint: "Checklist" },
  { label: "Policies on file", value: "2/3", hint: "Shipping, returns…" },
  { label: "Public since", value: "Jan '25", hint: "Placeholder" },
] as const;

export function StoreOverviewPage() {
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
          title="How buyers see you"
          description="Summary of storefront identity"
        >
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>Display name</span>
              <span className="font-medium text-slate-900">Demo store</span>
            </li>
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>Support email</span>
              <span className="font-medium text-slate-900">set in edit</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Banner & logo</span>
              <span className="font-medium text-emerald-700">Uploaded</span>
            </li>
          </ul>
        </Card>

        <Card title="Shortcuts" description="Manage storefront details">
          <SellerShortcutNav
            links={[
              { to: "/store/edit", label: "Edit store" },
              { to: "/store", label: "Overview", end: true },
            ]}
          />
          <p className="mt-4 text-xs text-slate-400">
            Swap placeholder values for live store settings from your backend.
          </p>
        </Card>
      </div>
    </SellerPageFrame>
  );
}
