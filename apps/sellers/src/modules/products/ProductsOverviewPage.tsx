import { useMemo } from "react";
import { Card, StatCard } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SELLER_PAGE_COPY_KEYS } from "../../constants/sellerNavigation";
import { useT } from "../../i18n";

const copy = SELLER_PAGE_COPY_KEYS.productsOverview;

export function ProductsOverviewPage() {
  const t = useT();

  const stats = useMemo(
    () => [
      {
        id: "pub",
        label: t("common.sellerProductsOvStatPublished"),
        value: "24",
        hint: t("common.sellerProductsOvStatPublishedHint"),
      },
      {
        id: "draft",
        label: t("common.sellerProductsOvStatDrafts"),
        value: "3",
        hint: t("common.sellerProductsOvStatDraftsHint"),
      },
      {
        id: "low",
        label: t("common.sellerProductsOvStatLowStock"),
        value: "2",
        hint: t("common.sellerProductsOvStatLowStockHint"),
      },
    ],
    [t],
  );

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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title={t("common.sellerProductsOvSnapshotTitle")}
          description={t("common.sellerProductsOvSnapshotDesc")}
        >
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>{t("common.sellerProductsOvWithImages")}</span>
              <span className="font-medium text-slate-900">22</span>
            </li>
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>{t("common.sellerProductsOvMissingDesc")}</span>
              <span className="font-medium text-amber-700">1</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>{t("common.sellerProductsOvScheduled")}</span>
              <span className="font-medium text-slate-900">0</span>
            </li>
          </ul>
        </Card>

        <Card
          title={t("common.sellerProductsOvShortcutsTitle")}
          description={t("common.sellerProductsOvShortcutsDesc")}
        >
          <SellerShortcutNav
            links={[
              { to: "/products/list", labelKey: "common.sellerLinkAllProducts" },
              { to: "/products/new", labelKey: "common.sellerLinkAddProduct" },
              {
                to: "/products",
                labelKey: "common.sellerSubOverview",
                end: true,
              },
            ]}
          />
          <p className="mt-4 text-xs text-slate-400">
            {t("common.sellerProductsOvFootnote")}
          </p>
        </Card>
      </div>
    </SellerPageFrame>
  );
}
