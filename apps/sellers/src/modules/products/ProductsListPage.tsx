import { useMemo } from "react";
import { Card, StatCard } from "@repo/ui";
import type { ProductWithRelations } from "@repo/types";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SellerTableScaffold } from "../../components/seller/SellerTableScaffold";
import { SELLER_PAGE_COPY_KEYS } from "../../constants/sellerNavigation";
import { useSellerProductList } from "../../hooks/seller-products";
import { getAuthToken } from "@repo/api";
import { useT } from "../../i18n";

const copy = SELLER_PAGE_COPY_KEYS.productsList;

export function ProductsListPage() {
  const t = useT();
  const signedIn = !!getAuthToken();
  const { data, isPending, isError, error } = useSellerProductList({
    page: 1,
    limit: 50,
  });

  const total = data?.total ?? 0;
  const activeCount =
    data?.list.filter((p: ProductWithRelations) => p.status === "ACTIVE")
      .length ?? 0;

  const stats = useMemo(
    () => [
      {
        id: "total",
        label: t("common.sellerProductsListStatTotal"),
        value: String(total),
        hint: t("common.sellerProductsListStatTotalHint"),
      },
      {
        id: "pub",
        label: t("common.sellerProductsListStatPublished"),
        value: String(activeCount),
        hint: t("common.sellerProductsListStatPublishedHint"),
      },
      {
        id: "arch",
        label: t("common.sellerProductsListStatArchived"),
        value: String(
          data?.list.filter((p: ProductWithRelations) => p.status === "DELETE")
            .length ?? 0,
        ),
        hint: t("common.sellerProductsListStatArchivedHint"),
      },
    ],
    [t, total, activeCount, data?.list],
  );

  const columns = useMemo(
    () => [
      t("common.sellerColProduct"),
      t("common.sellerColSku"),
      t("common.sellerColPrice"),
      t("common.sellerColStock"),
      t("common.sellerColStatus"),
      t("common.sellerColUpdated"),
    ],
    [t],
  );

  const emptyLabel = !signedIn
    ? t("common.sellerEmptySignInProducts")
    : isPending
      ? t("common.sellerLoading")
      : isError
        ? error instanceof Error
          ? error.message
          : t("common.sellerErrorLoadProducts")
        : t("common.sellerEmptyNoProducts");

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
              : t("common.sellerEmDash")}
          </td>
        </tr>
      ))
    : undefined;

  return (
    <SellerPageFrame
      title={t(copy.titleKey)}
      addon={<p className="text-sm text-slate-500">{t(copy.descriptionKey)}</p>}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.id} label={s.label} value={s.value} hint={s.hint} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,280px)]">
        <Card
          title={t("common.sellerProductsListInventoryTitle")}
          description={t("common.sellerProductsListInventoryDesc")}
        >
          <SellerTableScaffold columns={columns} emptyLabel={emptyLabel}>
            {rowEls}
          </SellerTableScaffold>
        </Card>

        <Card
          title={t("common.sellerProductsListShortcutsTitle")}
          description={t("common.sellerProductsListShortcutsDesc")}
        >
          <SellerShortcutNav
            links={[
              {
                to: "/products",
                labelKey: "common.sellerLinkProductsOverview",
                end: true,
              },
              { to: "/products/new", labelKey: "common.sellerLinkAddProduct" },
            ]}
          />
        </Card>
      </div>
    </SellerPageFrame>
  );
}
