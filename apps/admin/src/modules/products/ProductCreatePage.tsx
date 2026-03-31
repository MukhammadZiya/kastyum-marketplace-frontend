import type { FormEvent } from "react";
import { useState } from "react";
import { Button, Card } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { ModuleSubNav } from "../../components/ModuleSubNav";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";
import { adminInputClass } from "../../lib/formFieldStyles";
import { PRODUCTS_SUBNAV } from "./productsNav";

export function ProductCreatePage() {
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [sellerId, setSellerId] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.info("admin:products:create", { title, sku, sellerId });
  }

  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.products}
      tabs={<ModuleSubNav items={PRODUCTS_SUBNAV} />}
      addon={
        <p className="text-sm text-slate-500">
          Draft a listing — replace seller picker and media upload when APIs exist.
        </p>
      }
    >
      <Card
        title="Add product"
        description="Admin-created draft; typically ties to a seller and inventory source."
      >
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
          <div>
            <label htmlFor="product-title" className="text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              id="product-title"
              type="text"
              required
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              className={adminInputClass}
              placeholder="Artisan mug set"
            />
          </div>
          <div>
            <label htmlFor="product-sku" className="text-sm font-medium text-slate-700">
              SKU
            </label>
            <input
              id="product-sku"
              type="text"
              value={sku}
              onChange={(ev) => setSku(ev.target.value)}
              className={adminInputClass}
              placeholder="SKU-1092"
            />
          </div>
          <div>
            <label htmlFor="product-seller" className="text-sm font-medium text-slate-700">
              Seller ID
            </label>
            <input
              id="product-seller"
              type="text"
              required
              value={sellerId}
              onChange={(ev) => setSellerId(ev.target.value)}
              className={adminInputClass}
              placeholder="seller_uuid"
            />
          </div>
          <Button type="submit" variant="accent" size="md">
            Save product
          </Button>
        </form>
      </Card>
    </AdminPageFrame>
  );
}
