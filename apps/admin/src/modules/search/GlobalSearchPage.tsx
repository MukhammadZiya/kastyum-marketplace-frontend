import { useState, useRef } from "react";
import { Search, User, Package, ShoppingBag, Store } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Member, ProductAdminListItem, OrderListRow } from "@repo/types";
import {
  getAdminMemberList,
  getAdminProductList,
  getAdminOrderList,
  getAuthToken,
} from "@repo/api";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { useT } from "../../i18n";

const inputClass =
  "w-full rounded-2xl border border-neutral-200 bg-[#FAFAFB] px-5 py-4 pl-12 text-base text-slate-950 outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/10";

function Section({
  icon,
  title,
  count,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_60px_-52px_rgba(15,23,42,0.8)]">
      <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#BE123C]">
          {icon}
        </span>
        <span className="font-black text-slate-950">{title}</span>
        <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-black text-slate-600">
          {count}
        </span>
      </div>
      <div className="divide-y divide-neutral-50">{children}</div>
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div className="px-5 py-8 text-center text-sm text-slate-400">{text}</div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-3 px-5 py-3">
      <div className="h-4 w-1/3 rounded bg-neutral-100" />
      <div className="h-3 w-1/4 rounded bg-neutral-100" />
      <div className="ml-auto h-3 w-16 rounded bg-neutral-100" />
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const isActive = value === "ACTIVE" || value === "DELIVERED" || value === "CONFIRMED";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-black ${
        isActive
          ? "bg-[#FFF1F2] text-[#BE123C]"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {value}
    </span>
  );
}

