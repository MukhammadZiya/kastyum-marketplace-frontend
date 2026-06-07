import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartModal } from "../../../context/cartSidebarModal";
import { cartLineKey, useCart } from "../../../context/cart";
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
        <div className="relative min-h-screen w-full max-w-[520px] bg-[#FAFAFB] px-4 shadow-2xl sm:px-7 lg:px-9 modal-content">
          <div className="sticky top-0 z-10 mb-5 flex items-center justify-between border-b border-neutral-200 bg-[#FAFAFB]/95 pb-5 pt-4 backdrop-blur sm:pt-7 lg:pt-9">
            <div>
              <h2 className="text-xl font-black tracking-tight text-neutral-950 sm:text-2xl">
                Cart View
              </h2>
              <p className="mt-1 text-sm font-medium text-neutral-500">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
            <button
              onClick={closeCartModal}
              aria-label="close modal"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm ring-1 ring-neutral-200 transition duration-150 hover:text-neutral-900"
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

          <div className="h-[66vh] overflow-y-auto no-scrollbar pr-1">
            <div className="flex flex-col gap-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <CartSidebarItem
                    key={cartLineKey(item)}
                    item={item}
                    onRemove={removeItem}
                  />
                ))
              ) : (
                <EmptyCart />
              )}
            </div>
          </div>

          <div className="sticky bottom-0 mt-5 border-t border-neutral-200 bg-[#FAFAFB]/95 pb-4 pt-5 backdrop-blur sm:pb-7 lg:pb-9">
            <div className="mb-5 flex items-center justify-between gap-5 rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-neutral-200">
              <p className="text-sm font-bold uppercase tracking-wide text-neutral-500">
                Subtotal
              </p>
              <p className="text-xl font-black text-neutral-950">
                ${totalPrice.toFixed(2)}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                onClick={closeCartModal}
                to="/cart"
                className="flex w-full justify-center rounded-2xl bg-[#315CF6] px-6 py-3.5 font-bold text-white shadow-sm transition duration-200 ease-out hover:-translate-y-px hover:bg-[#2148D8] hover:shadow-md active:translate-y-0 active:shadow-sm"
              >
                View Cart
              </Link>

              <Link
                to="/checkout"
                className="flex w-full justify-center rounded-2xl bg-neutral-950 px-6 py-3.5 font-bold text-white shadow-sm transition duration-200 ease-out hover:-translate-y-px hover:bg-neutral-800 hover:shadow-md active:translate-y-0 active:shadow-sm"
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
