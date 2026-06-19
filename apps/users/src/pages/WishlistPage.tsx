import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { useWishlist } from "../context/wishlist";
import Breadcrumb from "../components/Common/Breadcrumb";
import { useT } from "../i18n";
import { productDisplayTitle } from "../lib/productDisplayTitle";

export function WishlistPage() {
  const t = useT();
  const { items, removeItem, clear } = useWishlist();

  return (
    <>
      <Breadcrumb title="Wishlist" pages={["wishlist"]} />
      <section className="bg-[#F7F7F8] py-8 sm:py-10">
        <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#BE123C]">
                {t("wishlistSavedStyle")}
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-neutral-950">
                {t("wishlistYourWishlist")}
              </h2>
            </div>
            <button onClick={clear} className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#BE123C] ring-1 ring-neutral-200 transition hover:bg-[#FFF1F2]" type="button">
              {t("wishlistClear")}
            </button>
          </div>

          {items.length === 0 ? (
            <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-center shadow-[0_22px_80px_-60px_rgba(15,23,42,0.65)]">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF1F2] text-[#E11D48]">
                <Heart className="h-8 w-8" strokeWidth={2.2} />
              </div>
              <p className="text-lg font-black text-neutral-950">{t("wishlistEmpty")}</p>
              <Link to="/shop-with-sidebar" className="mt-6 inline-flex rounded-2xl bg-neutral-950 px-6 py-3 font-black text-white transition hover:-translate-y-px hover:bg-neutral-800">
                {t("wishlistBrowseProducts")}
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <article key={item.id} className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-[0_18px_70px_-58px_rgba(15,23,42,0.7)]">
                  <Link
                    to={`/shop-details?id=${item.id}`}
                    className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48]"
                  >
                    <img
                      src={item.imgs.thumbnails?.[0] ?? item.imgs.previews?.[0]}
                      alt=""
                      className="aspect-[4/5] w-full rounded-2xl bg-[#FAFAFA] object-contain p-4 ring-1 ring-neutral-100"
                    />
                    <div className="min-w-0 pt-4 text-left">
                      <p className="line-clamp-2 min-h-[2.75rem] font-black leading-snug text-neutral-950 transition hover:text-[#BE123C]">
                        {productDisplayTitle(item, t)}
                      </p>
                      <p className="mt-2 text-xl font-black text-[#E11D48]">${item.discountedPrice}</p>
                    </div>
                  </Link>
                  <button onClick={() => removeItem(item.id)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-black text-white transition hover:-translate-y-px hover:bg-[#BE123C]" type="button">
                    <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                    {t("common.remove")}
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
