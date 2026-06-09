import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { cartLineKey, type CartItem } from "../../../context/cart";
import { useT } from "../../../i18n";
import { productDisplayTitle } from "../../../lib/productDisplayTitle";

export default function CartSidebarItem({
  item,
  onRemove,
}: {
  item: CartItem;
  onRemove: (lineKey: string) => void;
}) {
  const t = useT();
  const displayTitle = productDisplayTitle(item, t);
  const ariaView = t("productAriaView").replace("{title}", displayTitle);
  const detailTo = item.mongoId
    ? `/shop-details?id=${encodeURIComponent(item.mongoId)}`
    : `/shop-details?id=${item.id}`;
  const imageSrc = item.imgs?.thumbnails?.[0] ?? item.imgs?.previews?.[0];
  const lineTotal = item.discountedPrice * item.quantity;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3 shadow-[0_18px_60px_-48px_rgba(15,23,42,0.6)] transition duration-200 ease-out hover:border-neutral-300 hover:shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)]">
      <div className="flex gap-3">
        <Link
          to={detailTo}
          className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F7F8FA] ring-1 ring-neutral-100 transition group-hover:bg-[#F1F3F6]"
          aria-label={ariaView}
        >
          {imageSrc ?
            <img
              src={imageSrc}
              alt=""
              className="h-full w-full object-contain object-center p-2"
            />
          : <span className="text-[11px] font-semibold text-neutral-400">
              {t("productImageUnavailable")}
            </span>}
        </Link>

        <div className="min-w-0 flex-1 pr-8">
          <h3 className="line-clamp-2 text-[15px] font-black leading-snug text-neutral-950">
            <Link
              to={detailTo}
              className="transition duration-200 ease-out hover:text-[#BE123C]"
            >
              {displayTitle}
            </Link>
          </h3>

          {item.selectedSizeName || item.selectedColorName ?
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                item.selectedSizeName ?
                  `${t("cartItemSizeLabel")}: ${item.selectedSizeName}`
                : null,
                item.selectedColorName ?
                  `${t("cartItemColorLabel")}: ${item.selectedColorName}`
                : null,
              ]
                .filter(Boolean)
                .map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] font-semibold text-neutral-600"
                  >
                    {label}
                  </span>
                ))}
            </div>
          : null}

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">
                {t("common.price")}
              </p>
              <p className="text-lg font-black text-[#E11D48]">
                ${item.discountedPrice}
              </p>
            </div>
            <div className="rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-bold text-white">
              x{item.quantity}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
        <p className="text-xs font-semibold text-neutral-500">
          {t("common.total")}
        </p>
        <p className="text-base font-black text-neutral-950">
          ${lineTotal.toFixed(2)}
        </p>
      </div>

      <button
        onClick={() => onRemove(cartLineKey(item))}
        aria-label={t("ariaRemoveProductFromCart")}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm ring-1 ring-neutral-200 transition duration-200 hover:bg-red-50 hover:text-red-600 hover:ring-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        type="button"
      >
        <Trash2 className="h-4.5 w-4.5" strokeWidth={2.15} />
      </button>
    </article>
  );
}
