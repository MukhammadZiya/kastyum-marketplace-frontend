import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { useCart } from "../../context/cart";
import { useQuickViewModal } from "../../context/quickViewModal";

export default function SingleListItem({ item }: { item: Product }) {
  const { addItem } = useCart();
  const { open } = useQuickViewModal();

  return (
    <div className="flex items-center gap-6 rounded-lg border border-neutral-200 bg-white p-5">
      <Link
        to={`/shop-details?id=${item.id}`}
        className="shrink-0 rounded-lg bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        aria-label={`View ${item.title}`}
      >
        <img src={item.imgs.previews[0]} alt="" className="h-36 w-36 object-contain" />
      </Link>
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-neutral-900">
          <Link to={`/shop-details?id=${item.id}`} className="hover:text-blue-600">
            {item.title}
          </Link>
        </h3>
        <p className="text-sm text-neutral-600 mt-2">({item.reviews}) reviews</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-semibold text-neutral-900">${item.discountedPrice}</span>
          <span className="line-through text-neutral-500">${item.price}</span>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => addItem({ ...item, quantity: 1 })}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
            type="button"
          >
            Add to cart
          </button>
          <button
            onClick={() => open(item)}
            className="px-4 py-2 rounded-md border border-neutral-300 text-sm hover:bg-neutral-50"
            type="button"
          >
            Quick view
          </button>
        </div>
      </div>
    </div>
  );
}

