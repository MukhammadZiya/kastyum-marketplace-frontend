import type { FormEvent } from "react";
import { useState } from "react";
import { Button, Card } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { ADMIN_PAGE_TITLE_KEYS } from "../../constants/adminNavigation";
import { adminInputClass } from "../../lib/formFieldStyles";
import { useT } from "../../i18n";

export function UserCreatePage() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.info("admin:users:create", { email, name });
  }

  return (
    <AdminPageFrame
      title={t(ADMIN_PAGE_TITLE_KEYS.users)}
      addon={
        <p className="text-sm text-slate-500">
          {t("common.adminUserCreateAddon")}
        </p>
      }
    >
      <Card
        title={t("common.adminUserCreateCardTitle")}
        description={t("common.adminUserCreateCardDesc")}
      >
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
          <div>
            <label htmlFor="user-email" className="text-sm font-medium text-slate-700">
              {t("common.adminColEmail")}
            </label>
            <input
              id="user-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className={adminInputClass}
              placeholder={t("common.adminPhEmailBuyer")}
            />
          </div>
          <div>
            <label htmlFor="user-name" className="text-sm font-medium text-slate-700">
              {t("common.adminLabelFullName")}
            </label>
            <input
              id="user-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              className={adminInputClass}
              placeholder={t("common.adminPhFullName")}
            />
          </div>
          <Button type="submit" variant="accent" size="md">
            {t("common.adminSaveUser")}
          </Button>
        </form>
      </Card>
    </AdminPageFrame>
  );
}
