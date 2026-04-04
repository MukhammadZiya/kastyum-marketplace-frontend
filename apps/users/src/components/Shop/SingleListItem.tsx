import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { useCart } from "../../context/cart";
import { useQuickViewModal } from "../../context/quickViewModal";
import { useT } from "../../i18n";
import { productDisplayTitle } from "../../lib/productDisplayTitle";

function detailQuery(item: Product) {
  return item.mongoId
    ? encodeURIComponent(item.mongoId)
    : String(item.id);
}

export default function SingleListItem({ item }: { item: Product }) {
  const t = useT();
  const { addItem } = useCart();
  const { open } = useQuickViewModal();
  const q = detailQuery(item);
  const displayTitle = productDisplayTitle(item, t);
  const ariaView = t("productAriaView").replace("{title}", displayTitle);

  return (
    <div className="group flex items-center gap-6 rounded-lg border border-neutral-200 bg-white p-5 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_10px_32px_-10px_rgba(15,23,42,0.1)]">
      <Link
        to={`/shop-details?id=${q}`}
        className="shrink-0 rounded-lg bg-neutral-50 transition-colors duration-200 group-hover:bg-[#E8ECF4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        aria-label={ariaView}
      >
        <img src={item.imgs.previews[0]} alt="" className="h-36 w-36 object-contain" />
      </Link>
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-neutral-900">
          <Link to={`/shop-details?id=${q}`} className="hover:text-blue-600">
            {displayTitle}
          </Link>
        </h3>
        <p className="text-sm text-neutral-600 mt-2">
          ({item.reviews}) {t("common.reviews")}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-semibold text-neutral-900">${item.discountedPrice}</span>
          <span className="line-through text-neutral-500">${item.price}</span>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => addItem({ ...item, quantity: 1 })}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white shadow-sm transition duration-200 ease-out hover:-translate-y-px hover:bg-blue-700 hover:shadow-md active:translate-y-0 active:shadow-sm"
            type="button"
          >
            {t("common.addToCart")}
          </button>
          <button
            onClick={() => open(item)}
            className="px-4 py-2 rounded-md border border-neutral-300 text-sm hover:bg-neutral-50"
            type="button"
          >
            {t("productQuickViewButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
