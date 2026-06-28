import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Circle,
  ImagePlus,
  Plus,
  Printer,
  Trash2,
  X,
} from "lucide-react";
import type {
  AllAttributesBundle,
  Brand,
  Color,
  CreateProductBody,
  Material,
  ProductSellerListItem,
  ProductStatus,
  ProductVariantStockLine,
  Size,
  Style,
  TargetAudience,
} from "@repo/types";
import { formatRequestFailureMessage, getAllAttributes } from "@repo/api";
import { Button, Drawer } from "@repo/ui";
import {
  useSellerAttributeCreate,
  useSellerProductCreate,
  useSellerProductDetail,
  useSellerProductUpdate,
} from "../../hooks/seller-products";
import { useT } from "../../i18n";

// ─── Constants ─────────────────────────────────────────────────────────────────

const ATTR_BUNDLE_QUERY_KEY = ["seller", "attributes", "bundle"] as const;

const GUARANTEE_DURATIONS = [
  { value: "", labelKey: "sellerProductGuaranteeDurationNone" },
  { value: "1_month", labelKey: "sellerProductGuarantee1Month" },
  { value: "3_months", labelKey: "sellerProductGuarantee3Months" },
  { value: "6_months", labelKey: "sellerProductGuarantee6Months" },
  { value: "1_year", labelKey: "sellerProductGuarantee1Year" },
  { value: "2_years", labelKey: "sellerProductGuarantee2Years" },
];

const AUDIENCES: TargetAudience[] = ["MEN", "WOMEN", "KIDS"];
const PRODUCT_STATUSES: ProductStatus[] = ["ACTIVE", "INACTIVE"];

const inputCls =
  "w-full rounded-xl border border-neutral-200 bg-[#FAFAFB] px-4 py-3 text-slate-950 outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/10";
const labelCls = "mb-2 block text-sm font-black text-slate-800";
const cardCls = "rounded-2xl border border-neutral-200 bg-[#FAFAFB] p-4";

// ─── Helpers ────────────────────────────────────────────────────────────────────

