import { useMemo } from "react";
import { Card, StatCard } from "@repo/ui";
import { SellerFormPlaceholder } from "../../components/seller/SellerFormPlaceholder";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SELLER_PAGE_COPY_KEYS } from "../../constants/sellerNavigation";
import { useT } from "../../i18n";

const copy = SELLER_PAGE_COPY_KEYS.productsNew;

export function ProductCreatePage() {
  const t = useT();

  const stats = useMemo(
    () => [
      {
        id: "drafts",
        label: t("common.sellerProductsNewStatDrafts"),
        value: "0",
        hint: t("common.sellerProductsNewStatDraftsHint"),
      },
      {
        id: "img",
        label: t("common.sellerProductsNewStatImages"),
        value: "12",
        hint: t("common.sellerProductsNewStatImagesHint"),
      },
      {
        id: "var",
        label: t("common.sellerProductsNewStatVariants"),
        value: t("common.sellerEmDash"),
        hint: t("common.sellerProductsNewStatVariantsHint"),
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
          title={t("common.sellerProductsNewBasicsTitle")}
          description={t("common.sellerProductsNewBasicsDesc")}
        >
          <SellerFormPlaceholder
            labelKey="common.sellerProductsNewScaffoldCore"
            suffixKey="common.sellerProductsNewScaffoldSuffix"
          />
        </Card>

        <Card
          title={t("common.sellerProductsNewMediaTitle")}
          description={t("common.sellerProductsNewMediaDesc")}
        >
          <SellerFormPlaceholder
            labelKey="common.sellerProductsNewScaffoldUploads"
            suffixKey="common.sellerProductsNewScaffoldSuffix"
          />
        </Card>
      </div>

      <Card
        title={t("common.sellerProductsNewPublishTitle")}
        description={t("common.sellerProductsNewPublishDesc")}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {t("common.sellerProductsNewPublishHint")}
          </p>
          <SellerShortcutNav
            links={[
              { to: "/products/list", labelKey: "common.sellerLinkBackToList" },
              {
                to: "/products",
                labelKey: "common.sellerSubOverview",
                end: true,
              },
            ]}
          />
        </div>
      </Card>
    </SellerPageFrame>
  );
}
