import { useMemo, useState } from "react";
import Breadcrumb from "../components/Common/Breadcrumb";
import { shopData } from "../data/shopData";
import { useCart } from "../context/cart";
import { useWishlist } from "../context/wishlist";

export function ShopDetailsPage() {
  const product = useMemo(() => shopData[0], []);
  const [preview, setPreview] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { addItem: addWishlistItem } = useWishlist();

  if (!product) return null;

  return (
    <>
      <Breadcrumb title="Shop Details" pages={["shop details"]} />
      <section className="py-10">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="grid lg:grid-cols-[570px_1fr] gap-10">
            <div>
              <div className="rounded-lg bg-neutral-100 p-8 flex justify-center items-center min-h-[500px]">
                <img src={product.imgs.previews[preview]} alt={product.title} className="max-h-[380px] object-contain" />
              </div>
              <div className="flex gap-3 mt-5">
                {product.imgs.thumbnails.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setPreview(i)}
                    className={`w-20 h-20 rounded-md border ${i === preview ? "border-blue-600" : "border-neutral-200"} bg-neutral-50 flex items-center justify-center`}
                    type="button"
                  >
                    <img src={img} alt="thumb" className="max-w-14 max-h-14 object-contain" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900">{product.title}</h1>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-2xl font-semibold text-neutral-900">${product.discountedPrice}</span>
                <span className="line-through text-neutral-500">${product.price}</span>
              </div>
              <p className="mt-5 text-neutral-600">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setQty((v) => Math.max(1, v - 1))}
                  className="w-10 h-10 rounded border border-neutral-300"
                  type="button"
                >
                  -
                </button>
                <span className="w-14 text-center">{qty}</span>
                <button
                  onClick={() => setQty((v) => v + 1)}
                  className="w-10 h-10 rounded border border-neutral-300"
                  type="button"
                >
                  +
                </button>
              </div>

              <div className="mt-7 flex gap-3">
                <button
                  onClick={() => addItem({ ...product, quantity: qty })}
                  className="px-7 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                  type="button"
                >
                  Purchase Now
                </button>
                <button
                  onClick={() => addWishlistItem(product)}
                  className="px-5 py-3 rounded-md border border-neutral-300 hover:bg-neutral-50"
                  type="button"
                >
                  Add Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

