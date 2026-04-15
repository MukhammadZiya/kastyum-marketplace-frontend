import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
} from "../lib/apiProductVariants";
import { useWishlist } from "../context/wishlist";
import type { ProductWithRelations } from "@repo/types";
import type { Product } from "../types/product";

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

function ShopDetailsApiSpecs({
  apiProduct,
  t,
}: {
  apiProduct: ProductWithRelations;
  t: TranslateFn;
}) {
  const brandName = apiProduct.brand?.name;
  const materialName = apiProduct.material?.name;
  const fitName = apiProduct.fit?.name;
  const styleName = apiProduct.style?.name;
  const sku = apiProduct.modelNumber?.trim();
  const sellerNick =
    apiProduct.sellerId &&
    typeof apiProduct.sellerId === "object" &&
    "nick" in apiProduct.sellerId ?
      apiProduct.sellerId.nick?.trim() || null
    : null;

  return (
    <div className="mt-6 space-y-5 rounded-xl border border-neutral-200 bg-neutral-50/90 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {t("productDetailSpecsHeading")}
      </h2>
      <dl className="grid gap-3 text-sm sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-x-6">
        {brandName ? (
          <>
            <dt className="text-neutral-500">{t("productDetailBrand")}</dt>
            <dd className="font-medium text-neutral-900">{brandName}</dd>
          </>
        ) : null}
        {materialName ? (
          <>
            <dt className="text-neutral-500">{t("productDetailMaterial")}</dt>
            <dd className="font-medium text-neutral-900">{materialName}</dd>
          </>
        ) : null}
        {fitName ? (
          <>
            <dt className="text-neutral-500">{t("productDetailFit")}</dt>
            <dd className="font-medium text-neutral-900">{fitName}</dd>
          </>
        ) : null}
        {styleName ? (
          <>
            <dt className="text-neutral-500">{t("productDetailStyle")}</dt>
            <dd className="font-medium text-neutral-900">{styleName}</dd>
          </>
        ) : null}
        {sku ? (
          <>
            <dt className="text-neutral-500">{t("productDetailSku")}</dt>
            <dd className="font-medium text-neutral-900">{sku}</dd>
          </>
        ) : null}
        {sellerNick ? (
          <>
            <dt className="text-neutral-500">{t("productDetailSeller")}</dt>
            <dd className="font-medium text-neutral-900">{sellerNick}</dd>
          </>
        ) : null}
        <dt className="text-neutral-500">{t("productDetailAudience")}</dt>
        <dd className="font-medium text-neutral-900">
          {audienceLabel(apiProduct.audience, t)}
        </dd>
      </dl>
    </div>
  );
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
  sizeOptions: ReturnType<typeof variantSizesFromApiProduct>;
  colorOptions: ReturnType<typeof variantColorsFromApiProduct>;
  selectedSizeId: string | null;
  selectedColorId: string | null;
  onSelectSize: (id: string) => void;
  onSelectColor: (id: string) => void;
  t: TranslateFn;
}) {
  if (sizeOptions.length === 0 && colorOptions.length === 0) return null;

  return (
    <div className="mt-6 space-y-5">
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
                      "border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600"
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
                      "border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600"
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
  );
}

type InnerProps = {
  product: Product;
  mongoId?: string;
  apiProduct: ProductWithRelations | undefined;
};

