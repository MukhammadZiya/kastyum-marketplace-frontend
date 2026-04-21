import type { FormEvent } from "react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type {
  CreateProductBody,
  ProductStatus,
  ProductVariantStockLine,
  TargetAudience,
} from "@repo/types";
import { formatRequestFailureMessage, getAllAttributes } from "@repo/api";
import { Button, Card } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SELLER_PAGE_COPY_KEYS } from "../../constants/sellerNavigation";
import { useSellerProductCreate } from "../../hooks/seller-products";
import { useT } from "../../i18n";

const copy = SELLER_PAGE_COPY_KEYS.productsManage;

const audiences: TargetAudience[] = ["MEN", "WOMEN", "KIDS"];
const productStatuses: ProductStatus[] = ["ACTIVE", "INACTIVE"];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-[#00966d] focus:bg-white focus:ring-4 focus:ring-[#00966d]/15";

function toggleInList(list: string[], id: string): string[] {
  if (list.includes(id)) return list.filter((x) => x !== id);
  return [...list, id];
}

function audienceLabel(t: (k: string) => string, a: TargetAudience): string {
  if (a === "MEN") return t("common.sellerAudienceMen");
  if (a === "WOMEN") return t("common.sellerAudienceWomen");
  return t("common.sellerAudienceKids");
}

/** Match backend `resolveInventory`: `Math.floor(Number(qty))` must be a non‑negative integer. */
function parseVariantQuantityInput(raw: string | undefined): number {
  const cleaned = String(raw ?? "")
    .trim()
    .replace(/,/g, "");
  if (cleaned === "") return 0;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

export function SellerProductsPage() {
  const t = useT();
  const imageFieldId = useId();
  const create = useSellerProductCreate();

  const { data: attrBundle, isError: attrError } = useQuery({
    queryKey: ["seller", "attributes", "bundle"],
    queryFn: () => getAllAttributes(),
    staleTime: 5 * 60_000,
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [audience, setAudience] = useState<TargetAudience>("MEN");
  const [price, setPrice] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [stockCount, setStockCount] = useState("0");
  const [status, setStatus] = useState<ProductStatus>("ACTIVE");
  const [colorIds, setColorIds] = useState<string[]>([]);
  const [sizeIds, setSizeIds] = useState<string[]>([]);
  const [brandId, setBrandId] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [fitId, setFitId] = useState("");
  const [styleId, setStyleId] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [variantQty, setVariantQty] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  const brandOptions = attrBundle?.brand ?? [];
  const materialOptions = attrBundle?.material ?? [];
  const fitOptions = attrBundle?.fit ?? [];
  const styleOptions = attrBundle?.style ?? [];
  const colorOptions = attrBundle?.color ?? [];
  const sizeOptions = attrBundle?.size ?? [];

  const variantRows = useMemo((): Array<{
    key: string;
    sizeId?: string;
    colorId?: string;
  }> => {
    if (sizeIds.length === 0 && colorIds.length === 0) return [];
    if (sizeIds.length > 0 && colorIds.length > 0) {
      return sizeIds.flatMap((sid) =>
        colorIds.map((cid) => ({
          key: `${sid}:${cid}`,
          sizeId: sid,
          colorId: cid,
        })),
      );
    }
    if (sizeIds.length > 0) {
      return sizeIds.map((sid) => ({ key: `${sid}:`, sizeId: sid }));
    }
    return colorIds.map((cid) => ({ key: `:${cid}`, colorId: cid }));
  }, [sizeIds, colorIds]);

  useEffect(() => {
    setVariantQty((prev) => {
      const next: Record<string, string> = {};
      for (const row of variantRows) {
        next[row.key] = prev[row.key] ?? "0";
      }
      return next;
    });
  }, [variantRows]);

  const variantRowLabel = useCallback(
    (row: { sizeId?: string; colorId?: string }) => {
      const sn = row.sizeId ?
        sizeOptions.find((s) => s._id === row.sizeId)?.name
      : undefined;
      const cn = row.colorId ?
        colorOptions.find((c) => c._id === row.colorId)?.name
      : undefined;
      if (sn && cn) return `${sn} · ${cn}`;
      if (sn) return sn;
      if (cn) return cn;
      return row.sizeId ?? row.colorId ?? "";
    },
    [sizeOptions, colorOptions],
  );

  function resetForm() {
    setTitle("");
    setDescription("");
    setModelNumber("");
    setAudience("MEN");
    setPrice("");
    setListPrice("");
    setStockCount("0");
    setStatus("ACTIVE");
    setColorIds([]);
    setSizeIds([]);
    setBrandId("");
    setMaterialId("");
    setFitId("");
    setStyleId("");
    setImageFiles([]);
    setFileInputKey((k) => k + 1);
    setVariantQty({});
    setFormError("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    if (attrError) {
      setFormError(t("common.sellerProductAttrLoadError"));
      return;
    }
    if (!title.trim() || !description.trim() || !modelNumber.trim()) {
      setFormError(t("common.sellerProductErrorBasics"));
      return;
    }
    const priceNum = Number(price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      setFormError(t("common.sellerProductErrorPrice"));
      return;
    }
    let listNum: number | undefined;
    if (listPrice.trim()) {
      listNum = Number(listPrice);
      if (Number.isNaN(listNum) || listNum < 0) {
        setFormError(t("common.sellerProductErrorListPrice"));
        return;
      }
    }
    const usesVariantStock = variantRows.length > 0;
    const stockNum = Number.parseInt(stockCount, 10);
    if (!usesVariantStock && (Number.isNaN(stockNum) || stockNum < 0)) {
      setFormError(t("common.sellerProductErrorStock"));
      return;
    }
    let variantStockPayload: ProductVariantStockLine[] | undefined;
    if (usesVariantStock) {
      variantStockPayload = variantRows.map((row) => {
        const quantity = parseVariantQuantityInput(variantQty[row.key]);
        return {
          ...(row.sizeId ? { sizeId: String(row.sizeId) } : {}),
          ...(row.colorId ? { colorId: String(row.colorId) } : {}),
          quantity,
        };
      });
    }
    if (imageFiles.length === 0) {
      setFormError(t("common.sellerProductFormNeedImages"));
      return;
    }
    if (imageFiles.length > 5) {
      setFormError(t("common.sellerProductErrorImagesMax"));
      return;
    }

    const body: CreateProductBody = {
      title: title.trim(),
      description: description.trim(),
      modelNumber: modelNumber.trim(),
      audience,
      price: priceNum,
      listPrice:
        listNum !== undefined && !Number.isNaN(listNum) && listNum > 0 ?
          listNum
        : undefined,
      stockCount: usesVariantStock ? 0 : stockNum,
      colors: colorIds.length ? colorIds : undefined,
      sizes: sizeIds.length ? sizeIds : undefined,
      variantStock: variantStockPayload,
      brand: brandId || undefined,
      material: materialId || undefined,
      fit: fitId || undefined,
      style: styleId || undefined,
      status,
    };

    create.mutate(
      { body, images: imageFiles },
      {
        onSuccess: () => {
          resetForm();
        },
        onError: (err) => {
          setFormError(formatRequestFailureMessage(err));
        },
      },
    );
  }

  return (
    <SellerPageFrame
      title={t(copy.titleKey)}
      addon={<p className="text-sm text-slate-500">{t(copy.descriptionKey)}</p>}
    >
      <div className="space-y-8">
        <Card
          title={t("common.sellerProductsManageFormTitle")}
          description={t("common.sellerProductsManageFormDesc")}
        >
          <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
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
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t("common.sellerProductFormDescription")}
              </label>
              <textarea
                rows={4}
                className={inputClass}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {t("common.sellerProductFormSku")}
                </label>
                <input
                  className={inputClass}
                  value={modelNumber}
                  onChange={(e) => setModelNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {t("common.sellerProductFormAudience")}
                </label>
                <select
                  className={inputClass}
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
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {t("common.sellerProductFormPrice")}
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className={inputClass}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {t("common.sellerProductFieldListPrice")}
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className={inputClass}
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  placeholder={t("common.sellerProductPhListPrice")}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {t("common.sellerProductFieldStatus")}
                </label>
                <select
                  className={inputClass}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProductStatus)}
                >
                  {productStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s === "ACTIVE" ?
                        t("common.sellerProductStatusActive")
                      : t("common.sellerProductStatusInactive")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="mb-1 text-sm font-semibold text-slate-900">
                {t("common.sellerProductSectionAttributes")}
              </h3>
              <p className="mb-4 text-xs text-slate-500">
                {t("common.sellerProductHintAttributes")}
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    {t("common.sellerProductFieldSizes")}
                  </span>
                  <div className="max-h-36 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3">
                    {sizeOptions.length === 0 ? (
                      <span className="text-xs text-slate-500">
                        {t("common.sellerProductNoSizes")}
                      </span>
                    ) : (
                      sizeOptions.map((s) => (
                        <label key={s._id} className="flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={sizeIds.includes(s._id)}
                            onChange={() => setSizeIds((prev) => toggleInList(prev, s._id))}
                          />
                          {s.name}
                        </label>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    {t("common.sellerProductFieldColors")}
                  </span>
                  <div className="max-h-36 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3">
                    {colorOptions.length === 0 ? (
                      <span className="text-xs text-slate-500">
                        {t("common.sellerProductNoColors")}
                      </span>
                    ) : (
                      colorOptions.map((c) => (
                        <label key={c._id} className="flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={colorIds.includes(c._id)}
                            onChange={() => setColorIds((prev) => toggleInList(prev, c._id))}
                          />
                          {c.name}
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/80 p-4">
                {variantRows.length === 0 ? (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      {t("common.sellerProductFormStock")}
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      className={`${inputClass} max-w-xs`}
                      value={stockCount}
                      onChange={(e) => setStockCount(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      {t("common.sellerProductHintStockSimple")}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-slate-900">
                      {t("common.sellerProductSectionVariantStock")}
                    </h3>
                    <p className="mb-3 text-xs text-slate-600">
                      {t("common.sellerProductHintVariantStock")}
                    </p>
                    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
                      <table className="w-full min-w-[320px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                            <th className="px-3 py-2 font-medium">
                              {t("common.sellerProductVariantColCombo")}
                            </th>
                            <th className="px-3 py-2 font-medium">
                              {t("common.sellerProductVariantColQty")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {variantRows.map((row) => (
                            <tr key={row.key} className="border-t border-slate-100">
                              <td className="px-3 py-2 text-slate-800">
                                {variantRowLabel(row)}
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  min={0}
                                  step={1}
                                  value={variantQty[row.key] ?? "0"}
                                  onChange={(ev) =>
                                    setVariantQty((prev) => ({
                                      ...prev,
                                      [row.key]: ev.target.value,
                                    }))
                                  }
                                  className={`${inputClass} w-28`}
                                  aria-label={variantRowLabel(row)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t("common.sellerProductFieldBrand")}
                  </label>
                  <select
                    className={inputClass}
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                  >
                    <option value="">{t("common.sellerProductPhOptional")}</option>
                    {brandOptions.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t("common.sellerProductFieldMaterial")}
                  </label>
                  <select
                    className={inputClass}
                    value={materialId}
                    onChange={(e) => setMaterialId(e.target.value)}
                  >
                    <option value="">{t("common.sellerProductPhOptional")}</option>
                    {materialOptions.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t("common.sellerProductFieldFit")}
                  </label>
                  <select
                    className={inputClass}
                    value={fitId}
                    onChange={(e) => setFitId(e.target.value)}
                  >
                    <option value="">{t("common.sellerProductPhOptional")}</option>
                    {fitOptions.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t("common.sellerProductFieldStyle")}
                  </label>
                  <select
                    className={inputClass}
                    value={styleId}
                    onChange={(e) => setStyleId(e.target.value)}
                  >
                    <option value="">{t("common.sellerProductPhOptional")}</option>
                    {styleOptions.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label
                className="mb-1 block text-sm font-medium text-slate-700"
                htmlFor={imageFieldId}
              >
                {t("common.sellerProductFormImages")}
              </label>
              <p className="mb-3 text-xs text-slate-500">
                {t("common.sellerProductFormImagesHelp")}
              </p>
              <div className="relative min-h-[152px] overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/90 transition hover:border-[#00966d]/50 hover:bg-emerald-50/40 focus-within:border-[#00966d] focus-within:ring-4 focus-within:ring-[#00966d]/15">
                <input
                  key={fileInputKey}
                  id={imageFieldId}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  onChange={(e) => {
                    const list = e.target.files ? Array.from(e.target.files) : [];
                    setImageFiles(list.slice(0, 5));
                  }}
                />
                <div className="pointer-events-none flex min-h-[152px] flex-col items-center justify-center gap-2 px-4 py-6 text-center">
                  <Upload
                    className="h-9 w-9 text-slate-400"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span className="text-sm font-medium text-slate-800">
                    {t("common.sellerProductFormImagesBoxCta")}
                  </span>
                  <span className="max-w-md text-xs text-slate-500">
                    {t("common.sellerProductFormImagesBoxFormats")}
                  </span>
                  {imageFiles.length > 0 ? (
                    <span className="text-xs font-semibold text-[#006b4d]">
                      {t("common.sellerProductFormImagesSelected").replace(
                        "{{n}}",
                        String(imageFiles.length),
                      )}
                    </span>
                  ) : null}
                </div>
              </div>
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
      </div>
    </SellerPageFrame>
  );
}
