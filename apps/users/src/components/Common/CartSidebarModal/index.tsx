import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useCartModal } from "../../../context/cartSidebarModal";
import { cartLineKey, useCart } from "../../../context/cart";
import CartSidebarItem from "./SingleItem";
import EmptyCart from "./EmptyCart";

export default function CartSidebarModal() {
  const { isCartModalOpen, closeCartModal, anchorRect } = useCartModal();
  const { items, totalPrice, removeItem } = useCart();

  useEffect(() => {
    if (!isCartModalOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(".modal-content") && !target?.closest(".cart-toggle")) {
        closeCartModal();
      }
    }

    function handleScroll() {
      closeCartModal();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isCartModalOpen, closeCartModal]);

  if (!isCartModalOpen) return null;

  const anchoredStyle = anchorRect
    ? {
        top: Math.round(anchorRect.bottom + 8),
        right: Math.round(Math.max(8, window.innerWidth - anchorRect.right)),
      }
    : undefined;

  return (
    <div
      className="modal-content fixed right-4 top-[84px] z-[99999] w-[calc(100vw-2rem)] max-w-[380px] overflow-hidden rounded-3xl bg-white shadow-[0_30px_90px_-35px_rgba(15,23,42,0.45)] ring-1 ring-neutral-100 sm:right-6 sm:top-[96px] sm:w-[380px] lg:right-10"
      style={anchoredStyle}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3.5">
        <div>
          <h2 className="text-base font-black tracking-tight text-neutral-950">
            Cart View
          </h2>
          <p className="text-xs font-medium text-neutral-500">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        <button
          onClick={closeCartModal}
          aria-label="close modal"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition duration-150 hover:bg-neutral-200 hover:text-neutral-900"
          type="button"
        >
          <X className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>

      <div className="max-h-[50vh] overflow-y-auto no-scrollbar p-3">
        <div className="flex flex-col gap-2.5">
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

      {items.length > 0 ? (
        <div className="border-t border-neutral-100 p-3">
          <div className="mb-3 flex items-center justify-between gap-5 rounded-2xl bg-[#FAFAFA] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
              Subtotal
            </p>
            <p className="text-lg font-black text-neutral-950">
              ${totalPrice.toFixed(2)}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              onClick={closeCartModal}
              to="/cart"
              className="flex w-full justify-center rounded-2xl bg-[#315CF6] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition duration-200 ease-out hover:-translate-y-px hover:bg-[#2148D8] hover:shadow-md active:translate-y-0 active:shadow-sm"
            >
              View Cart
            </Link>

            <Link
              onClick={closeCartModal}
              to="/checkout"
              className="flex w-full justify-center rounded-2xl bg-neutral-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition duration-200 ease-out hover:-translate-y-px hover:bg-neutral-800 hover:shadow-md active:translate-y-0 active:shadow-sm"
            >
              Checkout
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
