import { Link } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { useCart } from "../context/cart";

export function CartPage() {
  const { items, removeItem, totalPrice, clear } = useCart();

  return (
    <>
      <Breadcrumb title="Cart" pages={["cart"]} />
      <section className="bg-neutral-100 py-10">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          {items.length === 0 ? (
            <div className="bg-white rounded-lg p-10 text-center border border-neutral-200">
              <p className="mb-6">Your cart is empty.</p>
              <Link to="/shop-with-sidebar" className="inline-flex px-6 py-3 rounded-md bg-neutral-900 text-white">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-neutral-900">Your Cart</h2>
                <button onClick={clear} className="text-blue-600" type="button">
                  Clear Shopping Cart
                </button>
              </div>

              <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="p-5 border-b border-neutral-200 last:border-b-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={item.imgs.thumbnails[0]} alt={item.title} className="w-20 h-20 object-contain bg-neutral-50 rounded-md" />
                      <div>
                        <p className="font-medium text-neutral-900">{item.title}</p>
                        <p className="text-sm text-neutral-600">
                          ${item.discountedPrice} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <p className="font-medium text-neutral-900">
                        ${(item.discountedPrice * item.quantity).toFixed(2)}
                      </p>
                      <button onClick={() => removeItem(item.id)} className="text-red-600" type="button">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <div className="w-full max-w-md bg-white border border-neutral-200 rounded-lg p-5">
                  <div className="flex justify-between mb-4">
                    <span className="text-neutral-700">Subtotal</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <Link to="/checkout" className="w-full inline-flex justify-center rounded-md bg-blue-600 text-white py-3">
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

