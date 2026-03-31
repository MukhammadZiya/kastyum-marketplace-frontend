import { Card, StatCard } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SELLER_PAGE_COPY } from "../../constants/sellerNavigation";

const c = SELLER_PAGE_COPY.storeEdit;

const STATS = [
  { label: "Last saved", value: "—", hint: "When autosave exists" },
  { label: "Required fields", value: "4/5", hint: "Validation stub" },
  { label: "Preview", value: "Live", hint: "Buyer-facing" },
] as const;

function FormScaffold({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-500">
      {label} — inputs and file pickers connect here.
    </div>
  );
}

export function StoreEditPage() {
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
          title="Branding"
          description="Logo, banner, accent colors"
        >
          <FormScaffold label="Media and visual identity" />
        </Card>

        <Card title="Contact & policies" description="Email, phone, shipping & returns">
          <FormScaffold label="Structured policy blocks" />
        </Card>
      </div>

      <Card title="Save changes" description="Review and publish updates">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Primary actions: discard, save draft, publish to storefront.
          </p>
          <SellerShortcutNav
            links={[
              { to: "/store", label: "Back to profile", end: true },
              { to: "/", label: "Dashboard" },
            ]}
          />
        </div>
      </Card>
    </SellerPageFrame>
  );
}
