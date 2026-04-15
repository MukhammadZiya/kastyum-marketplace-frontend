import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateProductBody, TargetAudience } from "@repo/types";
import { Button, Card, StatCard } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SellerShortcutNav } from "../../components/seller/SellerShortcutNav";
import { SELLER_PAGE_COPY_KEYS } from "../../constants/sellerNavigation";
import { useSellerProductCreate } from "../../hooks/seller-products";
import { useT } from "../../i18n";

const copy = SELLER_PAGE_COPY_KEYS.productsNew;

const audiences: TargetAudience[] = ["MEN", "WOMEN", "KIDS"];

function audienceLabel(t: (k: string) => string, a: TargetAudience): string {
  if (a === "MEN") return t("common.sellerAudienceMen");
  if (a === "WOMEN") return t("common.sellerAudienceWomen");
  return t("common.sellerAudienceKids");
}

export function ProductCreatePage() {
  const t = useT();
  const navigate = useNavigate();
  const create = useSellerProductCreate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [audience, setAudience] = useState<TargetAudience>("MEN");
  const [price, setPrice] = useState("");
  const [stockCount, setStockCount] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState("");

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
        value: String(imageFiles.length),
        hint: t("common.sellerProductsNewStatImagesHint"),
      },
      {
        id: "var",
        label: t("common.sellerProductsNewStatVariants"),
        value: t("common.sellerEmDash"),
        hint: t("common.sellerProductsNewStatVariantsHint"),
      },
    ],
    [t, imageFiles.length],
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

      <Card
        title={t("common.sellerProductsNewBasicsTitle")}
        description={t("common.sellerProductsNewBasicsDesc")}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setFormError("");
            if (imageFiles.length === 0) {
              setFormError(t("common.sellerProductFormNeedImages"));
              return;
            }
            if (imageFiles.length > 5) {
              setFormError("Maximum 5 images.");
              return;
            }
            const priceNum = Number(price);
            const stockNum = Number(stockCount);
            if (!title.trim() || !description.trim() || !modelNumber.trim()) {
              setFormError("Fill in title, description, and SKU.");
              return;
            }
            if (Number.isNaN(priceNum) || priceNum < 0) {
              setFormError("Enter a valid price.");
              return;
            }
            if (Number.isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
              setFormError("Enter a valid whole number for stock.");
              return;
            }

            const body: CreateProductBody = {
              title: title.trim(),
              description: description.trim(),
              modelNumber: modelNumber.trim(),
              audience,
              price: priceNum,
              stockCount: stockNum,
            };

            create.mutate(
              { body, images: imageFiles },
              {
                onSuccess: () => {
                  navigate("/products/list");
                },
                onError: (err) => {
                  setFormError(
                    err instanceof Error ? err.message : t("common.sellerProductFormError"),
                  );
                },
              },
            );
          }}
        >
          {formError ? (
            <p className="text-sm text-red-600" role="alert">
              {formError}
            </p>
          ) : null}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {t("common.sellerProductFormTitle")}
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {t("common.sellerProductFormDescription")}
            </label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {t("common.sellerProductFormSku")}
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5"
              value={modelNumber}
              onChange={(e) => setModelNumber(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t("common.sellerProductFormAudience")}
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5"
                value={audience}
                onChange={(e) => setAudience(e.target.value as TargetAudience)}
              >
                {audiences.map((a) => (
                  <option key={a} value={a}>
                    {audienceLabel(t, a)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t("common.sellerProductFormStock")}
              </label>
              <input
                type="number"
                min={0}
                step={1}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5"
                value={stockCount}
                onChange={(e) => setStockCount(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {t("common.sellerProductFormPrice")}
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="w-full max-w-xs rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {t("common.sellerProductFormImages")}
            </label>
            <p className="mb-2 text-xs text-slate-500">
              {t("common.sellerProductFormImagesHelp")}
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="text-sm text-slate-700"
              onChange={(e) => {
                const list = e.target.files ? Array.from(e.target.files) : [];
                setImageFiles(list.slice(0, 5));
              }}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="bg-[#00966d] hover:bg-[#007a5a]"
            disabled={create.isPending}
          >
            {create.isPending
              ? t("common.sellerProductFormSubmitting")
              : t("common.sellerProductFormSubmit")}
          </Button>
        </form>
      </Card>

      <Card
        title={t("common.sellerProductsNewPublishTitle")}
        description={t("common.sellerProductsNewPublishDesc")}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">{t("common.sellerProductsNewPublishHint")}</p>
          <SellerShortcutNav
            links={[
              { to: "/products/list", labelKey: "common.sellerLinkBackToList" },
              { to: "/products", labelKey: "common.sellerSubOverview", end: true },
            ]}
          />
        </div>
      </Card>
    </SellerPageFrame>
  );
}
