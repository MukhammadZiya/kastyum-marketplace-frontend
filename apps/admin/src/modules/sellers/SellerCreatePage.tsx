import type { FormEvent } from "react";
import { useState } from "react";
import { Button, Card } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { ADMIN_PAGE_TITLE_KEYS } from "../../constants/adminNavigation";
import { adminInputClass } from "../../lib/formFieldStyles";
import { useT } from "../../i18n";

export function SellerCreatePage() {
  const t = useT();
  const [storeName, setStoreName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.info("admin:sellers:create", { storeName, ownerEmail });
  }

  return (
    <AdminPageFrame
      title={t(ADMIN_PAGE_TITLE_KEYS.sellers)}
      addon={
        <p className="text-sm text-slate-500">
          {t("common.adminSellerCreateAddon")}
        </p>
      }
    >
      <Card
        title={t("common.adminSellerCreateCardTitle")}
        description={t("common.adminSellerCreateCardDesc")}
      >
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
          <div>
            <label htmlFor="seller-store" className="text-sm font-medium text-slate-700">
              {t("common.adminLabelStoreName")}
            </label>
            <input
              id="seller-store"
              type="text"
              required
              value={storeName}
              onChange={(ev) => setStoreName(ev.target.value)}
              className={adminInputClass}
              placeholder={t("common.adminPhStoreName")}
            />
          </div>
          <div>
            <label htmlFor="seller-owner" className="text-sm font-medium text-slate-700">
              {t("common.adminLabelOwnerEmail")}
            </label>
            <input
              id="seller-owner"
              type="email"
              autoComplete="email"
              required
              value={ownerEmail}
              onChange={(ev) => setOwnerEmail(ev.target.value)}
              className={adminInputClass}
              placeholder={t("common.adminPhOwnerEmail")}
            />
          </div>
          <Button type="submit" variant="accent" size="md">
            {t("common.adminCreateSeller")}
          </Button>
        </form>
      </Card>
    </AdminPageFrame>
  );
}