export function GlobalSearchPage() {
  const t = useT();
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const signedIn = !!getAuthToken();

  const enabled = signedIn && submitted.trim().length >= 1;

  const { data: membersData, isPending: membersPending } = useQuery({
    queryKey: ["admin", "search", "members", submitted],
    queryFn: () => getAdminMemberList({ search: submitted, limit: 20 }),
    enabled,
  });

  const { data: productsData, isPending: productsPending } = useQuery({
    queryKey: ["admin", "search", "products", submitted],
    queryFn: () => getAdminProductList({ q: submitted, limit: 20 }),
    enabled,
  });

  const { data: ordersData, isPending: ordersPending } = useQuery({
    queryKey: ["admin", "search", "orders", submitted],
    queryFn: () => getAdminOrderList({ limit: 100 }),
    enabled,
    select: (data) => {
      const q = submitted.toLowerCase();
      return {
        ...data,
        list: data.list.filter(
          (o: OrderListRow) =>
            o._id.toLowerCase().includes(q) ||
            (o.memberId as Member)?.nick?.toLowerCase().includes(q) ||
            (o.memberId as Member)?.email?.toLowerCase().includes(q) ||
            (o.sellerId as Member)?.nick?.toLowerCase().includes(q) ||
            o.status.toLowerCase().includes(q),
        ),
      };
    },
  });

  const members = membersData?.list ?? [];
  const users = members.filter((m: Member) => m.type === "USER");
  const sellers = members.filter((m: Member) => m.type === "SELLER");
  const products = productsData?.list ?? [];
  const orders = ordersData?.list ?? [];
  const isLoading = membersPending || productsPending || ordersPending;
  const total = users.length + sellers.length + products.length + orders.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) setSubmitted(query.trim());
  }

  return (
    <AdminPageFrame title="Global Search">
      <div className="space-y-6">
        {/* Search bar */}
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              ref={inputRef}
              className={inputClass}
              placeholder={t("common.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-[#E11D48] px-4 py-2 text-sm font-black text-white transition hover:bg-[#BE123C] disabled:opacity-40"
              disabled={!query.trim()}
            >
              {t("common.searchButton")}
            </button>
          </div>
        </form>

        {/* Summary */}
        {submitted && !isLoading && (
          <p className="text-sm text-slate-500">
            <span className="font-black text-slate-900">{total}</span>{" "}
            {t("common.searchResultsFor")}{" "}
            <span className="font-black text-[#E11D48]">"{submitted}"</span>
          </p>
        )}

        {/* Results */}
        {submitted && (
          <div className="space-y-5">
            {/* Users */}
            <Section icon={<User className="h-4 w-4" />} title={t("common.searchSectionUsers")} count={users.length}>
              {membersPending ? (
                [0, 1, 2].map((i) => <SkeletonRow key={i} />)
              ) : users.length === 0 ? (
                <EmptyRow text={t("common.searchEmptyUsers")} />
              ) : (
                users.map((m: Member) => (
                  <div key={m._id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 hover:bg-[#FAFAFB]">
                    <span className="font-black text-slate-950">{m.nick}</span>
                    <span className="text-sm text-slate-500">{m.email}</span>
                    {m.phone && <span className="text-sm text-slate-400">{m.phone}</span>}
                    <span className="ml-auto"><StatusBadge value={m.status} /></span>
                  </div>
                ))
              )}
            </Section>

            {/* Sellers */}
            <Section icon={<Store className="h-4 w-4" />} title={t("common.searchSectionSellers")} count={sellers.length}>
              {membersPending ? (
                [0, 1, 2].map((i) => <SkeletonRow key={i} />)
              ) : sellers.length === 0 ? (
                <EmptyRow text={t("common.searchEmptySellers")} />
              ) : (
                sellers.map((m: Member) => (
                  <div key={m._id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 hover:bg-[#FAFAFB]">
                    <span className="font-black text-slate-950">{m.nick}</span>
                    <span className="text-sm text-slate-500">{m.email}</span>
                    {m.phone && <span className="text-sm text-slate-400">{m.phone}</span>}
                    <span className="ml-auto"><StatusBadge value={m.status} /></span>
                  </div>
                ))
              )}
            </Section>

            {/* Products */}
            <Section icon={<Package className="h-4 w-4" />} title={t("common.searchSectionProducts")} count={products.length}>
              {productsPending ? (
                [0, 1, 2].map((i) => <SkeletonRow key={i} />)
              ) : products.length === 0 ? (
                <EmptyRow text={t("common.searchEmptyProducts")} />
              ) : (
                products.map((p: ProductAdminListItem) => (
                  <div key={p._id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 hover:bg-[#FAFAFB]">
                    <span className="font-black text-slate-950">{p.title}</span>
                    <span className="text-sm text-slate-500">
                      ${p.price.toFixed(2)}
                    </span>
                    {p.modelNumber && (
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500">
                        {p.modelNumber}
                      </span>
                    )}
                    <span className="ml-auto"><StatusBadge value={p.status} /></span>
                  </div>
                ))
              )}
            </Section>

            {/* Orders */}
            <Section icon={<ShoppingBag className="h-4 w-4" />} title={t("common.searchSectionOrders")} count={orders.length}>
              {ordersPending ? (
                [0, 1, 2].map((i) => <SkeletonRow key={i} />)
              ) : orders.length === 0 ? (
                <EmptyRow text={t("common.searchEmptyOrders")} />
              ) : (
                orders.map((o: OrderListRow) => (
                  <div key={o._id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 hover:bg-[#FAFAFB]">
                    <span className="font-mono text-xs text-slate-500">{o._id}</span>
                    <span className="font-black text-slate-950">
                      {(o.memberId as Member)?.nick ?? "—"}
                    </span>
                    <span className="text-sm text-slate-500">
                      ${o.totalAmount?.toFixed(2) ?? "—"}
                    </span>
                    <span className="ml-auto"><StatusBadge value={o.status} /></span>
                  </div>
                ))
              )}
            </Section>
          </div>
        )}

        {/* Empty state before first search */}
        {!submitted && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-white py-20 text-center">
            <Search className="mb-4 h-10 w-10 text-slate-200" strokeWidth={1.5} />
            <p className="font-black text-slate-950">{t("common.searchEmptyStateTitle")}</p>
            <p className="mt-1 max-w-xs text-sm text-slate-400">
              {t("common.searchEmptyStateDesc")}
            </p>
          </div>
        )}
      </div>
    </AdminPageFrame>
  );
}
