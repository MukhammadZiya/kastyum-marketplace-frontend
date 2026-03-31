import type { FormEvent } from "react";
import { useState } from "react";
import { Button, Card } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";
import { adminInputClass } from "../../lib/formFieldStyles";

export function SellerCreatePage() {
  const [storeName, setStoreName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.info("admin:sellers:create", { storeName, ownerEmail });
  }

  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.sellers}
      addon={
        <p className="text-sm text-slate-500">
          Onboard a new seller — extend with tax, payout, and KYC fields later.
        </p>
      }
    >
      <Card
        title="Add seller"
        description="Minimal store + owner identity; hook to onboarding API when ready."
      >
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
          <div>
            <label htmlFor="seller-store" className="text-sm font-medium text-slate-700">
              Store name
            </label>
            <input
              id="seller-store"
              type="text"
              required
              value={storeName}
              onChange={(ev) => setStoreName(ev.target.value)}
              className={adminInputClass}
              placeholder="Northwind Goods"
            />
          </div>
          <div>
            <label htmlFor="seller-owner" className="text-sm font-medium text-slate-700">
              Owner email
            </label>
            <input
              id="seller-owner"
              type="email"
              autoComplete="email"
              required
              value={ownerEmail}
              onChange={(ev) => setOwnerEmail(ev.target.value)}
              className={adminInputClass}
              placeholder="owner@store.com"
            />
          </div>
          <Button type="submit" variant="accent" size="md">
            Create seller
          </Button>
        </form>
      </Card>
    </AdminPageFrame>
  );
}
