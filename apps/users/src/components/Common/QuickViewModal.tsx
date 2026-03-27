import { useEffect, useState } from "react";
import { useQuickViewModal } from "../../context/quickViewModal";
import { useCart } from "../../context/cart";

export default function QuickViewModal() {
  const { isOpen, close, product } = useQuickViewModal();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activePreview, setActivePreview] = useState(0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(".modal-content")) close();
    }

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      setQuantity(1);
      setActivePreview(0);
    };
  }, [isOpen, close]);

  if (!product) return null;

  return (
    <div
      className={`${isOpen ? "z-[99999]" : "hidden"} fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 bg-black/70 sm:px-8 px-4 py-5`}
    >
      <div className="flex items-center justify-center">
        <div className="w-full max-w-[1100px] rounded-xl shadow-2 bg-white p-[30px] relative modal-content">
          <button
            onClick={close}
            aria-label="close modal"
            className="absolute top-0 right-0 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-neutral-100 text-neutral-500 hover:text-neutral-900"
            type="button"
          >
            <svg
              className="fill-current"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
                fill=""
              />
            </svg>
          </button>

          <div className="flex flex-wrap items-center gap-[50px]">
            <div className="max-w-[526px] w-full">
              <div className="flex gap-5">
                <div className="flex flex-col gap-5">
                  {product.imgs.thumbnails?.map((img, key) => (
                    <button
                      onClick={() => setActivePreview(key)}
                      key={img}
                      className={`flex items-center justify-center w-20 h-20 overflow-hidden rounded-lg bg-neutral-100 ease-out duration-200 hover:border-2 hover:border-blue-600 ${
                        activePreview === key ? "border-2 border-blue-600" : ""
                      }`}
                      type="button"
                    >
                      <img src={img} alt="thumbnail" width={61} height={61} className="aspect-square" />
                    </button>
                  ))}
                </div>

                <div className="relative z-[1] overflow-hidden flex items-center justify-center w-full sm:min-h-[508px] bg-neutral-100 rounded-lg border border-neutral-200">
                  {product?.imgs?.previews?.[activePreview] && (
                    <img
                      src={product.imgs.previews[activePreview]}
                      alt="product details"
                      width={400}
                      height={400}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="max-w-[445px] w-full">
              <span className="inline-block text-[12px] font-medium text-white py-1 px-3 bg-green-600 mb-[26px]">
                SALE 20% OFF
              </span>

              <h3 className="font-semibold text-xl xl:text-[28px] text-neutral-900 mb-4">
                {product.title}
              </h3>

              <div className="flex flex-wrap items-center gap-5 mb-6">
                <span>
                  <span className="font-medium text-neutral-900"> 4.7 Rating </span>
                  <span className="text-neutral-500"> (5 reviews) </span>
                </span>
                <span className="font-medium text-green-600">In Stock</span>
              </div>

              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has.
              </p>

              <div className="flex flex-wrap justify-between gap-5 mt-6 mb-[30px]">
                <div>
                  <h4 className="font-semibold text-lg text-neutral-900 mb-[14px]">Price</h4>
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900 text-xl">
                      ${product.discountedPrice}
                    </span>
                    <span className="font-medium text-neutral-500 text-lg line-through">
                      ${product.price}
                    </span>
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-lg text-neutral-900 mb-[14px]">Quantity</h4>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="flex items-center justify-center w-10 h-10 rounded-[5px] bg-neutral-100 text-neutral-900 ease-out duration-200 hover:text-blue-600"
                      type="button"
                    >
                      -
                    </button>
                    <span className="flex items-center justify-center w-20 h-10 rounded-[5px] border border-neutral-300 bg-white font-medium text-neutral-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex items-center justify-center w-10 h-10 rounded-[5px] bg-neutral-100 text-neutral-900 ease-out duration-200 hover:text-blue-600"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    addItem({ ...product, quantity });
                    close();
                  }}
                  className="inline-flex font-medium text-white bg-blue-600 py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-700"
                  type="button"
                >
                  Add to Cart
                </button>
                <button
                  className="inline-flex items-center gap-2 font-medium text-white bg-neutral-900 py-3 px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
                  type="button"
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

