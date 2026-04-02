import { Card, StatCard } from "@repo/ui";
import type { ProductWithRelations } from "@repo/types";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SellerTableScaffold } from "../../components/seller/SellerTableScaffold";
import { SELLER_PAGE_COPY } from "../../constants/sellerNavigation";
import { useSellerProductList } from "../../hooks/seller-products";
import { getAuthToken } from "@repo/api";

const c = SELLER_PAGE_COPY.productsList;

const COLUMNS = [
  "Product",
  "SKU",
  "Price",
  "Stock",
  "Status",
  "Updated",
] as const;

export function ProductsListPage() {
  const signedIn = !!getAuthToken();
  const { data, isPending, isError, error } = useSellerProductList({
    page: 1,
    limit: 50,
  });

  const total = data?.total ?? 0;
  const activeCount =
    data?.list.filter((p: ProductWithRelations) => p.status === "ACTIVE")
      .length ?? 0;

  const stats = [
    { label: "Total SKUs", value: String(total), hint: "This page" },
    { label: "Published", value: String(activeCount), hint: "ACTIVE" },
    {
      label: "Archived",
      value: String(
        (data?.list.filter((p: ProductWithRelations) => p.status === "DELETE")
          .length ?? 0),
      ),
      hint: "DELETE",
    },
  ] as const;

  const emptyLabel = !signedIn
    ? "Sign in as a seller to load inventory."
    : isPending
      ? "Loading…"
      : isError
        ? error instanceof Error
          ? error.message
          : "Could not load products."
        : "No products yet.";

  const rowEls =
    data?.list.length ?
      data.list.map((p: ProductWithRelations) => (
        <tr key={p._id} className="border-t border-slate-100">
          <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
          <td className="px-4 py-3 text-slate-600">{p.modelNumber}</td>
          <td className="px-4 py-3">${p.price.toFixed(2)}</td>
          <td className="px-4 py-3">{p.stockCount}</td>
          <td className="px-4 py-3">{p.status}</td>
          <td className="px-4 py-3 text-slate-600">
            {p.updatedAt
              ? new Date(p.updatedAt).toLocaleDateString()
              : "—"}
          </td>
        </tr>
      ))
    : undefined;

  return (
    <SellerPageFrame
      title={c.title}
      addon={<p className="text-sm text-slate-500">{c.description}</p>}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,280px)]">
        <Card
          title="Inventory"
          description="Search, filters, and bulk actions map here"
        >
          <SellerTableScaffold columns={COLUMNS} emptyLabel={emptyLabel}>
            {rowEls}
          </SellerTableScaffold>
        </Card>

        <Card title="Shortcuts" description="Related pages">
          <SellerShortcutNav
            links={[
              { to: "/products", label: "Products overview", end: true },
              { to: "/products/new", label: "Add product" },
            ]}
          />
        </Card>
      </div>
    </SellerPageFrame>
  );
}
