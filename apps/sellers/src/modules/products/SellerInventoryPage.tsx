import { useMemo } from "react";
import type { ProductSellerListItem } from "@repo/types";
import { getAuthToken } from "@repo/api";
import { Card } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerTableScaffold } from "../../components/seller/SellerTableScaffold";
import { SELLER_PAGE_COPY_KEYS } from "../../constants/sellerNavigation";
import { useSellerProductList } from "../../hooks/seller-products";
import { useT } from "../../i18n";

const copy = SELLER_PAGE_COPY_KEYS.inventoryPage;

export function SellerInventoryPage() {
  const t = useT();
  const signedIn = !!getAuthToken();
  const { data, isPending, isError, error } = useSellerProductList({
    page: 1,
    limit: 50,
  });

  const columns = useMemo(
    () => [
      t("common.sellerColProduct"),
      t("common.sellerColSku"),
      t("common.sellerColPrice"),
      t("common.sellerColStock"),
      t("common.sellerColAvailable"),
      t("common.sellerColSold"),
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
      data.list.map((p: ProductSellerListItem) => (
        <tr key={p._id} className="border-t border-slate-100">
          <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
          <td className="px-4 py-3 text-slate-600">{p.modelNumber}</td>
          <td className="px-4 py-3">${p.price.toFixed(2)}</td>
          <td className="px-4 py-3 tabular-nums">{p.stockCount}</td>
          <td className="px-4 py-3 tabular-nums">
            {p.status === "ACTIVE" ? p.stockCount : 0}
          </td>
          <td className="px-4 py-3 tabular-nums">{p.soldCount ?? 0}</td>
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
      <Card
        title={t("common.sellerProductsListInventoryTitle")}
        description={t("common.sellerProductsListInventoryDesc")}
      >
        <SellerTableScaffold columns={columns} emptyLabel={emptyLabel}>
          {rowEls}
        </SellerTableScaffold>
      </Card>
    </SellerPageFrame>
  );
}
