import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { cartLineKey, useCart } from "../context/cart";
import { useCreateOrder } from "../hooks/orders";
import { getAuthToken } from "@repo/api";
import { useT } from "../i18n";
import { productDisplayTitle } from "../lib/productDisplayTitle";

export function CheckoutPage() {
  const t = useT();
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
      ...(i.selectedSizeName ? { size: i.selectedSizeName } : {}),
      ...(i.selectedColorName ? { color: i.selectedColorName } : {}),
      ...(i.selectedSizeId ? { sizeId: i.selectedSizeId } : {}),
      ...(i.selectedColorId ? { colorId: i.selectedColorId } : {}),
    }));

  const hasOnlyApiItems = items.length > 0 && lineItems.length === items.length;
  const signedIn = !!getAuthToken();

  return (
    <>
      <Breadcrumb title={t("checkoutPageTitle")} pages={["checkout"]} />
      <section className="bg-[#F7F7F8] py-8 sm:py-10">
        <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_22px_80px_-62px_rgba(15,23,42,0.75)] sm:p-6">
                <p className="mb-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#BE123C]">
                  Checkout
                </p>
                <h3 className="mb-5 text-2xl font-black tracking-tight text-neutral-950">
                  {t("checkoutBillingDetails")}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className="rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white" placeholder={t("common.firstName")} />
                  <input className="rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white" placeholder={t("common.lastName")} />
                  <input className="rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white sm:col-span-2" placeholder={t("common.email")} />
                  <input
                    className="rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white sm:col-span-2"
                    placeholder={t("checkoutShippingPayment")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_22px_80px_-62px_rgba(15,23,42,0.75)] sm:p-6">
                <h3 className="mb-5 text-xl font-black tracking-tight text-neutral-950">
                  {t("checkoutShippingPayment")}
                </h3>
                <div className="grid gap-3 text-sm font-bold text-neutral-700 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-2xl bg-[#FAFAFA] p-4"><input className="text-[#E11D48] focus:ring-[#FDA4AF]" type="radio" name="ship" defaultChecked /> {t("common.freeShipping")}</label>
                  <label className="flex items-center gap-3 rounded-2xl bg-[#FAFAFA] p-4"><input className="text-[#E11D48] focus:ring-[#FDA4AF]" type="radio" name="ship" /> {t("common.flatRate")}</label>
                  <label className="flex items-center gap-3 rounded-2xl bg-[#FAFAFA] p-4"><input className="text-[#E11D48] focus:ring-[#FDA4AF]" type="radio" name="pay" defaultChecked /> {t("common.cashOnDelivery")}</label>
                  <label className="flex items-center gap-3 rounded-2xl bg-[#FAFAFA] p-4"><input className="text-[#E11D48] focus:ring-[#FDA4AF]" type="radio" name="pay" /> {t("common.paypal")}</label>
                </div>
              </div>
            </div>
            <div className="h-fit rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_22px_80px_-62px_rgba(15,23,42,0.75)] sm:p-6 lg:sticky lg:top-28">
              <p className="mb-2 text-[12px] font-black uppercase tracking-[0.16em] text-neutral-400">
                {t("cartOrderSummary")}
              </p>
              <h3 className="mb-5 text-2xl font-black tracking-tight text-neutral-950">
                {t("checkoutYourOrder")}
              </h3>
              {formError ? (
                <p className="mb-3 text-sm text-red-600" role="alert">
                  {formError}
                </p>
              ) : null}
              {!signedIn ? (
                <p className="mb-3 text-sm text-neutral-600">
                  <Link to="/signin" className="font-black text-[#BE123C]">
                    {t("common.signIn")}
                  </Link>{" "}
                  {t("checkoutSignInToOrder")}
                </p>
              ) : null}
              {items.length > 0 && !hasOnlyApiItems ? (
                <p className="mb-3 rounded-2xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
                  {t("checkoutCatalogOnlyWarning")}
                </p>
              ) : null}
              <div className="space-y-3 text-sm">
                {items.length === 0 ? (
                  <p className="text-neutral-500">{t("checkoutNoItems")}</p>
                ) : (
                  items.map((item) => (
                    <div key={cartLineKey(item)} className="flex justify-between gap-4 rounded-2xl bg-[#FAFAFA] p-3">
                      <Link
                        to={
                          item.mongoId
                            ? `/shop-details?id=${encodeURIComponent(item.mongoId)}`
                            : `/shop-details?id=${item.id}`
                        }
                        className="min-w-0 text-left font-bold text-neutral-800 hover:text-[#BE123C]"
                      >
                        <span className="block">
                          {productDisplayTitle(item, t)}
                        </span>
                        {item.selectedSizeName || item.selectedColorName ?
                          <span className="mt-0.5 block text-xs text-neutral-500">
                            {[
                              item.selectedSizeName ?
                                `${t("cartItemSizeLabel")}: ${item.selectedSizeName}`
                              : null,
                              item.selectedColorName ?
                                `${t("cartItemColorLabel")}: ${item.selectedColorName}`
                              : null,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        : null}
                      </Link>
                      <span className="font-black text-neutral-950">
                        ${(item.discountedPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="my-4 border-t border-neutral-200" />
              <div className="flex justify-between rounded-2xl bg-[#FFF1F2] px-4 py-4">
                <span className="font-black text-neutral-800">{t("common.total")}</span>
                <span className="text-xl font-black text-[#BE123C]">${totalPrice.toFixed(2)}</span>
              </div>
              <button
                className="mt-6 w-full rounded-2xl bg-[#E11D48] py-3.5 font-black text-white shadow-[0_18px_40px_-22px_rgba(225,29,72,0.7)] transition hover:-translate-y-px hover:bg-[#BE123C] disabled:translate-y-0 disabled:opacity-50"
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
                    setFormError(`${t("common.signIn")} ${t("checkoutSignInToOrder")}`);
                    return;
                  }
                  if (!hasOnlyApiItems) {
                    setFormError(t("checkoutCatalogOnlyWarning"));
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
                {createOrder.isPending ? `${t("checkoutPlaceOrder")}…` : t("checkoutPlaceOrder")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
