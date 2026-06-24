import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";
import { useCart } from "../../context/cart";
import { useT } from "../../i18n";
import { productDisplayTitle } from "../../lib/productDisplayTitle";
import { showStrikethroughOriginalPrice } from "../../lib/productPriceDisplay";

function detailQuery(item: Product) {
  return item.mongoId
    ? encodeURIComponent(item.mongoId)
    : String(item.id);
}

export default function SingleListItem({ item }: { item: Product }) {
  const t = useT();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const q = detailQuery(item);
  const displayTitle = productDisplayTitle(item, t);
  const ariaView = t("productAriaView").replace("{title}", displayTitle);

  return (
    <div className="group flex items-center gap-6 rounded-xl border border-neutral-200 bg-white p-5 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[#FFE4EA] hover:shadow-[0_18px_60px_-46px_rgba(15,23,42,0.35)]">
      <Link
        to={`/shop-details?id=${q}`}
        className="shrink-0 rounded-lg bg-neutral-50 transition-colors duration-200 group-hover:bg-[#FFF1F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48]"
        aria-label={ariaView}
      >
        <img src={item.imgs.previews[0]} alt="" className="h-36 w-36 object-contain" />
      </Link>
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-neutral-900">
          <Link to={`/shop-details?id=${q}`} className="hover:text-[#BE123C]">
            {displayTitle}
          </Link>
        </h3>
        <p className="text-sm text-neutral-600 mt-2">
          ({item.reviews}) {t("common.reviews")}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-semibold text-neutral-900">${item.discountedPrice}</span>
          {showStrikethroughOriginalPrice(item) ?
            <span className="line-through text-neutral-500">${item.price}</span>
          : null}
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => {
              if (item.hasSizes || item.hasColors) {
                navigate(`/shop-details?id=${q}`);
              } else {
                addItem({ ...item, quantity: 1 });
              }
            }}
            className="rounded-lg bg-[#E11D48] px-4 py-2 text-sm font-black text-white shadow-sm transition duration-200 ease-out hover:-translate-y-px hover:bg-[#BE123C] hover:shadow-md active:translate-y-0 active:shadow-sm"
            type="button"
          >
            {item.hasSizes || item.hasColors ? t("productSelectOptions") : t("common.addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
}
