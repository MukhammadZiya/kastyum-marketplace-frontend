import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { StarRating } from "../components/Common/StarRating";
import { ProductReviewsSection } from "../components/Shop/ProductReviewsSection";
import { shopData } from "../data/shopData";
import { getReviewStats } from "../data/productReviews";
import { useT } from "../i18n";
import type { TranslateFn } from "../i18n/types";
import { useProductDetail } from "../hooks/products";
import { apiProductToStorefront } from "../lib/apiProductToStorefront";
import { showStrikethroughOriginalPrice } from "../lib/productPriceDisplay";
import { productDisplayTitle } from "../lib/productDisplayTitle";
import { useCart } from "../context/cart";
import {
  variantColorsFromApiProduct,
  variantSizesFromApiProduct,
  type VariantOption,
} from "../lib/apiProductVariants";
import { useWishlist } from "../context/wishlist";
import type { ProductWithRelations } from "@repo/types";
import type { Product } from "../types/product";

function productGallerySources(product: Product): string[] {
  const fromPreviews = product.imgs.previews
    .map((s) => (s?.trim() ? s.trim() : ""))
    .filter((s) => s.length > 0);
  if (fromPreviews.length > 0) return fromPreviews;
  return product.imgs.thumbnails
    .map((s) => (s?.trim() ? s.trim() : ""))
    .filter((s) => s.length > 0);
}

function ProductImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex w-full min-h-[min(320px,50vh)] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-neutral-200/90 bg-white/50 px-6 text-center text-neutral-500">
      <svg
        className="h-14 w-14 shrink-0 text-neutral-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.5" fill="currentColor" stroke="none" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 15l-4-4-4.5 4.5-3-3L3 18"
        />
      </svg>
      <p className="max-w-xs text-sm font-medium leading-snug text-neutral-600">
        {label}
      </p>
    </div>
  );
}

function isMongoObjectId(value: string | null): value is string {
  return !!value && /^[0-9a-fA-F]{24}$/.test(value);
}

function audienceLabel(audience: string, t: TranslateFn): string {
  switch (audience) {
    case "MEN":
      return t("productDetailAudienceMen");
    case "WOMEN":
      return t("productDetailAudienceWomen");
    case "UNISEX":
      return t("productDetailAudienceUnisex");
    default:
      return audience;
  }
}

type DetailSpec = {
  label: string;
  value: string;
};

