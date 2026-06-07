import { Link } from "react-router-dom";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "../../../types/product";
import { useCart } from "../../../context/cart";
import { useQuickViewModal } from "../../../context/quickViewModal";
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
  const { open } = useQuickViewModal();
  const { addItem: addWishlistItem } = useWishlist();
  const detailTo = productDetailPath(item);
  const displayTitle = productDisplayTitle(item, t);
  const ariaDetails = t("productAriaViewDetails").replace("{title}", displayTitle);

  return (
    <article className="group rounded-2xl bg-white p-2 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_24px_70px_-34px_rgba(15,23,42,0.38)]">
      <div className="relative mb-3 aspect-[4/5] w-full overflow-hidden rounded-[1.15rem] bg-[#F6F7FB] transition-colors duration-200 group-hover:bg-[#EEF1F6]">
        <Link
          to={detailTo}
          className="absolute inset-0 z-[1]"
          aria-label={ariaDetails}
        />
        {showStrikethroughOriginalPrice(item) ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#E11D48] px-2.5 py-1 text-[11px] font-black text-white shadow-sm">
            Sale
          </span>
        ) : null}
        <div className="absolute inset-0 z-0 flex items-center justify-center p-2">
          <img
            src={item.imgs.previews[0]}
            alt=""
            className="h-full w-full object-cover object-center transition duration-500 ease-out group-hover:scale-[1.045]"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="absolute inset-x-3 bottom-3 z-10 flex translate-y-3 items-center justify-center gap-2 opacity-0 transition duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={() => open(item)}
            aria-label="Quick view"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-neutral-900 shadow-sm duration-200 ease-out hover:text-[#E11D48]"
            type="button"
          >
            <Eye className="h-4.5 w-4.5" strokeWidth={2.2} />
          </button>

          <button
            onClick={() => addItem({ ...item, quantity: 1 })}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#111827] px-4 text-[13px] font-bold text-white shadow-sm transition duration-200 ease-out hover:-translate-y-px hover:bg-[#E11D48] hover:shadow-md active:translate-y-0 active:shadow-sm"
            type="button"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={2.2} />
            {t("common.addToCart")}
          </button>

          <button
            onClick={() => addWishlistItem(item)}
            aria-label="Add to wishlist"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-neutral-900 shadow-sm duration-200 ease-out hover:text-[#E11D48]"
            type="button"
          >
            <Heart className="h-4.5 w-4.5" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <Link
        to={detailTo}
        className="block text-neutral-900 visited:text-neutral-900 no-underline"
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                aria-hidden
              />
            ))}
          </div>
          <p className="text-[13px] font-medium text-neutral-500">({item.reviews})</p>
        </div>

        <h3 className="mb-2 line-clamp-2 min-h-[2.75rem] text-[15px] font-semibold leading-snug text-neutral-950 duration-200 ease-out group-hover:text-[#BE123C]">
          {displayTitle}
        </h3>

        <span className="flex items-end gap-2 text-lg font-black">
          <span className="text-[#E11D48]">${item.discountedPrice}</span>
          {showStrikethroughOriginalPrice(item) ?
            <span className="pb-0.5 text-sm font-semibold text-neutral-400 line-through">${item.price}</span>
          : null}
        </span>
        <span className="mt-2 block text-[12px] font-medium text-neutral-500">
          iBerry · Tez yetkazib berish
        </span>
      </Link>
    </article>
  );
}
