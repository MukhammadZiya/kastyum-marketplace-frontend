import { useMemo } from "react";
import { Card, StatCard } from "@repo/ui";
import { SellerFormPlaceholder } from "../../components/seller/SellerFormPlaceholder";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SELLER_PAGE_COPY_KEYS } from "../../constants/sellerNavigation";
import { useT } from "../../i18n";

const copy = SELLER_PAGE_COPY_KEYS.storeEdit;

export function StoreEditPage() {
  const t = useT();

  const stats = useMemo(
    () => [
      {
        id: "saved",
        label: t("common.sellerStoreEditStatLastSaved"),
        value: t("common.sellerEmDash"),
        hint: t("common.sellerStoreEditStatLastSavedHint"),
      },
      {
        id: "req",
        label: t("common.sellerStoreEditStatRequired"),
        value: "4/5",
        hint: t("common.sellerStoreEditStatRequiredHint"),
      },
      {
        id: "prev",
        label: t("common.sellerStoreEditStatPreview"),
        value: t("common.sellerStoreEditStatPreviewValue"),
        hint: t("common.sellerStoreEditStatPreviewHint"),
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
          title={t("common.sellerStoreEditBrandingTitle")}
          description={t("common.sellerStoreEditBrandingDesc")}
        >
          <SellerFormPlaceholder
            labelKey="common.sellerStoreEditScaffoldMedia"
            suffixKey="common.sellerStoreEditScaffoldSuffix"
          />
        </Card>

        <Card
          title={t("common.sellerStoreEditContactTitle")}
          description={t("common.sellerStoreEditContactDesc")}
        >
          <SellerFormPlaceholder
            labelKey="common.sellerStoreEditScaffoldPolicies"
            suffixKey="common.sellerStoreEditScaffoldSuffix"
          />
        </Card>
      </div>

      <Card
        title={t("common.sellerStoreEditSaveTitle")}
        description={t("common.sellerStoreEditSaveDesc")}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {t("common.sellerStoreEditSaveHint")}
          </p>
          <SellerShortcutNav
            links={[
              {
                to: "/store",
                labelKey: "common.sellerLinkBackToProfile",
                end: true,
              },
              { to: "/", labelKey: "common.sellerLinkDashboard" },
            ]}
          />
        </div>
      </Card>
    </SellerPageFrame>
  );
}
