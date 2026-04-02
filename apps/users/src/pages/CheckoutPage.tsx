import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { useCart } from "../context/cart";
import { useCreateOrder } from "../hooks/orders";
import { getAuthToken } from "@repo/api";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clear } = useCart();
  const createOrder = useCreateOrder();
  const [address, setAddress] = useState("");
  const [formError, setFormError] = useState("");

  const lineItems = items
    .filter((i) => i.mongoId)
    .map((i) => ({
      productId: i.mongoId as string,
      quantity: i.quantity,
    }));

  const hasOnlyApiItems = items.length > 0 && lineItems.length === items.length;
  const signedIn = !!getAuthToken();

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
                  <input
                    className="border border-neutral-200 rounded-md px-4 py-3 sm:col-span-2"
                    placeholder="Shipping address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
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
              {formError ? (
                <p className="mb-3 text-sm text-red-600" role="alert">
                  {formError}
                </p>
              ) : null}
              {!signedIn ? (
                <p className="mb-3 text-sm text-neutral-600">
                  <Link to="/signin" className="text-blue-600 font-medium">
                    Sign in
                  </Link>{" "}
                  to place an order.
                </p>
              ) : null}
              {items.length > 0 && !hasOnlyApiItems ? (
                <p className="mb-3 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-md p-3">
                  Only products from the live catalog can be ordered. Remove template-only items or add products from the shop.
                </p>
              ) : null}
              <div className="space-y-3 text-sm">
                {items.length === 0 ? (
                  <p className="text-neutral-500">No items in cart.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4">
                      <Link
                        to={
                          item.mongoId
                            ? `/shop-details?id=${encodeURIComponent(item.mongoId)}`
                            : `/shop-details?id=${item.id}`
                        }
                        className="min-w-0 text-left text-neutral-700 hover:text-blue-600"
                      >
                        {item.title}
                      </Link>
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
                className="w-full mt-6 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 font-medium"
                type="button"
                disabled={
                  createOrder.isPending ||
                  items.length === 0 ||
                  !signedIn ||
                  !hasOnlyApiItems
                }
                onClick={() => {
                  setFormError("");
                  if (!signedIn) {
                    setFormError("Sign in to place an order.");
                    return;
                  }
                  if (!hasOnlyApiItems) {
                    setFormError("Your cart must only contain catalog products.");
                    return;
                  }
                  createOrder.mutate(
                    {
                      items: lineItems,
                      shippingAddress: address.trim() || undefined,
                    },
                    {
                      onSuccess: () => {
                        clear();
                        navigate("/my-account");
                      },
                      onError: (err) => {
                        setFormError(
                          err instanceof Error ? err.message : "Order failed.",
                        );
                      },
                    },
                  );
                }}
              >
                {createOrder.isPending ? "Placing order…" : "Place order"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
