import { useMemo, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react";
import type { Product } from "../../../types/product";
import { useCart } from "../../../context/cart";
import { useWishlist } from "../../../context/wishlist";
import { useT } from "../../../i18n";
import { productDisplayTitle } from "../../../lib/productDisplayTitle";
import { showStrikethroughOriginalPrice } from "../../../lib/productPriceDisplay";

function productDetailPath(item: Product) {
  if (item.mongoId) {
    return `/shop-details?id=${encodeURIComponent(item.mongoId)}`;
  }
  return `/shop-details?id=${item.id}`;
}

export default function ProductItem({ item }: { item: Product }) {
  const t = useT();
  const [imageIndex, setImageIndex] = useState(0);
  const { addItem } = useCart();
  const { addItem: addWishlistItem } = useWishlist();
  const detailTo = productDetailPath(item);
  const displayTitle = productDisplayTitle(item, t);
  const ariaDetails = t("productAriaViewDetails").replace("{title}", displayTitle);
  const cardBrand = item.brandName || item.sellerName || "iBerry";
  const cardCategory =
    item.categoryLabel ||
    ("category" in item && typeof item.category === "string" ? item.category : "Tailored clothing");
  const cardImages = useMemo(() => {
    const images = [...(item.imgs.previews || []), ...(item.imgs.thumbnails || [])].filter(Boolean);
    return Array.from(new Set(images));
  }, [item.imgs.previews, item.imgs.thumbnails]);
  const hasCarousel = cardImages.length > 1;
  const safeImageIndex = cardImages.length ? imageIndex % cardImages.length : 0;
  const currentImage = cardImages[safeImageIndex] || "/images/logo/logo.svg";

  const changeImage = (delta: number, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasCarousel) {
      return;
    }

    setImageIndex((current) => (current + delta + cardImages.length) % cardImages.length);
  };

  const selectImage = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setImageIndex(index);
  };

  return (
    <article className="group relative overflow-hidden rounded-xl bg-white shadow-[0_14px_54px_-48px_rgba(15,23,42,0.6)] ring-1 ring-neutral-100 transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_24px_72px_-52px_rgba(15,23,42,0.7)]">
      <div className="relative aspect-[5/6] w-full overflow-hidden bg-[#FAFAFB]">
        <Link
          to={detailTo}
          className="absolute inset-0 z-[1]"
          aria-label={ariaDetails}
        />
        {showStrikethroughOriginalPrice(item) ? (
          <span className="absolute left-0 top-3 z-10 rounded-r-xl bg-[#E11D48] px-3 py-1.5 text-[11px] font-black uppercase text-white shadow-sm">
            {t("common.new")}
          </span>
        ) : null}
        <div className="absolute inset-0 z-0 flex items-center justify-center p-4 sm:p-5">
          <img
            src={currentImage}
            alt=""
            className="h-full w-full object-contain object-center transition duration-500 ease-out group-hover:scale-[1.025]"
            loading="lazy"
            decoding="async"
          />
        </div>

        {hasCarousel ? (
          <>
            <button
              onClick={(event) => changeImage(-1, event)}
              className="absolute left-2 top-1/2 z-30 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.7)] ring-1 ring-black/5 transition duration-200 ease-out hover:scale-105 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#E11D48] sm:opacity-0 sm:group-hover:opacity-100"
              type="button"
              aria-label="Previous product image"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
            </button>
            <button
              onClick={(event) => changeImage(1, event)}
              className="absolute right-2 top-1/2 z-30 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.7)] ring-1 ring-black/5 transition duration-200 ease-out hover:scale-105 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#E11D48] sm:opacity-0 sm:group-hover:opacity-100"
              type="button"
              aria-label="Next product image"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
            </button>
            <div className="absolute inset-x-0 bottom-2 z-30 flex items-center justify-center gap-1.5">
              {cardImages.slice(0, 6).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={(event) => selectImage(index, event)}
                  className={`h-1.5 rounded-full shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#E11D48] ${
                    index === safeImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/70 hover:bg-white"
                  }`}
                  type="button"
                  aria-label={`Show product image ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-2 px-3 pt-3 opacity-100 transition duration-200 ease-out sm:opacity-0 sm:group-hover:opacity-100 ${
            hasCarousel ? "pb-8" : "pb-3"
          }`}
        >
          <button
            onClick={() => addItem({ ...item, quantity: 1 })}
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#E11D48] text-white shadow-[0_18px_34px_-18px_rgba(225,29,72,0.85)] transition duration-200 ease-out hover:-translate-y-px hover:bg-[#BE123C] active:translate-y-0"
            type="button"
            aria-label={t("common.addToCart")}
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>
      </div>

      <Link
        to={detailTo}
        className="block text-neutral-900 visited:text-neutral-900 no-underline"
      >
        <div className="px-4 pb-4 pt-3">
          <div className="mb-2 flex items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.12em]">
            <span className="truncate text-[#BE123C]">{cardBrand}</span>
            <span className="truncate text-neutral-400">{cardCategory}</span>
          </div>

          <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-[14px] font-black leading-snug text-neutral-950 duration-200 ease-out group-hover:text-[#BE123C]">
            {displayTitle}
          </h3>

          <span className="flex flex-wrap items-end gap-x-2 gap-y-0.5 text-[26px] font-black leading-none tracking-tight">
            <span className="text-neutral-950">${item.discountedPrice}</span>
            {showStrikethroughOriginalPrice(item) ?
              <span className="pb-0.5 text-sm font-black text-neutral-400 line-through">
                ${item.price}
              </span>
            : null}
          </span>
        </div>
      </Link>
      <button
        onClick={() => addWishlistItem(item)}
        aria-label="Add to wishlist"
        className="absolute bottom-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-500 transition duration-200 hover:text-[#E11D48]"
        type="button"
      >
        <Heart className="h-5 w-5" strokeWidth={2.1} />
      </button>
    </article>
  );
}
