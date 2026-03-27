import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartModal } from "../../../context/cartSidebarModal";
import { useCart } from "../../../context/cart";
import CartSidebarItem from "./SingleItem";
import EmptyCart from "./EmptyCart";

export default function CartSidebarModal() {
  const { isCartModalOpen, closeCartModal } = useCartModal();
  const { items, totalPrice, removeItem } = useCart();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(".modal-content")) closeCartModal();
    }

    if (isCartModalOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartModalOpen, closeCartModal]);

  return (
    <div
      className={`fixed top-0 left-0 z-[99999] overflow-y-auto no-scrollbar w-full h-screen bg-black/70 ease-linear duration-300 ${
        isCartModalOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-end">
        <div className="w-full max-w-[500px] shadow-lg bg-white px-4 sm:px-[30px] lg:px-11 relative modal-content">
          <div className="sticky top-0 bg-white flex items-center justify-between pb-7 pt-4 sm:pt-[30px] lg:pt-11 border-b border-neutral-200 mb-[30px]">
            <h2 className="font-medium text-neutral-900 text-lg sm:text-2xl">Cart View</h2>
            <button
              onClick={closeCartModal}
              aria-label="close modal"
              className="flex items-center justify-center ease-in duration-150 text-neutral-500 hover:text-neutral-900"
              type="button"
            >
              <svg
                className="fill-current"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5379 11.2121C12.1718 10.846 11.5782 10.846 11.212 11.2121C10.8459 11.5782 10.8459 12.1718 11.212 12.5379L13.6741 15L11.2121 17.4621C10.846 17.8282 10.846 18.4218 11.2121 18.7879C11.5782 19.154 12.1718 19.154 12.5379 18.7879L15 16.3258L17.462 18.7879C17.8281 19.154 18.4217 19.154 18.7878 18.7879C19.154 18.4218 19.154 17.8282 18.7878 17.462L16.3258 15L18.7879 12.5379C19.154 12.1718 19.154 11.5782 18.7879 11.2121C18.4218 10.846 17.8282 10.846 17.462 11.2121L15 13.6742L12.5379 11.2121Z"
                  fill=""
                />
              </svg>
            </button>
          </div>

          <div className="h-[66vh] overflow-y-auto no-scrollbar">
            <div className="flex flex-col gap-6">
              {items.length > 0 ? (
                items.map((item) => (
                  <CartSidebarItem key={item.id} item={item} onRemove={removeItem} />
                ))
              ) : (
                <EmptyCart />
              )}
            </div>
          </div>

          <div className="border-t border-neutral-200 bg-white pt-5 pb-4 sm:pb-[30px] lg:pb-11 mt-[30px] sticky bottom-0">
            <div className="flex items-center justify-between gap-5 mb-6">
              <p className="font-medium text-xl text-neutral-900">Subtotal:</p>
              <p className="font-medium text-xl text-neutral-900">${totalPrice.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                onClick={closeCartModal}
                to="/cart"
                className="w-full flex justify-center font-medium text-white bg-blue-600 py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-blue-700"
              >
                View Cart
              </Link>

              <Link
                to="/checkout"
                className="w-full flex justify-center font-medium text-white bg-neutral-900 py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

