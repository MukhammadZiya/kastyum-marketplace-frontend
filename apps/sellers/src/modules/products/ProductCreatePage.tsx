import { Card, StatCard } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SELLER_PAGE_COPY } from "../../constants/sellerNavigation";

const c = SELLER_PAGE_COPY.productsNew;

const STATS = [
  { label: "Drafts saved", value: "0", hint: "Auto-save when wired" },
  { label: "Images (max)", value: "12", hint: "Policy placeholder" },
  { label: "Variants", value: "—", hint: "Optional SKUs" },
] as const;

function FormScaffold({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-500">
      {label} — fields and validation connect here.
    </div>
  );
}

export function ProductCreatePage() {
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
          title="Basics"
          description="Title, description, category, pricing"
        >
          <FormScaffold label="Core product fields" />
        </Card>

        <Card title="Media & variants" description="Gallery, options, inventory">
          <FormScaffold label="Uploads and variant matrix" />
        </Card>
      </div>

      <Card title="Publish" description="Visibility and scheduling">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Primary action bar (save draft, publish) lives here.
          </p>
          <SellerShortcutNav
            links={[
              { to: "/products/list", label: "Back to list" },
              { to: "/products", label: "Overview", end: true },
            ]}
          />
        </div>
      </Card>
    </SellerPageFrame>
  );
}
