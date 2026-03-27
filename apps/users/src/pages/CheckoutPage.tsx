import Breadcrumb from "../components/Common/Breadcrumb";
import { useCart } from "../context/cart";

export function CheckoutPage() {
  const { items, totalPrice } = useCart();

  return (
    <>
      <Breadcrumb title="Checkout" pages={["checkout"]} />
      <section className="bg-neutral-100 py-10">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="grid lg:grid-cols-[1fr_420px] gap-8">
            <div className="space-y-6">
              <div className="bg-white border border-neutral-200 rounded-lg p-6">
                <h3 className="font-semibold text-neutral-900 mb-4">Billing Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input className="border border-neutral-200 rounded-md px-4 py-3" placeholder="First Name" />
                  <input className="border border-neutral-200 rounded-md px-4 py-3" placeholder="Last Name" />
                  <input className="border border-neutral-200 rounded-md px-4 py-3 sm:col-span-2" placeholder="Email" />
                  <input className="border border-neutral-200 rounded-md px-4 py-3 sm:col-span-2" placeholder="Address" />
                </div>
              </div>
              <div className="bg-white border border-neutral-200 rounded-lg p-6">
                <h3 className="font-semibold text-neutral-900 mb-4">Shipping & Payment</h3>
                <div className="space-y-3 text-sm text-neutral-700">
                  <label className="flex items-center gap-2"><input type="radio" name="ship" defaultChecked /> Free Shipping</label>
                  <label className="flex items-center gap-2"><input type="radio" name="ship" /> Flat Rate</label>
                  <label className="flex items-center gap-2"><input type="radio" name="pay" defaultChecked /> Cash on Delivery</label>
                  <label className="flex items-center gap-2"><input type="radio" name="pay" /> PayPal</label>
                </div>
              </div>
            </div>
            <div className="bg-white border border-neutral-200 rounded-lg p-6 h-fit">
              <h3 className="font-semibold text-neutral-900 mb-4">Your Order</h3>
              <div className="space-y-3 text-sm">
                {items.length === 0 ? (
                  <p className="text-neutral-500">No items in cart.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4">
                      <span className="text-neutral-700">{item.title}</span>
                      <span className="font-medium text-neutral-900">
                        ${(item.discountedPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="my-4 border-t border-neutral-200" />
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
              </div>
              <button
                className="w-full mt-6 rounded-md bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium"
                type="button"
              >
                Process to Checkout
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

