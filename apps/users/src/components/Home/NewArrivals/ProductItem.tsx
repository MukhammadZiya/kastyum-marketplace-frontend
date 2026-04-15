import { Link } from "react-router-dom";
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
    <div className="group rounded-xl p-1 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_14px_40px_-14px_rgba(15,23,42,0.12)] hover:ring-1 hover:ring-neutral-200/70">
      {/* Fixed aspect + object-contain: same card height for every product; image never cropped (letterboxed if needed). */}
      <div className="relative mb-4 aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#F6F7FB] transition-colors duration-200 group-hover:bg-[#E8ECF4]">
        <Link
          to={detailTo}
          className="absolute inset-0 z-[1]"
          aria-label={ariaDetails}
        />
        <div className="absolute inset-x-0 top-0 bottom-[5.25rem] z-0 flex items-center justify-center p-3 sm:p-4">
          <img
            src={item.imgs.previews[0]}
            alt=""
            className="max-h-full max-w-full object-contain object-center"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="absolute bottom-0 left-0 z-10 flex w-full translate-y-0 items-center justify-center gap-[10px] pb-5">
          <button
            onClick={() => open(item)}
            aria-label="Quick view"
            className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-white text-neutral-900 shadow-sm duration-200 ease-out hover:text-blue-600"
            type="button"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 18C10 18.5523 9.55228 19 9 19H4C2.89543 19 2 18.1046 2 17V6C2 4.89543 2.89543 4 4 4H18C19.1046 4 20 4.89543 20 6V11C20 11.5523 19.5523 12 19 12C18.4477 12 18 11.5523 18 11V6H4V17H9C9.55228 17 10 17.4477 10 18Z"
                fill=""
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.5 11C13.0147 11 11 13.0147 11 15.5C11 17.9853 13.0147 20 15.5 20C17.9853 20 20 17.9853 20 15.5C20 13.0147 17.9853 11 15.5 11ZM9 15.5C9 11.9101 11.9101 9 15.5 9C19.0899 9 22 11.9101 22 15.5C22 19.0899 19.0899 22 15.5 22C11.9101 22 9 19.0899 9 15.5Z"
                fill=""
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.2071 18.2071C18.5976 17.8166 19.2308 17.8166 19.6213 18.2071L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L18.2071 19.6213C17.8166 19.2308 17.8166 18.5976 18.2071 18.2071Z"
                fill=""
              />
            </svg>
          </button>

          <button
            onClick={() => addItem({ ...item, quantity: 1 })}
            className="inline-flex rounded-[5px] bg-blue-600 px-5 py-[7px] text-[14px] font-medium text-white shadow-sm transition duration-200 ease-out hover:-translate-y-px hover:bg-blue-700 hover:shadow-md active:translate-y-0 active:shadow-sm"
            type="button"
          >
            Add to cart
          </button>

          <button
            onClick={() => addWishlistItem(item)}
            aria-label="Add to wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-white text-neutral-900 shadow-sm duration-200 ease-out hover:text-blue-600"
            type="button"
          >
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.74949 2.94946C2.6435 3.45502 1.83325 4.65749 1.83325 6.0914C1.83325 7.55633 2.43273 8.68549 3.29211 9.65318C4.0004 10.4507 4.85781 11.1118 5.694 11.7564C6.26719 12.1982 6.79902 12.5834 7.99992 13.1667C9.20082 12.5834 9.73265 12.1982 10.3058 11.7564C11.142 11.1118 11.9994 10.4507 12.7077 9.65318C13.5671 8.68549 14.1666 7.55633 14.1666 6.0914C14.1666 4.65749 13.3563 3.45502 12.2503 2.94946C11.1759 2.45832 9.73214 2.58839 8.36016 4.01382C8.2659 4.11175 8.13584 4.16709 7.99992 4.16709C7.864 4.16709 7.73393 4.11175 7.63967 4.01382C6.26769 2.58839 4.82396 2.45832 3.74949 2.94946Z"
                fill=""
              />
            </svg>
          </button>
        </div>
      </div>

      <Link
        to={detailTo}
        className="block text-neutral-900 visited:text-neutral-900 no-underline"
      >
        <div className="mb-2 flex items-center gap-[10px]">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M6.10227 3.60558C6.94671 2.09075 7.36892 1.33333 8.00016 1.33333C8.6314 1.33333 9.05362 2.09074 9.89805 3.60558L10.1165 3.99748C10.3565 4.42795 10.4765 4.64319 10.6635 4.7852C10.8506 4.92721 11.0836 4.97993 11.5496 5.08536L11.9738 5.18135C13.6136 5.55237 14.4335 5.73787 14.6285 6.36515C14.8236 6.99242 14.2647 7.64604 13.1468 8.95328L12.8576 9.29148C12.5399 9.66295 12.381 9.84869 12.3096 10.0785C12.2381 10.3083 12.2621 10.5561 12.3102 11.0517L12.3539 11.5029C12.5229 13.2471 12.6074 14.1191 12.0967 14.5068C11.586 14.8945 10.8184 14.541 9.28305 13.8341L8.88584 13.6512C8.44955 13.4503 8.2314 13.3499 8.00016 13.3499C7.76893 13.3499 7.55078 13.4503 7.11449 13.6512L6.71728 13.8341C5.18195 14.541 4.41428 14.8945 3.9036 14.5068C3.39291 14.1191 3.47742 13.2471 3.64643 11.5029L3.69015 11.0517C3.73818 10.5561 3.76219 10.3083 3.69074 10.0785C3.61928 9.84869 3.46045 9.66295 3.14278 9.29148L2.85356 8.95328C1.73566 7.64604 1.17671 6.99242 1.37178 6.36515C1.56684 5.73787 2.38673 5.55237 4.02652 5.18135L4.45075 5.08536C4.91673 4.97993 5.14972 4.92721 5.33679 4.7852C5.52387 4.64319 5.64385 4.42795 5.88381 3.99748L6.10227 3.60558Z"
                  fill="#FBBF24"
                />
              </svg>
            ))}
          </div>
          <p className="text-[14px] text-neutral-700">({item.reviews})</p>
        </div>

        <h3 className="mb-[6px] font-medium text-neutral-900 duration-200 ease-out group-hover:text-blue-600">
          {displayTitle}
        </h3>

        <span className="flex items-center gap-2 text-lg font-medium">
          <span className="text-neutral-900">${item.discountedPrice}</span>
          {showStrikethroughOriginalPrice(item) ?
            <span className="text-neutral-500 line-through">${item.price}</span>
          : null}
        </span>
      </Link>
    </div>
  );
}
