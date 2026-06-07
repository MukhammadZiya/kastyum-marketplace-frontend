import { Link } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import Breadcrumb from "../components/Common/Breadcrumb";
import { cartLineKey, useCart } from "../context/cart";
import { useT } from "../i18n";
import { productDisplayTitle } from "../lib/productDisplayTitle";

export function CartPage() {
  const t = useT();
  const { items, removeItem, totalPrice, clear } = useCart();

  return (
    <>
      <Breadcrumb title="Cart" pages={["cart"]} />
      <section className="bg-[#F7F7F8] py-8 sm:py-10">
        <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-center shadow-[0_22px_80px_-60px_rgba(15,23,42,0.65)]">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF1F2] text-[#E11D48]">
                <ShoppingBag className="h-8 w-8" strokeWidth={2.2} />
              </div>
              <p className="mb-6 text-lg font-black text-neutral-950">{t("cartEmpty")}</p>
              <Link to="/shop-with-sidebar" className="inline-flex rounded-2xl bg-neutral-950 px-6 py-3 font-black text-white transition hover:-translate-y-px hover:bg-neutral-800">
                {t("common.continueShopping")}
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#BE123C]">
                    {t("cartShoppingBag")}
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight text-neutral-950">
                    {t("cartYourCart")}
                  </h2>
                </div>
                <button onClick={clear} className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#BE123C] ring-1 ring-neutral-200 transition hover:bg-[#FFF1F2]" type="button">
                  {t("cartClearCart")}
                </button>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <div className="space-y-4">
                {items.map((item) => (
                  <article
                    key={cartLineKey(item)}
                    className="grid gap-4 rounded-3xl border border-neutral-200 bg-white p-4 shadow-[0_18px_70px_-58px_rgba(15,23,42,0.7)] sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <Link
                      to={
                        item.mongoId
                          ? `/shop-details?id=${encodeURIComponent(item.mongoId)}`
                          : `/shop-details?id=${item.id}`
                      }
                      className="flex min-w-0 flex-1 items-center gap-4 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48]"
                    >
                      <img
                        src={item.imgs.thumbnails?.[0] ?? item.imgs.previews?.[0]}
                        alt=""
                        className="h-24 w-24 shrink-0 rounded-2xl bg-[#FAFAFA] object-contain p-2 ring-1 ring-neutral-100"
                      />
                      <div className="min-w-0 text-left">
                        <p className="line-clamp-2 text-base font-black text-neutral-950 transition hover:text-[#BE123C]">
                          {productDisplayTitle(item, t)}
                        </p>
                        {item.selectedSizeName || item.selectedColorName ?
                          <p className="mt-2 flex flex-wrap gap-1.5 text-xs font-bold text-neutral-500">
                            {[
                              item.selectedSizeName ?
                                `${t("cartItemSizeLabel")}: ${item.selectedSizeName}`
                              : null,
                              item.selectedColorName ?
                                `${t("cartItemColorLabel")}: ${item.selectedColorName}`
                              : null,
                            ]
                              .filter(Boolean)
                              .map((label) => (
                                <span key={label} className="rounded-full bg-neutral-100 px-2 py-1">
                                  {label}
                                </span>
                              ))}
                          </p>
                        : null}
                        <p className="mt-2 text-sm font-bold text-neutral-500">
                          ${item.discountedPrice} x {item.quantity}
                        </p>
                      </div>
                    </Link>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <p className="rounded-2xl bg-[#FFF1F2] px-4 py-2 text-lg font-black text-[#BE123C]">
                        ${(item.discountedPrice * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(cartLineKey(item))}
                        aria-label="Remove item"
                        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-neutral-500 ring-1 ring-neutral-200 transition hover:bg-[#FFF1F2] hover:text-[#BE123C]"
                        type="button"
                      >
                        <Trash2 className="h-5 w-5" strokeWidth={2.1} />
                      </button>
                    </div>
                  </article>
                ))}
                </div>

                <aside className="h-fit rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_22px_80px_-60px_rgba(15,23,42,0.75)] lg:sticky lg:top-28">
                  <p className="text-[12px] font-black uppercase tracking-[0.16em] text-neutral-400">
                    {t("cartOrderSummary")}
                  </p>
                  <div className="mt-5 flex justify-between rounded-2xl bg-[#FAFAFA] px-4 py-4">
                    <span className="font-bold text-neutral-700">{t("common.total")}</span>
                    <span className="text-xl font-black text-neutral-950">${totalPrice.toFixed(2)}</span>
                  </div>
                  <Link to="/checkout" className="mt-4 inline-flex w-full justify-center rounded-2xl bg-[#E11D48] px-6 py-3.5 font-black text-white shadow-[0_18px_40px_-22px_rgba(225,29,72,0.7)] transition hover:-translate-y-px hover:bg-[#BE123C]">
                    {t("checkoutPageTitle")}
                  </Link>
                  <Link to="/shop-with-sidebar" className="mt-3 inline-flex w-full justify-center rounded-2xl bg-neutral-950 px-6 py-3.5 font-black text-white transition hover:-translate-y-px hover:bg-neutral-800">
                    {t("common.continueShopping")}
                  </Link>
                </aside>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