function toggleInList(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function parseQty(raw: string | undefined): number {
  const n = Number(String(raw ?? "").trim().replace(/,/g, ""));
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

// ─── Types ──────────────────────────────────────────────────────────────────────

type Tab = "info" | "pricing" | "attributes" | "details" | "media" | "translations";
const TABS: Tab[] = ["info", "pricing", "attributes", "details", "media", "translations"];

export type SellerProductDrawerProps = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  productId?: string | null;
};

// ─── Main component ─────────────────────────────────────────────────────────────

export function SellerProductDrawer({
  open,
  onClose,
  mode,
  productId,
}: SellerProductDrawerProps) {
  const t = useT();
  const imageFieldId = useId();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [formError, setFormError] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);

  // Info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState<TargetAudience>("MEN");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<ProductStatus>("ACTIVE");

  // Pricing
  const [price, setPrice] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [stockCount, setStockCount] = useState("0");
  const [colorIds, setColorIds] = useState<string[]>([]);
  const [sizeIds, setSizeIds] = useState<string[]>([]);
  const [variantQty, setVariantQty] = useState<Record<string, string>>({});
  const [newSizeName, setNewSizeName] = useState("");
  const [newColorName, setNewColorName] = useState("");
  const [sizeAddError, setSizeAddError] = useState("");
  const [colorAddError, setColorAddError] = useState("");

  // Attributes
  const [brandId, setBrandId] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [styleId, setStyleId] = useState("");
  const [customAttributes, setCustomAttributes] = useState<{ key: string; value: string }[]>([]);
  const [newBrandName, setNewBrandName] = useState("");
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newStyleName, setNewStyleName] = useState("");
  const [brandAddError, setBrandAddError] = useState("");
  const [materialAddError, setMaterialAddError] = useState("");
  const [styleAddError, setStyleAddError] = useState("");

  // Details
  const [careInstructionsUz, setCareInstructionsUz] = useState("");
  const [guaranteeDuration, setGuaranteeDuration] = useState("");
  const [guaranteeTermsUz, setGuaranteeTermsUz] = useState("");
  const [weight, setWeight] = useState("");
  const [dimLength, setDimLength] = useState("");
  const [dimWidth, setDimWidth] = useState("");
  const [dimHeight, setDimHeight] = useState("");

  // Media
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingBarcode, setExistingBarcode] = useState<string>("");

  // Translations
  const [titleRu, setTitleRu] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleKk, setTitleKk] = useState("");
  const [descRu, setDescRu] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descKk, setDescKk] = useState("");
  const [careRu, setCareRu] = useState("");
  const [careEn, setCareEn] = useState("");
  const [careKk, setCareKk] = useState("");
  const [guaranteeRu, setGuaranteeRu] = useState("");
  const [guaranteeEn, setGuaranteeEn] = useState("");
  const [guaranteeKk, setGuaranteeKk] = useState("");

  // Attribute bundle query
  const { data: attrBundle } = useQuery({
    queryKey: ATTR_BUNDLE_QUERY_KEY,
    queryFn: () => getAllAttributes(),
    staleTime: 5 * 60_000,
  });

  // Edit: fetch product detail
  const { data: product, isPending: productLoading } = useSellerProductDetail(
    mode === "edit" ? (productId ?? null) : null,
  );

  // Mutations
  const create = useSellerProductCreate();
  const update = useSellerProductUpdate();
  const addSize = useSellerAttributeCreate();
  const addColor = useSellerAttributeCreate();
  const addBrand = useSellerAttributeCreate();
  const addMaterial = useSellerAttributeCreate();
  const addStyle = useSellerAttributeCreate();

  const brandOptions = attrBundle?.brand ?? [];
  const materialOptions = attrBundle?.material ?? [];
  const styleOptions = attrBundle?.style ?? [];
  const colorOptions = attrBundle?.color ?? [];
  const sizeOptions = attrBundle?.size ?? [];
  const categoryOptions = attrBundle?.category ?? [];

  // ── Pre-fill on edit ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "edit" || !product) return;
    const p = product as ProductSellerListItem & {
      titleI18n?: { ru?: string; en?: string; kk?: string };
      descriptionI18n?: { ru?: string; en?: string; kk?: string };
      careInstructions?: { uz?: string; ru?: string; en?: string; kk?: string };
      guarantee?: { duration?: string; terms?: { uz?: string; ru?: string; en?: string; kk?: string } };
      weight?: number;
      dimensions?: { length?: number; width?: number; height?: number };
      customAttributes?: { key: string; value: string }[];
      barcode?: string;
    };

    setTitle(p.title ?? "");
    setDescription(p.description ?? "");
    setAudience(p.audience ?? "MEN");
    setCategoryId((p.category as any)?._id ?? (p.category as any) ?? "");
    setStatus(p.status ?? "ACTIVE");
    setPrice(String(p.price ?? ""));
    setListPrice(p.listPrice != null ? String(p.listPrice) : "");
    setSizeIds((p.sizes as any[]).map((s) => (typeof s === "object" ? s._id : s)));
    setColorIds((p.colors as any[]).map((c) => (typeof c === "object" ? c._id : c)));
    setBrandId((p.brand as any)?._id ?? (p.brand as any) ?? "");
    setMaterialId((p.material as any)?._id ?? (p.material as any) ?? "");
    setStyleId((p.style as any)?._id ?? (p.style as any) ?? "");
    setCustomAttributes(p.customAttributes ?? []);
    setCareInstructionsUz(p.careInstructions?.uz ?? "");
    setGuaranteeDuration(p.guarantee?.duration ?? "");
    setGuaranteeTermsUz(p.guarantee?.terms?.uz ?? "");
    setWeight(p.weight != null ? String(p.weight) : "");
    setDimLength(p.dimensions?.length != null ? String(p.dimensions.length) : "");
    setDimWidth(p.dimensions?.width != null ? String(p.dimensions.width) : "");
    setDimHeight(p.dimensions?.height != null ? String(p.dimensions.height) : "");
    setExistingImages(p.images ?? []);
    setExistingBarcode(p.barcode ?? "");
    setTitleRu(p.titleI18n?.ru ?? "");
    setTitleEn(p.titleI18n?.en ?? "");
    setTitleKk(p.titleI18n?.kk ?? "");
    setDescRu(p.descriptionI18n?.ru ?? "");
    setDescEn(p.descriptionI18n?.en ?? "");
    setDescKk(p.descriptionI18n?.kk ?? "");
    setCareRu(p.careInstructions?.ru ?? "");
    setCareEn(p.careInstructions?.en ?? "");
    setCareKk(p.careInstructions?.kk ?? "");
    setGuaranteeRu(p.guarantee?.terms?.ru ?? "");
    setGuaranteeEn(p.guarantee?.terms?.en ?? "");
    setGuaranteeKk(p.guarantee?.terms?.kk ?? "");

    // Pre-fill variant stock
    if (p.variantStock?.length) {
      const qty: Record<string, string> = {};
      for (const row of p.variantStock) {
        const s = String(row.sizeId ?? "");
        const c = String(row.colorId ?? "");
        qty[`${s}:${c}`] = String(row.quantity);
      }
      setVariantQty(qty);
    } else {
      setStockCount(String(p.stockCount ?? 0));
    }
  }, [product, mode]);

  // ── Reset on close (create mode) ─────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setActiveTab("info");
      setFormError("");
    }
    if (!open && mode === "create") resetForm();
  }, [open, mode]);

  function resetForm() {
    setTitle(""); setDescription(""); setAudience("MEN"); setCategoryId(""); setStatus("ACTIVE");
    setPrice(""); setListPrice(""); setStockCount("0"); setColorIds([]); setSizeIds([]);
    setVariantQty({}); setNewSizeName(""); setNewColorName(""); setBrandId(""); setMaterialId("");
    setStyleId(""); setCustomAttributes([]); setCareInstructionsUz(""); setGuaranteeDuration("");
    setGuaranteeTermsUz(""); setWeight(""); setDimLength(""); setDimWidth(""); setDimHeight("");
    setImageFiles([]); setFileInputKey((k) => k + 1); setExistingImages([]); setExistingBarcode("");
    setTitleRu(""); setTitleEn(""); setTitleKk(""); setDescRu(""); setDescEn(""); setDescKk("");
    setCareRu(""); setCareEn(""); setCareKk(""); setGuaranteeRu(""); setGuaranteeEn(""); setGuaranteeKk("");
    setFormError("");
  }

  // ── Variant rows ─────────────────────────────────────────────────────────────
  const variantRows = useMemo(() => {
    if (!sizeIds.length && !colorIds.length) return [];
    if (sizeIds.length && colorIds.length)
      return sizeIds.flatMap((s) => colorIds.map((c) => ({ key: `${s}:${c}`, sizeId: s, colorId: c })));
    if (sizeIds.length)
      return sizeIds.map((s) => ({ key: `${s}:`, sizeId: s, colorId: undefined }));
    return colorIds.map((c) => ({ key: `:${c}`, sizeId: undefined, colorId: c }));
  }, [sizeIds, colorIds]);

  useEffect(() => {
    setVariantQty((prev) => {
      const next: Record<string, string> = {};
      for (const row of variantRows) next[row.key] = prev[row.key] ?? "0";
      return next;
    });
  }, [variantRows]);

  const variantRowLabel = useCallback(
    (row: { sizeId?: string; colorId?: string }) => {
      const sn = row.sizeId ? sizeOptions.find((s) => s._id === row.sizeId)?.name : undefined;
      const cn = row.colorId ? colorOptions.find((c) => c._id === row.colorId)?.name : undefined;
      if (sn && cn) return `${sn} · ${cn}`;
      return sn ?? cn ?? "";
    },
    [sizeOptions, colorOptions],
  );

  // ── Add attribute handlers ────────────────────────────────────────────────────
  function makeAddHandler<T extends { _id: string }>(
    mutation: ReturnType<typeof useSellerAttributeCreate>,
    type: "color" | "size" | "brand" | "material" | "style",
    name: string,
    setName: (v: string) => void,
    setError: (v: string) => void,
    arrayKey: keyof AllAttributesBundle,
    onSelect: (id: string) => void,
  ) {
    return () => {
      const n = name.trim();
      if (!n) return;
      mutation.mutate(
        { type, name: n },
        {
          onSuccess: (attr) => {
            queryClient.setQueryData<AllAttributesBundle>(ATTR_BUNDLE_QUERY_KEY, (old) => {
              if (!old) return old;
              const arr = old[arrayKey] as unknown as T[];
              if (arr.some((x) => x._id === attr._id)) return old;
              return { ...old, [arrayKey]: [...arr, attr as unknown as T] };
            });
            onSelect(attr._id);
            setName("");
            setError("");
          },
          onError: () => setError(t("common.sellerProductAddAttributeError")),
        },
      );
    };
  }

  const handleAddSize = makeAddHandler<Size>(
    addSize, "size", newSizeName, setNewSizeName, setSizeAddError, "size",
    (id) => setSizeIds((p) => (p.includes(id) ? p : [...p, id])),
  );
  const handleAddColor = makeAddHandler<Color>(
    addColor, "color", newColorName, setNewColorName, setColorAddError, "color",
    (id) => setColorIds((p) => (p.includes(id) ? p : [...p, id])),
  );
  const handleAddBrand = makeAddHandler<Brand>(
    addBrand, "brand", newBrandName, setNewBrandName, setBrandAddError, "brand",
    (id) => setBrandId(id),
  );
  const handleAddMaterial = makeAddHandler<Material>(
    addMaterial, "material", newMaterialName, setNewMaterialName, setMaterialAddError, "material",
    (id) => setMaterialId(id),
  );
  const handleAddStyle = makeAddHandler<Style>(
    addStyle, "style", newStyleName, setNewStyleName, setStyleAddError, "style",
    (id) => setStyleId(id),
  );

  // ── Submit ────────────────────────────────────────────────────────────────────
  function handleSubmit() {
    setFormError("");
    if (!title.trim() || !description.trim()) {
      setFormError(t("common.sellerProductErrorBasics"));
      setActiveTab("info");
      return;
    }
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setFormError(t("common.sellerProductErrorPrice"));
      setActiveTab("pricing");
      return;
    }
    let listNum: number | undefined;
    if (listPrice.trim()) {
      listNum = Number(listPrice);
      if (!Number.isFinite(listNum) || listNum < 0) {
        setFormError(t("common.sellerProductErrorListPrice"));
        setActiveTab("pricing");
        return;
      }
    }
    const usesVariants = variantRows.length > 0;
    const stockNum = Number.parseInt(stockCount, 10);
    if (!usesVariants && (!Number.isFinite(stockNum) || stockNum < 0)) {
      setFormError(t("common.sellerProductErrorStock"));
      setActiveTab("pricing");
      return;
    }
    if (mode === "create" && imageFiles.length === 0) {
      setFormError(t("common.sellerProductFormNeedImages"));
      setActiveTab("media");
      return;
    }
    if (imageFiles.length > 5) {
      setFormError(t("common.sellerProductErrorImagesMax"));
      setActiveTab("media");
      return;
    }

    const variantStock: ProductVariantStockLine[] | undefined = usesVariants
      ? variantRows.map((row) => ({
          ...(row.sizeId ? { sizeId: row.sizeId } : {}),
          ...(row.colorId ? { colorId: row.colorId } : {}),
          quantity: parseQty(variantQty[row.key]),
        }))
      : undefined;

    const body: CreateProductBody = {
      title: title.trim(),
      description: description.trim(),
      audience,
      price: priceNum,
      listPrice: listNum && listNum > 0 ? listNum : undefined,
      stockCount: usesVariants ? 0 : stockNum,
      status,
      colors: colorIds.length ? colorIds : undefined,
      sizes: sizeIds.length ? sizeIds : undefined,
      variantStock,
      brand: brandId || undefined,
      material: materialId || undefined,
      style: styleId || undefined,
      category: categoryId || undefined,
      customAttributes: customAttributes.filter((a) => a.key.trim() && a.value.trim()),
      careInstructions: careInstructionsUz.trim()
        ? {
            uz: careInstructionsUz.trim(),
            ...(careRu.trim() ? { ru: careRu.trim() } : {}),
            ...(careEn.trim() ? { en: careEn.trim() } : {}),
            ...(careKk.trim() ? { kk: careKk.trim() } : {}),
          }
        : undefined,
      guarantee:
        guaranteeDuration || guaranteeTermsUz.trim()
          ? {
              duration: guaranteeDuration || undefined,
              terms: guaranteeTermsUz.trim()
                ? {
                    uz: guaranteeTermsUz.trim(),
                    ...(guaranteeRu.trim() ? { ru: guaranteeRu.trim() } : {}),
                    ...(guaranteeEn.trim() ? { en: guaranteeEn.trim() } : {}),
                    ...(guaranteeKk.trim() ? { kk: guaranteeKk.trim() } : {}),
                  }
                : undefined,
            }
          : undefined,
      weight: weight.trim() ? Number(weight) : undefined,
      dimensions:
        dimLength.trim() || dimWidth.trim() || dimHeight.trim()
          ? {
              length: dimLength.trim() ? Number(dimLength) : undefined,
              width: dimWidth.trim() ? Number(dimWidth) : undefined,
              height: dimHeight.trim() ? Number(dimHeight) : undefined,
            }
          : undefined,
      titleI18n:
        titleRu.trim() || titleEn.trim() || titleKk.trim()
          ? {
              ...(titleRu.trim() ? { ru: titleRu.trim() } : {}),
              ...(titleEn.trim() ? { en: titleEn.trim() } : {}),
              ...(titleKk.trim() ? { kk: titleKk.trim() } : {}),
            }
          : undefined,
      descriptionI18n:
        descRu.trim() || descEn.trim() || descKk.trim()
          ? {
              ...(descRu.trim() ? { ru: descRu.trim() } : {}),
              ...(descEn.trim() ? { en: descEn.trim() } : {}),
              ...(descKk.trim() ? { kk: descKk.trim() } : {}),
            }
          : undefined,
    };

    if (mode === "create") {
      create.mutate(
        { body, images: imageFiles },
        {
          onSuccess: () => { resetForm(); onClose(); },
          onError: (err) => setFormError(formatRequestFailureMessage(err)),
        },
      );
    } else {
      update.mutate(
        { id: productId!, body, images: imageFiles.length ? imageFiles : undefined, keepImages: imageFiles.length ? undefined : existingImages },
        {
          onSuccess: () => { setFormError(""); onClose(); },
          onError: (err) => setFormError(formatRequestFailureMessage(err)),
        },
      );
    }
  }

  // ── Print barcode ─────────────────────────────────────────────────────────────
  async function handlePrint() {
    if (!existingBarcode) return;
    try {
      // Code 128 → canvas → PNG data URL
      const code128Canvas = document.createElement("canvas");
      JsBarcode(code128Canvas, existingBarcode, {
        format: "CODE128",
        width: 2.2,
        height: 70,
        displayValue: false,
        margin: 8,
      });
      const code128Url = code128Canvas.toDataURL("image/png");

      // QR code → PNG data URL
      const qrUrl = await QRCode.toDataURL(existingBarcode, {
        margin: 1,
        width: 160,
        errorCorrectionLevel: "M",
        color: { dark: "#000000", light: "#ffffff" },
      });

      const win = window.open("", "_blank", "width=460,height=420");
      if (!win) return;
      win.document.write(
        `<!DOCTYPE html><html><head><title>Label — ${existingBarcode}</title>
        <style>
          *{box-sizing:border-box;margin:0;padding:0}
          body{font-family:system-ui,sans-serif;background:#fff;padding:24px;text-align:center}
          .name{font-size:13px;font-weight:600;color:#222;max-width:340px;margin:0 auto 14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
          .row{display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap}
          .qr img{width:160px;height:160px;display:block}
          .bc{display:flex;flex-direction:column;align-items:center;gap:6px}
          .bc img{max-width:220px;display:block}
          .bc-text{font-family:monospace;font-size:11px;letter-spacing:2px;color:#444}
          .price{margin-top:14px;font-size:15px;font-weight:700;color:#111}
          .sep{width:80%;margin:14px auto;border:none;border-top:1px dashed #ccc}
          @media print{body{padding:12px}}
        </style></head><body>
        <p class="name">${title}</p>
        <div class="row">
          <div class="qr"><img src="${qrUrl}" alt="QR code"></div>
          <div class="bc">
            <img src="${code128Url}" alt="Code 128 barcode">
            <span class="bc-text">${existingBarcode}</span>
          </div>
        </div>
        <hr class="sep">
        <p class="price">$${price}</p>
        <script>window.onload=()=>{window.print();window.close()}<\/script>
        </body></html>`,
      );
      win.document.close();
    } catch {
      // fallback: open without graphics
      const win = window.open("", "_blank", "width=360,height=200");
      if (!win) return;
      win.document.write(
        `<!DOCTYPE html><html><body style="font-family:monospace;text-align:center;padding:24px">
        <p style="font-size:13px">${title}</p>
        <p style="font-size:22px;letter-spacing:4px;margin:12px 0">${existingBarcode}</p>
        <p>$${price}</p>
        <script>window.onload=()=>{window.print();window.close()}<\/script>
        </body></html>`,
      );
      win.document.close();
    }
  }

  // ── Readiness ─────────────────────────────────────────────────────────────────
  const readiness = [
    { label: t("common.sellerProductFormTitle"), ok: Boolean(title.trim()) },
    { label: t("common.sellerProductFormPrice"), ok: Boolean(price.trim()) },
    {
      label: t("common.sellerProductFormImages"),
      ok: mode === "edit" ? imageFiles.length > 0 || existingImages.length > 0 : imageFiles.length > 0,
    },
    { label: t("common.sellerProductFormStock"), ok: variantRows.length > 0 || Number(stockCount) > 0 },
  ];
  const doneCount = readiness.filter((r) => r.ok).length;

  const isPending = mode === "create" ? create.isPending : update.isPending;

  const TAB_LABELS: Record<Tab, string> = {
    info: t("common.sellerDrawerTabInfo"),
    pricing: t("common.sellerDrawerTabPricing"),
    attributes: t("common.sellerDrawerTabAttributes"),
    details: t("common.sellerDrawerTabDetails"),
    media: t("common.sellerDrawerTabMedia"),
    translations: t("common.sellerDrawerTabTranslations"),
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Drawer open={open} onClose={onClose} side="right" showHeader={false} panelClassName="w-[min(900px,98vw)]">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#BE123C]">iBerry seller</p>
            <h2 className="text-lg font-black text-slate-950">
              {mode === "create" ? t("common.sellerDrawerCreateTitle") : t("common.sellerDrawerEditTitle")}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {readiness.map((r) =>
                r.ok ? (
                  <CheckCircle2 key={r.label} className="h-4 w-4 text-[#E11D48]" aria-hidden />
                ) : (
                  <Circle key={r.label} className="h-4 w-4 text-slate-300" aria-hidden />
                ),
              )}
              <span className="text-xs font-black text-slate-500">{doneCount}/{readiness.length}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex shrink-0 gap-0.5 overflow-x-auto border-b border-slate-100 px-4 pt-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-t-xl px-4 py-2 text-sm font-black transition ${
                activeTab === tab
                  ? "bg-[#FFF1F2] text-[#BE123C]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {mode === "edit" && productLoading ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-sm font-medium text-slate-500">{t("common.sellerLoading")}</p>
            </div>
          ) : (
            <>
              {/* ── INFO ── */}
              {activeTab === "info" && (
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>{t("common.sellerProductFormTitle")} *</label>
                    <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t("common.sellerProductFormDescription")} *</label>
                    <textarea rows={5} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className={labelCls}>{t("common.sellerProductFormAudience")}</label>
                      <select className={inputCls} value={audience} onChange={(e) => setAudience(e.target.value as TargetAudience)}>
                        {AUDIENCES.map((a) => (
                          <option key={a} value={a}>
                            {a === "MEN" ? t("common.sellerAudienceMen") : a === "WOMEN" ? t("common.sellerAudienceWomen") : t("common.sellerAudienceKids")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>{t("common.sellerProductFieldCategory")}</label>
                      <select className={inputCls} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                        <option value="">{t("common.sellerProductNoCategorySelected")}</option>
                        {categoryOptions.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>{t("common.sellerProductFieldStatus")}</label>
                      <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)}>
                        {PRODUCT_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s === "ACTIVE" ? t("common.sellerProductStatusActive") : t("common.sellerProductStatusInactive")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PRICING ── */}
              {activeTab === "pricing" && (
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className={labelCls}>{t("common.sellerProductFormPrice")} *</label>
                      <input type="number" min={0} step="0.01" className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>{t("common.sellerProductFieldListPrice")}</label>
                      <input type="number" min={0} step="0.01" className={inputCls} value={listPrice} onChange={(e) => setListPrice(e.target.value)} placeholder={t("common.sellerProductPhListPrice")} />
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <span className={labelCls}>{t("common.sellerProductFieldColors")}</span>
                    <div className="flex min-h-14 flex-wrap gap-2 rounded-2xl border border-neutral-200 bg-[#FAFAFB] p-3">
                      {colorOptions.length === 0 ? (
                        <span className="text-sm text-slate-500">{t("common.sellerProductNoColors")}</span>
                      ) : (
                        colorOptions.map((c) => {
                          const checked = colorIds.includes(c._id);
                          return (
                            <label key={c._id} className={`cursor-pointer rounded-xl border px-3 py-1.5 text-sm font-black transition ${checked ? "border-[#E11D48] bg-[#FFF1F2] text-[#BE123C]" : "border-neutral-200 bg-white text-slate-700 hover:border-[#E11D48]/40"}`}>
                              <input type="checkbox" className="sr-only" checked={checked} onChange={() => setColorIds((p) => toggleInList(p, c._id))} />
                              {c.name}
                            </label>
                          );
                        })
                      )}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <input className={`${inputCls} flex-1`} value={newColorName} onChange={(e) => setNewColorName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddColor(); } }} placeholder={t("common.sellerProductAddColorPlaceholder")} />
                      <Button type="button" variant="secondary" size="sm" onClick={handleAddColor} disabled={addColor.isPending || !newColorName.trim()}><Plus className="h-4 w-4" /></Button>
                    </div>
                    {colorAddError && <p className="mt-1 text-xs font-semibold text-red-600">{colorAddError}</p>}
                  </div>

                  {/* Sizes */}
                  <div>
                    <span className={labelCls}>{t("common.sellerProductFieldSizes")}</span>
                    <div className="flex min-h-14 flex-wrap gap-2 rounded-2xl border border-neutral-200 bg-[#FAFAFB] p-3">
                      {sizeOptions.length === 0 ? (
                        <span className="text-sm text-slate-500">{t("common.sellerProductNoSizes")}</span>
                      ) : (
                        sizeOptions.map((s) => {
                          const checked = sizeIds.includes(s._id);
                          return (
                            <label key={s._id} className={`cursor-pointer rounded-xl border px-3 py-1.5 text-sm font-black transition ${checked ? "border-[#E11D48] bg-[#FFF1F2] text-[#BE123C]" : "border-neutral-200 bg-white text-slate-700 hover:border-[#E11D48]/40"}`}>
                              <input type="checkbox" className="sr-only" checked={checked} onChange={() => setSizeIds((p) => toggleInList(p, s._id))} />
                              {s.name}
                            </label>
                          );
                        })
                      )}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <input className={`${inputCls} flex-1`} value={newSizeName} onChange={(e) => setNewSizeName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSize(); } }} placeholder={t("common.sellerProductAddSizePlaceholder")} />
                      <Button type="button" variant="secondary" size="sm" onClick={handleAddSize} disabled={addSize.isPending || !newSizeName.trim()}><Plus className="h-4 w-4" /></Button>
                    </div>
                    {sizeAddError && <p className="mt-1 text-xs font-semibold text-red-600">{sizeAddError}</p>}
                  </div>

                  {/* Stock / Variant table */}
                  <div className={cardCls}>
                    {variantRows.length === 0 ? (
                      <div>
                        <label className={labelCls}>{t("common.sellerProductFormStock")} *</label>
                        <input type="number" min={0} step={1} className={`${inputCls} max-w-[180px]`} value={stockCount} onChange={(e) => setStockCount(e.target.value)} />
                        <p className="mt-2 text-sm text-slate-500">{t("common.sellerProductHintStockSimple")}</p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="mb-1 text-sm font-black text-slate-950">{t("common.sellerProductSectionVariantStock")}</h3>
                        <p className="mb-3 text-sm text-slate-500">{t("common.sellerProductHintVariantStock")}</p>
                        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
                          <table className="w-full min-w-[260px] text-left text-sm">
                            <thead>
                              <tr className="border-b border-neutral-200 bg-[#FFF1F2] text-[#BE123C]">
                                <th className="px-4 py-2 font-black">{t("common.sellerProductVariantColCombo")}</th>
                                <th className="px-4 py-2 font-black">{t("common.sellerProductVariantColQty")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {variantRows.map((row) => (
                                <tr key={row.key} className="border-t border-neutral-100">
                                  <td className="px-4 py-2 font-semibold text-slate-800">{variantRowLabel(row)}</td>
                                  <td className="px-4 py-2">
                                    <input
                                      type="number" min={0} step={1}
                                      value={variantQty[row.key] ?? "0"}
                                      onChange={(e) => setVariantQty((p) => ({ ...p, [row.key]: e.target.value }))}
                                      className={`${inputCls} w-24`}
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
                </div>
              )}

              {/* ── ATTRIBUTES ── */}
              {activeTab === "attributes" && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {(
                      [
                        { label: "sellerProductFieldBrand", val: brandId, set: setBrandId, opts: brandOptions, newVal: newBrandName, setNew: setNewBrandName, err: brandAddError, ph: "sellerProductAddBrandPlaceholder", add: handleAddBrand, busy: addBrand.isPending },
                        { label: "sellerProductFieldMaterial", val: materialId, set: setMaterialId, opts: materialOptions, newVal: newMaterialName, setNew: setNewMaterialName, err: materialAddError, ph: "sellerProductAddMaterialPlaceholder", add: handleAddMaterial, busy: addMaterial.isPending },
                        { label: "sellerProductFieldStyle", val: styleId, set: setStyleId, opts: styleOptions, newVal: newStyleName, setNew: setNewStyleName, err: styleAddError, ph: "sellerProductAddStylePlaceholder", add: handleAddStyle, busy: addStyle.isPending },
                      ] as const
                    ).map(({ label, val, set, opts, newVal, setNew, err, ph, add, busy }) => (
                      <div key={label}>
                        <label className={labelCls}>{t(`common.${label}`)}</label>
                        <select className={inputCls} value={val} onChange={(e) => (set as (v: string) => void)(e.target.value)}>
                          <option value="">{t("common.sellerProductPhOptional")}</option>
                          {(opts as { _id: string; name: string }[]).map((o) => <option key={o._id} value={o._id}>{o.name}</option>)}
                        </select>
                        <div className="mt-2 flex gap-2">
                          <input
                            className={`${inputCls} flex-1`}
                            value={newVal}
                            onChange={(e) => (setNew as (v: string) => void)(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
                            placeholder={t(`common.${ph}`)}
                          />
                          <Button type="button" variant="secondary" size="sm" onClick={add} disabled={busy || !newVal.trim()}><Plus className="h-4 w-4" /></Button>
                        </div>
                        {err && <p className="mt-1 text-xs font-semibold text-red-600">{err}</p>}
                      </div>
                    ))}
                  </div>

                  {/* Custom attributes */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className={labelCls}>{t("common.sellerProductCustomAttributesTitle")}</span>
                      <Button type="button" variant="secondary" size="sm" onClick={() => setCustomAttributes((p) => [...p, { key: "", value: "" }])}>
                        <Plus className="mr-1.5 h-4 w-4" />
                        {t("common.sellerProductAddCustomAttr")}
                      </Button>
                    </div>
                    <p className="mb-3 text-sm text-slate-500">{t("common.sellerProductCustomAttributesHint")}</p>
                    {customAttributes.length === 0 ? (
                      <p className="text-sm text-slate-400">{t("common.sellerProductNoCustomAttrs")}</p>
                    ) : (
                      <div className="space-y-2">
                        {customAttributes.map((attr, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input className={`${inputCls} flex-1`} value={attr.key} onChange={(e) => setCustomAttributes((p) => p.map((a, j) => j === i ? { ...a, key: e.target.value } : a))} placeholder={t("common.sellerProductCustomAttrKey")} />
                            <input className={`${inputCls} flex-1`} value={attr.value} onChange={(e) => setCustomAttributes((p) => p.map((a, j) => j === i ? { ...a, value: e.target.value } : a))} placeholder={t("common.sellerProductCustomAttrValue")} />
                            <button type="button" onClick={() => setCustomAttributes((p) => p.filter((_, j) => j !== i))} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── DETAILS ── */}
              {activeTab === "details" && (
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>{t("common.sellerProductFieldCareInstructions")}</label>
                    <p className="mb-2 text-xs text-slate-500">{t("common.sellerProductCareInstructionsHint")}</p>
                    <textarea rows={4} className={inputCls} value={careInstructionsUz} onChange={(e) => setCareInstructionsUz(e.target.value)} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>{t("common.sellerProductFieldGuaranteeDuration")}</label>
                      <select className={inputCls} value={guaranteeDuration} onChange={(e) => setGuaranteeDuration(e.target.value)}>
                        {GUARANTEE_DURATIONS.map((d) => (
                          <option key={d.value} value={d.value}>{t(`common.${d.labelKey}`)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {guaranteeDuration && (
                    <div>
                      <label className={labelCls}>{t("common.sellerProductFieldGuaranteeTerms")}</label>
                      <textarea rows={3} className={inputCls} value={guaranteeTermsUz} onChange={(e) => setGuaranteeTermsUz(e.target.value)} />
                    </div>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>{t("common.sellerProductFieldWeight")}</label>
                      <input type="number" min={0} step="0.01" className={inputCls} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0.0" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>{t("common.sellerProductFieldDimensions")}</label>
                    <div className="grid grid-cols-3 gap-3">
                      {([["dimLength", dimLength, setDimLength, "sellerProductFieldDimLength"], ["dimWidth", dimWidth, setDimWidth, "sellerProductFieldDimWidth"], ["dimHeight", dimHeight, setDimHeight, "sellerProductFieldDimHeight"]] as const).map(([, val, set, labelKey]) => (
                        <div key={labelKey}>
                          <p className="mb-1 text-xs text-slate-500">{t(`common.${labelKey}`)}</p>
                          <input type="number" min={0} className={inputCls} value={val} onChange={(e) => (set as (v: string) => void)(e.target.value)} placeholder="0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── MEDIA ── */}
              {activeTab === "media" && (
                <div className="space-y-5">
                  {mode === "edit" && existingImages.length > 0 && (
                    <div>
                      <p className={labelCls}>{t("common.sellerProductExistingImages")} ({existingImages.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {existingImages.map((img, i) => (
                          <div key={i} className="relative h-20 w-20 shrink-0">
                            <img src={img} alt="" className="h-20 w-20 rounded-xl border border-neutral-200 object-cover" />
                            <button
                              type="button"
                              onClick={() => setExistingImages((prev) => prev.filter((_, j) => j !== i))}
                              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700"
                              aria-label="Remove image"
                            >
                              <span className="text-xs leading-none">×</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className={labelCls} htmlFor={imageFieldId}>
                      {mode === "edit" ? t("common.sellerProductImagesReplaceHint") : `${t("common.sellerProductFormImages")} *`}
                    </label>
                    <div className="relative min-h-[130px] overflow-hidden rounded-2xl border-2 border-dashed border-[#FBCFE8] bg-[#FFF8FA] transition hover:border-[#E11D48]/50 focus-within:border-[#E11D48] focus-within:ring-4 focus-within:ring-[#E11D48]/15">
                      <input key={fileInputKey} id={imageFieldId} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" onChange={(e) => setImageFiles(e.target.files ? Array.from(e.target.files).slice(0, 5) : [])} />
                      <div className="pointer-events-none flex min-h-[130px] flex-col items-center justify-center gap-2 text-center">
                        <ImagePlus className="h-8 w-8 text-[#BE123C]" strokeWidth={1.75} aria-hidden />
                        <span className="text-sm font-medium text-slate-800">{t("common.sellerProductFormImagesBoxCta")}</span>
                        <span className="text-xs text-slate-500">{t("common.sellerProductFormImagesBoxFormats")}</span>
                        {imageFiles.length > 0 && (
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#BE123C]">
                            {t("common.sellerProductFormImagesSelected").replace("{{n}}", String(imageFiles.length))}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {mode === "edit" && existingBarcode && (
                    <div className={cardCls}>
                      <p className={labelCls}>{t("common.sellerBarcodeTitle")}</p>
                      <p className="mb-3 text-xs text-slate-500">{t("common.sellerBarcodeHint")}</p>
                      <div className="flex items-center gap-3">
                        <code className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 font-mono text-lg font-black tracking-widest text-slate-950">
                          {existingBarcode}
                        </code>
                        <Button type="button" variant="secondary" size="sm" onClick={handlePrint} className="shrink-0 gap-2">
                          <Printer className="h-4 w-4" />
                          {t("common.sellerBarcodePrint")}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── TRANSLATIONS ── */}
              {activeTab === "translations" && (
                <div className="space-y-5">
                  <p className="text-sm text-slate-500">{t("common.sellerTranslationsHint")}</p>

                  {(
                    [
                      { lang: "🇷🇺 Russian", titleVal: titleRu, setTitle: setTitleRu, descVal: descRu, setDesc: setDescRu, careVal: careRu, setCare: setCareRu, gVal: guaranteeRu, setG: setGuaranteeRu, titleKey: "sellerTranslationsTitleRu", descKey: "sellerTranslationsDescRu", careKey: "sellerTranslationsCareRu", gKey: "sellerTranslationsGuaranteeRu" },
                      { lang: "🇬🇧 English", titleVal: titleEn, setTitle: setTitleEn, descVal: descEn, setDesc: setDescEn, careVal: careEn, setCare: setCareEn, gVal: guaranteeEn, setG: setGuaranteeEn, titleKey: "sellerTranslationsTitleEn", descKey: "sellerTranslationsDescEn", careKey: "sellerTranslationsCareEn", gKey: "sellerTranslationsGuaranteeEn" },
                      { lang: "🇰🇿 Kazakh", titleVal: titleKk, setTitle: setTitleKk, descVal: descKk, setDesc: setDescKk, careVal: careKk, setCare: setCareKk, gVal: guaranteeKk, setG: setGuaranteeKk, titleKey: "sellerTranslationsTitleKk", descKey: "sellerTranslationsDescKk", careKey: "sellerTranslationsCareKk", gKey: "sellerTranslationsGuaranteeKk" },
                    ] as const
                  ).map(({ lang, titleVal, setTitle, descVal, setDesc, careVal, setCare, gVal, setG, titleKey, descKey, careKey, gKey }) => (
                    <div key={lang} className={cardCls}>
                      <h3 className="mb-3 text-sm font-black text-slate-950">{lang}</h3>
                      <div className="space-y-3">
                        <div>
                          <label className={labelCls}>{t(`common.${titleKey}`)}</label>
                          <input className={inputCls} value={titleVal} onChange={(e) => (setTitle as (v: string) => void)(e.target.value)} />
                        </div>
                        <div>
                          <label className={labelCls}>{t(`common.${descKey}`)}</label>
                          <textarea rows={3} className={inputCls} value={descVal} onChange={(e) => (setDesc as (v: string) => void)(e.target.value)} />
                        </div>
                        {careInstructionsUz && (
                          <div>
                            <label className={labelCls}>{t(`common.${careKey}`)}</label>
                            <textarea rows={2} className={inputCls} value={careVal} onChange={(e) => (setCare as (v: string) => void)(e.target.value)} />
                          </div>
                        )}
                        {guaranteeDuration && (
                          <div>
                            <label className={labelCls}>{t(`common.${gKey}`)}</label>
                            <textarea rows={2} className={inputCls} value={gVal} onChange={(e) => (setG as (v: string) => void)(e.target.value)} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 px-5 py-4">
          {formError && (
            <p className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700" role="alert">
              {formError}
            </p>
          )}
          <div className="flex items-center justify-between gap-3">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              {t("common.sellerDrawerCancel")}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={isPending}
              className="!border-[#E11D48] !bg-[#E11D48] shadow-lg shadow-[#E11D48]/20 hover:!bg-[#BE123C]"
            >
              {isPending
                ? mode === "create"
                  ? t("common.sellerProductFormSubmitting")
                  : t("common.sellerProductFormSaving")
                : mode === "create"
                  ? t("common.sellerProductFormSubmit")
                  : t("common.sellerProductFormSaveChanges")}
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
