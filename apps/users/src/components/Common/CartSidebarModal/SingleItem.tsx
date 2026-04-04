import { Link } from "react-router-dom";
import type { CartItem } from "../../../context/cart";

export default function CartSidebarItem({
  item,
  onRemove,
}: {
  item: CartItem;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-lg border border-transparent px-1 py-1 transition duration-200 ease-out hover:border-neutral-100 hover:bg-neutral-50/80">
      <div className="flex w-full items-center gap-6">
        <Link
          to={`/shop-details?id=${item.id}`}
          className="flex h-[90px] w-full max-w-[90px] items-center justify-center rounded-[10px] bg-neutral-100"
          aria-label={`View ${item.title}`}
        >
          <img
            src={item.imgs?.thumbnails[0]}
            alt=""
            className="max-h-[78px] max-w-[78px] object-contain object-center"
          />
        </Link>

        <div className="min-w-0">
          <h3 className="mb-1 font-medium text-neutral-900">
            <Link
              to={`/shop-details?id=${item.id}`}
              className="ease-out duration-200 hover:text-blue-600"
            >
              {item.title}
            </Link>
          </h3>
          <p className="text-[14px] text-neutral-600">Price: ${item.discountedPrice}</p>
        </div>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        aria-label="remove product from cart"
        className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-[38px] bg-neutral-100 border border-neutral-200 text-neutral-900 ease-out duration-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
        type="button"
      >
        <svg
          className="fill-current"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.63993 9.39928C9.01774 9.3615 9.35464 9.63715 9.39242 10.015L9.85076 14.5983C9.88854 14.9761 9.61289 15.313 9.23508 15.3508C8.85727 15.3886 8.52036 15.1129 8.48258 14.7351L8.02425 10.1518C7.98647 9.77397 8.26212 9.43706 8.63993 9.39928Z"
            fill=""
          />
          <path
            d="M13.3601 9.39928C13.7379 9.43706 14.0135 9.77397 13.9758 10.1518L13.5174 14.7351C13.4796 15.1129 13.1427 15.3886 12.7649 15.3508C12.3871 15.313 12.1115 14.9761 12.1492 14.5983L12.6076 10.015C12.6454 9.63715 12.9823 9.3615 13.3601 9.39928Z"
            fill=""
          />
        </svg>
      </button>
    </div>
  );
}

