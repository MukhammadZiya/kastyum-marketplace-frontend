import type { FormEvent } from "react";
import { useState } from "react";
import { Button, Card } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { ADMIN_PAGE_TITLE_KEYS } from "../../constants/adminNavigation";
import { adminInputClass } from "../../lib/formFieldStyles";
import { useT } from "../../i18n";

export function ProductCreatePage() {
  const t = useT();
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [sellerId, setSellerId] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.info("admin:products:create", { title, sku, sellerId });
  }

  return (
    <AdminPageFrame
      title={t(ADMIN_PAGE_TITLE_KEYS.products)}
      addon={
        <p className="text-sm text-slate-500">
          {t("common.adminProductCreateAddon")}
        </p>
      }
    >
      <Card
        title={t("common.adminProductCreateCardTitle")}
        description={t("common.adminProductCreateCardDesc")}
      >
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
          <div>
            <label htmlFor="product-title" className="text-sm font-medium text-slate-700">
              {t("common.adminLabelTitle")}
            </label>
            <input
              id="product-title"
              type="text"
              required
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              className={adminInputClass}
              placeholder={t("common.adminPhProductTitle")}
            />
          </div>
          <div>
            <label htmlFor="product-sku" className="text-sm font-medium text-slate-700">
              {t("common.adminLabelSku")}
            </label>
            <input
              id="product-sku"
              type="text"
              value={sku}
              onChange={(ev) => setSku(ev.target.value)}
              className={adminInputClass}
              placeholder={t("common.adminPhSku")}
            />
          </div>
          <div>
            <label htmlFor="product-seller" className="text-sm font-medium text-slate-700">
              {t("common.adminLabelSellerId")}
            </label>
            <input
              id="product-seller"
              type="text"
              required
              value={sellerId}
              onChange={(ev) => setSellerId(ev.target.value)}
              className={adminInputClass}
              placeholder={t("common.adminPhSellerId")}
            />
          </div>
          <Button type="submit" variant="accent" size="md">
            {t("common.adminSaveProduct")}
          </Button>
        </form>
      </Card>
    </AdminPageFrame>
  );
}