function ShopDetailsSpecs({ items, t }: { items: DetailSpec[]; t: TranslateFn }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_16px_50px_-44px_rgba(15,23,42,0.65)] ring-1 ring-neutral-200 sm:p-6">
      <h2 className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">
        {t("productDetailSpecsHeading")}
      </h2>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-x-6">
        {items.map((item) => (
          <div className="contents" key={item.label}>
            <dt className="text-neutral-500">{item.label}</dt>
            <dd className="font-medium text-neutral-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function productArrayValue(product: Product, key: "colors" | "sizes"): string[] {
  if (key in product) {
    const value = product[key as keyof Product];
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  }
  return [];
}

function productStringValue(product: Product, key: "category"): string | null {
  if (key in product) {
    const value = product[key as keyof Product];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function fallbackVariantOptions(values: string[], prefix: string): VariantOption[] {
  return values.map((value, index) => ({
    id: `${prefix}-${index}-${value}`,
    label: value,
  }));
}

function buildDetailSpecs(
  product: Product,
  apiProduct: ProductWithRelations | undefined,
  t: TranslateFn,
): DetailSpec[] {
  const sellerNick =
    apiProduct?.sellerId &&
    typeof apiProduct.sellerId === "object" &&
    "nick" in apiProduct.sellerId ?
      apiProduct.sellerId.nick?.trim() || null
    : null;
  const category = product.categoryLabel || productStringValue(product, "category");
  const specs: DetailSpec[] = [
    {
      label: t("productDetailBrand"),
      value: apiProduct?.brand?.name || product.brandName || "iBerry",
    },
  ];

  if (apiProduct?.material?.name) {
    specs.push({
      label: t("productDetailMaterial"),
      value: apiProduct.material.name,
    });
  }
  if (apiProduct?.style?.name || category) {
    specs.push({
      label: t("productDetailStyle"),
      value: apiProduct?.style?.name || category || "",
    });
  }
  if (apiProduct?.modelNumber?.trim()) {
    specs.push({
      label: t("productDetailSku"),
      value: apiProduct.modelNumber.trim(),
    });
  }
  specs.push({
    label: t("productDetailSeller"),
    value: sellerNick || product.sellerName || "iBerry",
  });
  specs.push({
    label: t("productDetailAudience"),
    value: apiProduct ? audienceLabel(apiProduct.audience, t) : t("productDetailAudienceMen"),
  });

  return specs.filter((item) => item.value.trim().length > 0);
}

function ShopDetailsVariantPickers({
  sizeOptions,
  colorOptions,
  selectedSizeId,
  selectedColorId,
  onSelectSize,
  onSelectColor,
  t,
}: {
  sizeOptions: VariantOption[];
  colorOptions: VariantOption[];
  selectedSizeId: string | null;
  selectedColorId: string | null;
  onSelectSize: (id: string) => void;
  onSelectColor: (id: string) => void;
  t: TranslateFn;
}) {
  if (sizeOptions.length === 0 && colorOptions.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_16px_50px_-44px_rgba(15,23,42,0.65)] ring-1 ring-neutral-200 sm:p-6">
      <h2 className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">
        {t("productOptionsHeading")}
      </h2>
      <div className="mt-5 space-y-5">
      {sizeOptions.length > 0 ?
        <div>
          <p className="text-sm font-medium text-neutral-800">
            {t("productChooseSize")}
            {sizeOptions.length > 1 ?
              <span className="text-red-600"> *</span>
            : null}
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="listbox" aria-label={t("productChooseSize")}>
            {sizeOptions.map((s) => {
              const selected = selectedSizeId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => onSelectSize(s.id)}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                    selected ?
                      "border-[#E11D48] bg-[#FFF1F2] text-[#BE123C] ring-1 ring-[#E11D48]"
                    : "border-neutral-300 bg-white text-neutral-900 hover:border-neutral-400"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      : null}
      {colorOptions.length > 0 ?
        <div>
          <p className="text-sm font-medium text-neutral-800">
            {t("productChooseColor")}
            {colorOptions.length > 1 ?
              <span className="text-red-600"> *</span>
            : null}
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="listbox" aria-label={t("productChooseColor")}>
            {colorOptions.map((c) => {
              const selected = selectedColorId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => onSelectColor(c.id)}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition ${
                    selected ?
                      "border-[#E11D48] bg-[#FFF1F2] text-[#BE123C] ring-1 ring-[#E11D48]"
                    : "border-neutral-300 bg-white text-neutral-900 hover:border-neutral-400"
                  }`}
                >
                  {c.hex ?
                    <span
                      className="h-5 w-5 shrink-0 rounded-full border border-neutral-300"
                      style={{ backgroundColor: c.hex }}
                      aria-hidden
                    />
                  : null}
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      : null}
      </div>
    </div>
  );
}

type InnerProps = {
  product: Product;
  mongoId?: string;
  apiProduct: ProductWithRelations | undefined;
};

function ShopDetailsBody({ product, mongoId, apiProduct }: InnerProps) {
  const t = useT();
  const gallerySources = useMemo(
    () => productGallerySources(product),
    [product],
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mainImageFailed, setMainImageFailed] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [variantError, setVariantError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addItem: addWishlistItem } = useWishlist();

  const sizeOptions = useMemo(
    () =>
      apiProduct ?
        variantSizesFromApiProduct(apiProduct)
      : fallbackVariantOptions(productArrayValue(product, "sizes"), "size"),
    [apiProduct, product],
  );
  const colorOptions = useMemo(
    () =>
      apiProduct ?
        variantColorsFromApiProduct(apiProduct)
      : fallbackVariantOptions(productArrayValue(product, "colors"), "color"),
    [apiProduct, product],
  );
  const detailSpecs = useMemo(
    () => buildDetailSpecs(product, apiProduct, t),
    [product, apiProduct, t],
  );

  useEffect(() => {
    setActiveImageIndex(0);
    setMainImageFailed(false);
  }, [product.mongoId, product.id, gallerySources]);

  useEffect(() => {
    if (gallerySources.length < 2) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setActiveImageIndex((index) =>
          index === 0 ? gallerySources.length - 1 : index - 1,
        );
        setMainImageFailed(false);
      }
      if (event.key === "ArrowRight") {
        setActiveImageIndex((index) => (index + 1) % gallerySources.length);
        setMainImageFailed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gallerySources.length]);

  useEffect(() => {
    setSelectedSizeId(sizeOptions.length === 1 ? sizeOptions[0].id : null);
    setSelectedColorId(colorOptions.length === 1 ? colorOptions[0].id : null);
    setVariantError(null);
  }, [sizeOptions, colorOptions]);

  const reviewStats = getReviewStats(product.id);
  const displayTitle = productDisplayTitle(product, t);

  const description =
    mongoId && apiProduct ?
      (apiProduct.description?.trim() || t("productDescriptionFallback"))
    : t("productDescriptionFallback");

  const reviewSummaryText =
    reviewStats && reviewStats.count > 0 ?
      `${reviewStats.average.toFixed(1)} ${t("productReviewOutOfFive")} · ${reviewStats.count} ${
        reviewStats.count === 1
          ? t("productReviewNounOne")
          : t("productReviewNounMany")
      }`
    : t("productShopperRatingsSeeBelow").replace(
        "{count}",
        String(product.reviews),
      );

  const activeImageSrc =
    gallerySources.length > 0
      ? gallerySources[Math.min(activeImageIndex, gallerySources.length - 1)]
      : "";
  const showImagePlaceholder = gallerySources.length === 0 || mainImageFailed;
  const hasGalleryControls = gallerySources.length > 1 && !showImagePlaceholder;
  const goToPreviousImage = () => {
    setActiveImageIndex((index) =>
      index === 0 ? gallerySources.length - 1 : index - 1,
    );
    setMainImageFailed(false);
  };
  const goToNextImage = () => {
    setActiveImageIndex((index) => (index + 1) % gallerySources.length);
    setMainImageFailed(false);
  };

  return (
    <section className="bg-white py-5 sm:py-8">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8 xl:px-0">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,690px)_minmax(390px,1fr)] lg:gap-10">
          <div className="min-w-0 lg:grid lg:grid-cols-[86px_minmax(0,1fr)] lg:gap-5">
            <div className="order-2">
              <div className="flex min-h-[430px] items-start justify-center overflow-hidden bg-white p-2 sm:min-h-[min(650px,78vh)] sm:p-3 lg:min-h-[650px]">
              {showImagePlaceholder ?
                <div className="w-full max-w-full">
                  <ProductImagePlaceholder label={t("productImageUnavailable")} />
                </div>
              : <img
                  src={activeImageSrc}
                  alt={displayTitle}
                  className="max-h-[420px] w-full max-w-full object-contain object-center sm:max-h-[min(640px,76vh)]"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  onError={() => setMainImageFailed(true)}
                  onLoad={() => setMainImageFailed(false)}
                />
              }
              </div>
              {hasGalleryControls ?
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={goToPreviousImage}
                    aria-label={t("common.ariaPrevious")}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-900 shadow-[0_14px_34px_-22px_rgba(15,23,42,0.75)] ring-1 ring-neutral-200 transition hover:bg-[#E11D48] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]"
                  >
                    <ChevronLeft className="h-6 w-6" strokeWidth={2.35} />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextImage}
                    aria-label={t("common.ariaNext")}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-900 shadow-[0_14px_34px_-22px_rgba(15,23,42,0.75)] ring-1 ring-neutral-200 transition hover:bg-[#E11D48] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]"
                  >
                    <ChevronRight className="h-6 w-6" strokeWidth={2.35} />
                  </button>
                </div>
              : null}
            </div>
            {gallerySources.length > 1 ?
              <nav
                className="order-1 -mx-1 mt-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-gutter:stable] sm:mx-0 lg:mt-0 lg:flex-col lg:overflow-visible lg:pb-0"
                aria-label={t("productGalleryThumbnails")}
              >
                {gallerySources.map((img, i) => {
                  const selected = i === activeImageIndex;
                  const imagePickerLabel = t("productGalleryImageN")
                    .replace("{n}", String(i + 1))
                    .replace("{total}", String(gallerySources.length));
                  return (
                    <button
                      key={`g-${i}`}
                      type="button"
                      aria-label={imagePickerLabel}
                      onClick={() => {
                        setActiveImageIndex(i);
                        setMainImageFailed(false);
                      }}
                      className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] sm:h-24 sm:w-24 lg:h-20 lg:w-20 ${
                        selected
                          ? "border-[#E11D48] ring-2 ring-[#E11D48]/20"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full rounded-xl object-cover object-center"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  );
                })}
              </nav>
            : null}
          </div>
          <div className="min-w-0 border-t border-neutral-200 pt-6 sm:pt-7 lg:sticky lg:top-[178px] lg:self-start lg:border-t-0 lg:pt-3">
              <h1 className="text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl">{displayTitle}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {reviewStats && reviewStats.count > 0 ?
                <>
                  <StarRating value={reviewStats.average} size="md" />
                  <span className="text-sm text-neutral-600">
                    {reviewSummaryText}
                  </span>
                </>
              : <span className="text-sm text-neutral-600">{reviewSummaryText}</span>}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-4xl font-black text-[#E11D48]">
                ${product.discountedPrice}
              </span>
              {showStrikethroughOriginalPrice(product) ?
                <span className="text-neutral-500 line-through">${product.price}</span>
              : null}
            </div>
            <p className="mt-5 leading-7 text-neutral-600">{description}</p>
            {detailSpecs.length > 0 || sizeOptions.length > 0 || colorOptions.length > 0 ?
              <div className="mt-7 grid gap-4 xl:grid-cols-2">
                <ShopDetailsSpecs items={detailSpecs} t={t} />
                <ShopDetailsVariantPickers
                  sizeOptions={sizeOptions}
                  colorOptions={colorOptions}
                  selectedSizeId={selectedSizeId}
                  selectedColorId={selectedColorId}
                  onSelectSize={(id) => {
                    setSelectedSizeId(id);
                    setVariantError(null);
                  }}
                  onSelectColor={(id) => {
                    setSelectedColorId(id);
                    setVariantError(null);
                  }}
                  t={t}
                />
              </div>
            : null}
            {variantError ?
              <p className="mt-3 text-sm text-red-600" role="alert">
                {variantError}
              </p>
            : null}

            <div className="mt-7 inline-flex items-center gap-3 rounded-xl bg-neutral-50 p-1">
              <button
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                className="h-11 w-11 rounded-lg bg-white text-lg leading-none text-neutral-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]"
                type="button"
                aria-label={t("productQuantityDecrease")}
              >
                <Minus className="mx-auto h-4 w-4" strokeWidth={2.4} />
              </button>
              <span className="min-w-14 text-center tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button
                onClick={() => setQty((v) => v + 1)}
                className="h-11 w-11 rounded-lg bg-white text-lg leading-none text-neutral-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]"
                type="button"
                aria-label={t("productQuantityIncrease")}
              >
                <Plus className="mx-auto h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                onClick={() => {
                  setVariantError(null);
                  if (sizeOptions.length > 0 && !selectedSizeId) {
                    setVariantError(t("productPleaseSelectSize"));
                    return;
                  }
                  if (colorOptions.length > 0 && !selectedColorId) {
                    setVariantError(t("productPleaseSelectColor"));
                    return;
                  }
                  const sizeOpt = sizeOptions.find((s) => s.id === selectedSizeId);
                  const colorOpt = colorOptions.find((c) => c.id === selectedColorId);
                  const vRows = apiProduct?.variantStock;
                  if (vRows && vRows.length > 0) {
                    const hasS = sizeOptions.length > 0;
                    const hasC = colorOptions.length > 0;
                    const line = vRows.find((r) => {
                      const rs = String(r.sizeId ?? "");
                      const rc = String(r.colorId ?? "");
                      if (hasS && rs !== String(selectedSizeId ?? "")) return false;
                      if (!hasS && rs) return false;
                      if (hasC && rc !== String(selectedColorId ?? "")) return false;
                      if (!hasC && rc) return false;
                      return true;
                    });
                    if (!line || line.quantity < 1) {
                      setVariantError(t("productVariantOutOfStock"));
                      return;
                    }
                    if (qty > line.quantity) {
                      setVariantError(
                        t("productVariantNotEnoughStock").replace(
                          "{n}",
                          String(line.quantity),
                        ),
                      );
                      return;
                    }
                  }
                  addItem({
                    ...product,
                    quantity: qty,
                    selectedSizeId: sizeOpt?.id,
                    selectedSizeName: sizeOpt?.label,
                    selectedColorId: colorOpt?.id,
                    selectedColorName: colorOpt?.label,
                  });
                  navigate("/checkout");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E11D48] px-7 py-3.5 font-bold text-white shadow-[0_18px_40px_-24px_rgba(225,29,72,1)] transition duration-200 ease-out hover:-translate-y-px hover:bg-[#BE123C] hover:shadow-md active:translate-y-0 active:shadow-sm"
                type="button"
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={2.25} />
                {t("productPurchaseNow")}
              </button>
              <button
                onClick={() => addWishlistItem(product)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 px-5 py-3.5 font-bold hover:bg-neutral-50"
                type="button"
              >
                <Heart className="h-5 w-5" strokeWidth={2.2} />
                {t("productDetailAddWishlist")}
              </button>
            </div>
          </div>
        </div>

        <ProductReviewsSection productId={product.id} productMongoId={mongoId} />
      </div>
    </section>
  );
}

export function ShopDetailsPage() {
  const t = useT();
  const [searchParams] = useSearchParams();

  const rawId = searchParams.get("id");
  const mongoId = isMongoObjectId(rawId) ? rawId : undefined;
  const { data: apiProduct, isPending, isError, error } =
    useProductDetail(mongoId);

  const mockProduct = useMemo((): Product | null => {
    const idNum = rawId ? Number.parseInt(rawId, 10) : NaN;
    if (Number.isFinite(idNum)) {
      const found = shopData.find((p) => p.id === idNum);
      if (found) return found;
    }
    return shopData[0] ?? null;
  }, [rawId]);

  const product = useMemo((): Product | null => {
    if (mongoId) {
      if (!apiProduct) return null;
      return apiProductToStorefront(apiProduct);
    }
    return mockProduct;
  }, [mongoId, apiProduct, mockProduct]);

  const bodyKey =
    product ? (product.mongoId ?? String(product.id)) : "";

  if (mongoId && isPending) {
    return (
      <>
        <Breadcrumb
          title={t("productBreadcrumbTitle")}
          pages={[t("productBreadcrumbPathShop"), t("productBreadcrumbPathDetails")]}
        />
        <section
          className="py-10 px-4"
          aria-busy="true"
          aria-label={t("productLoading")}
        >
          <div className="mx-auto max-w-[1170px] sm:px-4 xl:px-0">
            <div className="grid animate-pulse gap-10 md:grid-cols-2">
              <div
                className="aspect-[3/4] max-h-[min(520px,72vh)] w-full max-w-lg rounded-lg bg-neutral-200"
                aria-hidden
              />
              <div className="min-w-0 space-y-4">
                <div className="h-9 w-3/4 rounded-md bg-neutral-200" />
                <div className="h-4 w-1/2 rounded-md bg-neutral-200" />
                <div className="h-10 w-40 rounded-md bg-neutral-200" />
                <div className="h-3 w-full rounded bg-neutral-100" />
                <div className="h-3 w-5/6 rounded bg-neutral-100" />
                <div className="h-3 w-4/6 rounded bg-neutral-100" />
              </div>
            </div>
            <p className="sr-only">{t("productLoading")}</p>
          </div>
        </section>
      </>
    );
  }

  if (mongoId && isError) {
    return (
      <>
        <Breadcrumb
          title={t("productBreadcrumbTitle")}
          pages={[t("productBreadcrumbPathShop"), t("productBreadcrumbPathDetails")]}
        />
        <section className="py-10 px-4 sm:px-6">
          <div
            className="mx-auto max-w-[1170px] rounded-xl border border-red-200 bg-red-50/60 px-4 py-5 sm:px-5"
            role="alert"
          >
            <p className="text-sm text-red-800 sm:text-base">
              {error instanceof Error ? error.message : t("productLoadError")}
            </p>
          </div>
        </section>
      </>
    );
  }

  if (!product) return null;

  return (
    <>
      <Breadcrumb
        title={t("productBreadcrumbTitle")}
        pages={[t("productBreadcrumbPathShop"), t("productBreadcrumbPathDetails")]}
      />
      <ShopDetailsBody
        key={bodyKey}
        product={product}
        mongoId={mongoId}
        apiProduct={apiProduct}
      />
    </>
  );
}
