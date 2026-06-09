import type { FormEvent } from "react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { CheckCircle2, Circle, ImagePlus, PackageCheck, Shirt, Tags, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type {
  CreateProductBody,
  ProductStatus,
  ProductVariantStockLine,
  TargetAudience,
} from "@repo/types";
import { formatRequestFailureMessage, getAllAttributes } from "@repo/api";
import { Button } from "@repo/ui";
import { SellerPageFrame } from "../../components/seller/SellerPageFrame";
import { SELLER_PAGE_COPY_KEYS } from "../../constants/sellerNavigation";
import { useSellerProductCreate } from "../../hooks/seller-products";
import { useT } from "../../i18n";

const copy = SELLER_PAGE_COPY_KEYS.productsManage;

const audiences: TargetAudience[] = ["MEN", "WOMEN", "KIDS"];
const productStatuses: ProductStatus[] = ["ACTIVE", "INACTIVE"];

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-[#FAFAFB] px-4 py-3 text-slate-950 outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/10";

const sectionClass =
  "rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_20px_60px_-52px_rgba(15,23,42,0.8)]";

const sectionTitleClass = "text-base font-black text-slate-950";

const sectionDescClass = "mt-1 text-sm font-medium leading-6 text-slate-500";

const labelClass = "mb-2 block text-sm font-black text-slate-800";

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

  const readinessItems = [
    {
      label: t("common.sellerProductFormTitle"),
      complete: Boolean(title.trim()),
    },
    {
      label: t("common.sellerProductFormPrice"),
      complete: Boolean(price.trim()),
    },
    {
      label: t("common.sellerProductFormImages"),
      complete: imageFiles.length > 0,
    },
    {
      label: t("common.sellerProductFormStock"),
      complete: variantRows.length > 0 || Number(stockCount) > 0,
    },
  ];

  const completedReadiness = readinessItems.filter((item) => item.complete).length;

  return (
    <SellerPageFrame
      title={t(copy.titleKey)}
      addon={<p className="text-sm text-slate-500">{t(copy.descriptionKey)}</p>}
    >
      <div className="space-y-6">
        <div className="rounded-3xl border border-neutral-200 bg-white px-5 py-4 shadow-[0_20px_60px_-52px_rgba(15,23,42,0.8)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#BE123C]">
                iBerry seller
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                {t("common.sellerProductsManageFormTitle")}
              </h2>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
                {t("common.sellerProductsManageFormDesc")}
              </p>
            </div>
            <div className="rounded-2xl bg-[#FFF1F2] px-4 py-3 text-right">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#BE123C]">
                {t("common.sellerProductGuideReadyLabel")}
              </p>
              <p className="text-2xl font-black text-slate-950">
                {completedReadiness}/{readinessItems.length}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_330px]"
        >
          <div className="space-y-6">
            {formError ? (
              <p
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                role="alert"
              >
                {formError}
              </p>
            ) : null}

            <section className={sectionClass}>
              <div className="mb-5 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1F2] text-[#BE123C]">
                  <Shirt className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className={sectionTitleClass}>
                    1. {t("common.sellerProductStepBasicsTitle")}
                  </h3>
                  <p className={sectionDescClass}>
                    {t("common.sellerProductStepBasicsDesc")}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div>
                  <label className={labelClass}>{t("common.sellerProductFormTitle")}</label>
                  <input
                    className={inputClass}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>
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
                <div className="lg:col-span-2">
                  <label className={labelClass}>
                    {t("common.sellerProductFormDescription")}
                  </label>
                  <textarea
                    rows={5}
                    className={inputClass}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className={labelClass}>{t("common.sellerProductFormSku")}</label>
                  <input
                    className={`${inputClass} max-w-md`}
                    value={modelNumber}
                    onChange={(e) => setModelNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
            </section>

            <section className={sectionClass}>
              <div className="mb-5 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1F2] text-[#BE123C]">
                  <Tags className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className={sectionTitleClass}>
                    2. {t("common.sellerProductStepPricingTitle")}
                  </h3>
                  <p className={sectionDescClass}>
                    {t("common.sellerProductStepPricingDesc")}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className={labelClass}>{t("common.sellerProductFormPrice")}</label>
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
                  <label className={labelClass}>
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
                  <label className={labelClass}>
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
            </section>

            <section className={sectionClass}>
              <div className="mb-5 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1F2] text-[#BE123C]">
                  <PackageCheck className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className={sectionTitleClass}>
                    3. {t("common.sellerProductSectionAttributes")}
                  </h3>
                  <p className={sectionDescClass}>{t("common.sellerProductHintAttributes")}</p>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <span className={labelClass}>{t("common.sellerProductFieldSizes")}</span>
                  <div className="flex min-h-16 flex-wrap gap-2 rounded-2xl border border-neutral-200 bg-[#FAFAFB] p-3">
                    {sizeOptions.length === 0 ? (
                      <span className="text-sm font-medium text-slate-500">
                        {t("common.sellerProductNoSizes")}
                      </span>
                    ) : (
                      sizeOptions.map((s) => {
                        const checked = sizeIds.includes(s._id);
                        return (
                          <label
                            key={s._id}
                            className={`cursor-pointer rounded-xl border px-3 py-2 text-sm font-black transition ${
                              checked
                                ? "border-[#E11D48] bg-[#FFF1F2] text-[#BE123C]"
                                : "border-neutral-200 bg-white text-slate-700 hover:border-[#E11D48]/40"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={() => setSizeIds((prev) => toggleInList(prev, s._id))}
                            />
                            {s.name}
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
                <div>
                  <span className={labelClass}>{t("common.sellerProductFieldColors")}</span>
                  <div className="flex min-h-16 flex-wrap gap-2 rounded-2xl border border-neutral-200 bg-[#FAFAFB] p-3">
                    {colorOptions.length === 0 ? (
                      <span className="text-sm font-medium text-slate-500">
                        {t("common.sellerProductNoColors")}
                      </span>
                    ) : (
                      colorOptions.map((c) => {
                        const checked = colorIds.includes(c._id);
                        return (
                          <label
                            key={c._id}
                            className={`cursor-pointer rounded-xl border px-3 py-2 text-sm font-black transition ${
                              checked
                                ? "border-[#E11D48] bg-[#FFF1F2] text-[#BE123C]"
                                : "border-neutral-200 bg-white text-slate-700 hover:border-[#E11D48]/40"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={() => setColorIds((prev) => toggleInList(prev, c._id))}
                            />
                            {c.name}
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className={labelClass}>{t("common.sellerProductFieldBrand")}</label>
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
                  <label className={labelClass}>{t("common.sellerProductFieldMaterial")}</label>
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
                  <label className={labelClass}>{t("common.sellerProductFieldFit")}</label>
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
                  <label className={labelClass}>{t("common.sellerProductFieldStyle")}</label>
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

              <div className="mt-5 rounded-2xl border border-neutral-200 bg-[#FAFAFB] p-4">
                {variantRows.length === 0 ? (
                  <div>
                    <label className={labelClass}>
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
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      {t("common.sellerProductHintStockSimple")}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className={sectionTitleClass}>
                      {t("common.sellerProductSectionVariantStock")}
                    </h3>
                    <p className="mb-4 mt-1 text-sm font-medium text-slate-500">
                      {t("common.sellerProductHintVariantStock")}
                    </p>
                    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                      <table className="w-full min-w-[320px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-neutral-200 bg-[#FFF1F2] text-[#BE123C]">
                            <th className="px-4 py-3 font-black">
                              {t("common.sellerProductVariantColCombo")}
                            </th>
                            <th className="px-4 py-3 font-black">
                              {t("common.sellerProductVariantColQty")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {variantRows.map((row) => (
                            <tr key={row.key} className="border-t border-neutral-100">
                              <td className="px-4 py-3 font-semibold text-slate-800">
                                {variantRowLabel(row)}
                              </td>
                              <td className="px-4 py-3">
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
            </section>

            <section className={sectionClass}>
              <div className="mb-5 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1F2] text-[#BE123C]">
                  <ImagePlus className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className={sectionTitleClass}>
                    4. {t("common.sellerProductFormImages")}
                  </h3>
                  <p className={sectionDescClass}>{t("common.sellerProductFormImagesHelp")}</p>
                </div>
              </div>
              <label
                className={labelClass}
                htmlFor={imageFieldId}
              >
                {t("common.sellerProductFormImages")}
              </label>
              <div className="relative min-h-[170px] overflow-hidden rounded-3xl border-2 border-dashed border-[#FBCFE8] bg-[#FFF8FA] transition hover:border-[#E11D48]/50 hover:bg-[#FFF1F2] focus-within:border-[#E11D48] focus-within:ring-4 focus-within:ring-[#E11D48]/15">
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
                <div className="pointer-events-none flex min-h-[170px] flex-col items-center justify-center gap-2 px-4 py-6 text-center">
                  <Upload
                    className="h-9 w-9 text-[#BE123C]"
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
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#BE123C]">
                      {t("common.sellerProductFormImagesSelected").replace(
                        "{{n}}",
                        String(imageFiles.length),
                      )}
                    </span>
                  ) : null}
                </div>
              </div>
            </section>
          </div>

          <aside className="xl:sticky xl:top-6">
            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.9)]">
              <div className="rounded-2xl bg-slate-950 p-4 text-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FDA4AF]">
                  {t("common.sellerProductPublishStatusTitle")}
                </p>
                <p className="mt-2 text-3xl font-black">
                  {completedReadiness}/{readinessItems.length}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-300">
                  {t("common.sellerProductPublishStatusDesc")}
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {readinessItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-[#FAFAFB] px-3 py-3"
                  >
                    {item.complete ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#E11D48]" aria-hidden />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-slate-300" aria-hidden />
                    )}
                    <span className="text-sm font-black text-slate-800">{item.label}</span>
                  </div>
                ))}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="mt-5 w-full !border-[#E11D48] !bg-[#E11D48] shadow-lg shadow-[#E11D48]/20 hover:!bg-[#BE123C]"
                disabled={create.isPending}
              >
                {create.isPending
                  ? t("common.sellerProductFormSubmitting")
                  : t("common.sellerProductFormSubmit")}
              </Button>
            </div>
          </aside>
        </form>
      </div>
    </SellerPageFrame>
  );
}
