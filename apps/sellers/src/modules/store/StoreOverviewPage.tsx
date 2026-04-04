import { useMemo } from "react";
import { Card, StatCard } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SELLER_PAGE_COPY_KEYS } from "../../constants/sellerNavigation";
import { useT } from "../../i18n";

const copy = SELLER_PAGE_COPY_KEYS.storeOverview;

export function StoreOverviewPage() {
  const t = useT();

  const stats = useMemo(
    () => [
      {
        id: "prof",
        label: t("common.sellerStoreOvStatProfile"),
        value: "85%",
        hint: t("common.sellerStoreOvStatProfileHint"),
      },
      {
        id: "pol",
        label: t("common.sellerStoreOvStatPolicies"),
        value: "2/3",
        hint: t("common.sellerStoreOvStatPoliciesHint"),
      },
      {
        id: "pub",
        label: t("common.sellerStoreOvStatPublic"),
        value: "Jan '25",
        hint: t("common.sellerStoreOvStatPublicHint"),
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
          title={t("common.sellerStoreOvBuyersTitle")}
          description={t("common.sellerStoreOvBuyersDesc")}
        >
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>{t("common.sellerStoreOvDisplayName")}</span>
              <span className="font-medium text-slate-900">
                {t("common.sellerTopDemoStore")}
              </span>
            </li>
            <li className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>{t("common.sellerStoreOvSupportEmail")}</span>
              <span className="font-medium text-slate-900">
                {t("common.sellerStoreOvSetInEdit")}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span>{t("common.sellerStoreOvBannerLogo")}</span>
              <span className="font-medium text-emerald-700">
                {t("common.sellerStoreOvUploaded")}
              </span>
            </li>
          </ul>
        </Card>

        <Card
          title={t("common.sellerStoreOvShortcutsTitle")}
          description={t("common.sellerStoreOvShortcutsDesc")}
        >
          <SellerShortcutNav
            links={[
              { to: "/store/edit", labelKey: "common.sellerLinkEditStore" },
              {
                to: "/store",
                labelKey: "common.sellerSubOverview",
                end: true,
              },
            ]}
          />
          <p className="mt-4 text-xs text-slate-400">
            {t("common.sellerStoreOvFootnote")}
          </p>
        </Card>
      </div>
    </SellerPageFrame>
  );
}
