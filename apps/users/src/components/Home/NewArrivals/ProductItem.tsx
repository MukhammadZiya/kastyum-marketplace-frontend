import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
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
  const { addItem } = useCart();
  const { addItem: addWishlistItem } = useWishlist();
  const detailTo = productDetailPath(item);
  const displayTitle = productDisplayTitle(item, t);
  const ariaDetails = t("productAriaViewDetails").replace("{title}", displayTitle);

  return (
    <article className="group relative overflow-hidden rounded-[1.25rem] bg-white shadow-[0_18px_60px_-42px_rgba(15,23,42,0.55)] ring-1 ring-neutral-200/80 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_28px_82px_-46px_rgba(15,23,42,0.58)] hover:ring-neutral-300">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-white">
        <Link
          to={detailTo}
          className="absolute inset-0 z-[1]"
          aria-label={ariaDetails}
        />
        {showStrikethroughOriginalPrice(item) ? (
          <span className="absolute left-0 top-4 z-10 rounded-r-2xl bg-[#E11D48] px-4 py-1.5 text-[12px] font-black text-white shadow-sm">
            Sale
          </span>
        ) : null}
        <button
          onClick={() => addWishlistItem(item)}
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-neutral-700 shadow-sm ring-1 ring-neutral-200 transition duration-200 hover:text-[#E11D48] hover:ring-[#E11D48]/30"
          type="button"
        >
          <Heart className="h-5 w-5" strokeWidth={2.2} />
        </button>
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#FBFBFC] p-5 sm:p-6">
          <img
            src={item.imgs.previews[0]}
            alt=""
            className="h-full w-full object-contain object-center transition duration-500 ease-out group-hover:scale-[1.045]"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 bg-neutral-950/0 transition duration-200 sm:group-hover:bg-neutral-950/14" />
        <div className="absolute inset-x-4 bottom-4 z-20 flex translate-y-0 items-center justify-center opacity-100 transition duration-200 ease-out sm:translate-y-4 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <button
            onClick={() => addItem({ ...item, quantity: 1 })}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 text-[13px] font-black text-white shadow-[0_14px_32px_-18px_rgba(15,23,42,0.9)] transition duration-200 ease-out hover:-translate-y-px hover:bg-[#E11D48] hover:shadow-md active:translate-y-0 active:shadow-sm"
            type="button"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={2.2} />
            {t("common.addToCart")}
          </button>
        </div>
      </div>

      <Link
        to={detailTo}
        className="block text-neutral-900 visited:text-neutral-900 no-underline"
      >
        <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  aria-hidden
                />
              ))}
            </div>
            <p className="text-[13px] font-medium text-neutral-500">
              ({item.reviews})
            </p>
          </div>

          <h3 className="mb-2 line-clamp-2 min-h-[2.75rem] text-[14px] font-bold leading-snug text-neutral-950 duration-200 ease-out group-hover:text-[#BE123C] sm:text-[15px]">
            {displayTitle}
          </h3>

          <span className="flex flex-wrap items-end gap-x-2 gap-y-0.5 text-lg font-black">
            <span className="text-[#E11D48]">${item.discountedPrice}</span>
            {showStrikethroughOriginalPrice(item) ?
              <span className="pb-0.5 text-sm font-semibold text-neutral-400 line-through">
                ${item.price}
              </span>
            : null}
          </span>
        </div>
      </Link>
    </article>
  );
}