function ShopDetailsBody({ product, mongoId, apiProduct }: InnerProps) {
  const t = useT();
  const [preview, setPreview] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [variantError, setVariantError] = useState<string | null>(null);
  const { addItem } = useCart();
  const { addItem: addWishlistItem } = useWishlist();

  const sizeOptions = useMemo(
    () => (apiProduct ? variantSizesFromApiProduct(apiProduct) : []),
    [apiProduct],
  );
  const colorOptions = useMemo(
    () => (apiProduct ? variantColorsFromApiProduct(apiProduct) : []),
    [apiProduct],
  );

  useEffect(() => {
    if (!apiProduct) {
      setSelectedSizeId(null);
      setSelectedColorId(null);
      return;
    }
    const sizes = variantSizesFromApiProduct(apiProduct);
    const colors = variantColorsFromApiProduct(apiProduct);
    setSelectedSizeId(sizes.length === 1 ? sizes[0].id : null);
    setSelectedColorId(colors.length === 1 ? colors[0].id : null);
    setVariantError(null);
  }, [apiProduct]);

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

  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="grid gap-10 lg:grid-cols-[570px_1fr]">
          <div>
            <div className="flex min-h-[min(520px,72vh)] items-center justify-center rounded-lg bg-neutral-100 p-6 sm:p-8">
                <img
                  src={product.imgs.previews[preview] || ""}
                  alt={displayTitle}
                  className="max-h-[min(560px,68vh)] w-full max-w-full object-contain object-center"
                />
            </div>
            <div className="mt-5 flex gap-3">
              {product.imgs.thumbnails.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  onClick={() => setPreview(i)}
                  className={`flex h-20 w-20 items-center justify-center rounded-md border bg-neutral-50 ${
                    i === preview ? "border-blue-600" : "border-neutral-200"
                  }`}
                  type="button"
                >
                  <img src={img} alt="" className="max-h-14 max-w-14 object-contain" />
                </button>
              ))}
            </div>
          </div>
          <div>
              <h1 className="text-3xl font-semibold text-neutral-900">{displayTitle}</h1>
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
              <span className="text-2xl font-semibold text-neutral-900">
                ${product.discountedPrice}
              </span>
              {showStrikethroughOriginalPrice(product) ?
                <span className="text-neutral-500 line-through">${product.price}</span>
              : null}
            </div>
            <p className="mt-5 text-neutral-600">{description}</p>
            {mongoId && apiProduct ?
              <ShopDetailsApiSpecs apiProduct={apiProduct} t={t} />
            : null}
            {mongoId && apiProduct ?
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
            : null}
            {variantError ?
              <p className="mt-3 text-sm text-red-600" role="alert">
                {variantError}
              </p>
            : null}

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                className="h-10 w-10 rounded border border-neutral-300"
                type="button"
              >
                -
              </button>
              <span className="w-14 text-center">{qty}</span>
              <button
                onClick={() => setQty((v) => v + 1)}
                className="h-10 w-10 rounded border border-neutral-300"
                type="button"
              >
                +
              </button>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() => {
                  setVariantError(null);
                  if (mongoId && apiProduct) {
                    if (sizeOptions.length > 0 && !selectedSizeId) {
                      setVariantError(t("productPleaseSelectSize"));
                      return;
                    }
                    if (colorOptions.length > 0 && !selectedColorId) {
                      setVariantError(t("productPleaseSelectColor"));
                      return;
                    }
                  }
                  const sizeOpt = sizeOptions.find((s) => s.id === selectedSizeId);
                  const colorOpt = colorOptions.find((c) => c.id === selectedColorId);
                  const vRows = apiProduct.variantStock;
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
                }}
                className="rounded-md bg-blue-600 px-7 py-3 text-white shadow-sm transition duration-200 ease-out hover:-translate-y-px hover:bg-blue-700 hover:shadow-md active:translate-y-0 active:shadow-sm"
                type="button"
              >
                {t("productPurchaseNow")}
              </button>
              <button
                onClick={() => addWishlistItem(product)}
                className="rounded-md border border-neutral-300 px-5 py-3 hover:bg-neutral-50"
                type="button"
              >
                {t("productDetailAddWishlist")}
              </button>
            </div>
          </div>
        </div>

        <ProductReviewsSection productId={product.id} />
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
        <section className="py-10 px-4">
          <p className="mx-auto max-w-[1170px] text-neutral-600">
            {t("productLoading")}
          </p>
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
        <section className="py-10 px-4">
          <p className="mx-auto max-w-[1170px] text-red-600" role="alert">
            {error instanceof Error ? error.message : t("productLoadError")}
          </p>
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
