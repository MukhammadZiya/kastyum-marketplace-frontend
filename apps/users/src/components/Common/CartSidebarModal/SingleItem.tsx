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
    <article className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-2.5 shadow-sm">
      <Link
        to={detailTo}
        className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F7F8FA] ring-1 ring-neutral-100"
        aria-label={ariaView}
      >
        {imageSrc ?
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-contain object-center p-1"
          />
        : <span className="px-1 text-center text-[9px] font-semibold text-neutral-400">
            {t("productImageUnavailable")}
          </span>}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to={detailTo}
          className="line-clamp-1 text-sm font-bold text-neutral-950 transition duration-200 ease-out hover:text-[#BE123C]"
        >
          {displayTitle}
        </Link>

        {item.selectedSizeName || item.selectedColorName ?
          <p className="mt-0.5 truncate text-[11px] font-semibold text-neutral-500">
            {[
              item.selectedSizeName ?
                `${t("cartItemSizeLabel")}: ${item.selectedSizeName}`
              : null,
              item.selectedColorName ?
                `${t("cartItemColorLabel")}: ${item.selectedColorName}`
              : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        : null}

        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500">x{item.quantity}</span>
          <span className="text-sm font-black text-neutral-950">${lineTotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => onRemove(cartLineKey(item))}
        aria-label={t("ariaRemoveProductFromCart")}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 transition duration-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        type="button"
      >
        <Trash2 className="h-4 w-4" strokeWidth={2.15} />
      </button>
    </article>
  );
}
