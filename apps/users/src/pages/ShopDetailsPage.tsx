import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { StarRating } from "../components/Common/StarRating";
import { ProductReviewsSection } from "../components/Shop/ProductReviewsSection";
import { shopData } from "../data/shopData";
import { getReviewStats } from "../data/productReviews";
import { useCart } from "../context/cart";
import { useWishlist } from "../context/wishlist";

export function ShopDetailsPage() {
  const [searchParams] = useSearchParams();
  const [preview, setPreview] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { addItem: addWishlistItem } = useWishlist();

  const product = useMemo(() => {
    const raw = searchParams.get("id");
    const id = raw ? Number.parseInt(raw, 10) : NaN;
    if (Number.isFinite(id)) {
      const found = shopData.find((p) => p.id === id);
      if (found) return found;
    }
    return shopData[0] ?? null;
  }, [searchParams]);

  const reviewStats = useMemo(
    () => (product ? getReviewStats(product.id) : null),
    [product],
  );

  useEffect(() => {
    setPreview(0);
    setQty(1);
  }, [product?.id]);

  if (!product) return null;

  return (
    <>
      <Breadcrumb title="Shop Details" pages={["shop", "shop details"]} />
      <section className="py-10">
        <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
          <div className="grid gap-10 lg:grid-cols-[570px_1fr]">
            <div>
              <div className="flex min-h-[500px] items-center justify-center rounded-lg bg-neutral-100 p-8">
                <img
                  src={product.imgs.previews[preview]}
                  alt={product.title}
                  className="max-h-[380px] object-contain"
                />
              </div>
              <div className="mt-5 flex gap-3">
                {product.imgs.thumbnails.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setPreview(i)}
                    className={`flex h-20 w-20 items-center justify-center rounded-md border bg-neutral-50 ${
                      i === preview ? "border-blue-600" : "border-neutral-200"
                    }`}
                    type="button"
                  >
                    <img src={img} alt="" className="max-h-14 max-w-14 object-contain" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900">{product.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {reviewStats && reviewStats.count > 0 ? (
                  <>
                    <StarRating value={reviewStats.average} size="md" />
                    <span className="text-sm text-neutral-600">
                      {reviewStats.average.toFixed(1)} out of 5 · {reviewStats.count} review
                      {reviewStats.count === 1 ? "" : "s"}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-neutral-600">
                    {product.reviews} shopper ratings · see reviews below
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-2xl font-semibold text-neutral-900">
                  ${product.discountedPrice}
                </span>
                <span className="text-neutral-500 line-through">${product.price}</span>
              </div>
              <p className="mt-5 text-neutral-600">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setQty((v) => Math.max(1, v - 1))}
                  className="h-10 w-10 rounded border border-neutral-300"
                  type="button"
                >
                  -
                </button>
                <span className="w-14 text-center">{qty}</span>
                <button
                  onClick={() => setQty((v) => v + 1)}
                  className="h-10 w-10 rounded border border-neutral-300"
                  type="button"
                >
                  +
                </button>
              </div>

              <div className="mt-7 flex gap-3">
                <button
                  onClick={() => addItem({ ...product, quantity: qty })}
                  className="rounded-md bg-blue-600 px-7 py-3 text-white hover:bg-blue-700"
                  type="button"
                >
                  Purchase Now
                </button>
                <button
                  onClick={() => addWishlistItem(product)}
                  className="rounded-md border border-neutral-300 px-5 py-3 hover:bg-neutral-50"
                  type="button"
                >
                  Add Wishlist
                </button>
              </div>
            </div>
          </div>

          <ProductReviewsSection productId={product.id} />
        </div>
      </section>
    </>
  );
}
