import { Link } from "react-router-dom";
import { useWishlist } from "../context/wishlist";
import Breadcrumb from "../components/Common/Breadcrumb";

export function WishlistPage() {
  const { items, removeItem, clear } = useWishlist();

  return (
    <>
      <Breadcrumb title="Wishlist" pages={["wishlist"]} />
      <section className="bg-neutral-100 py-10">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-neutral-900">Your Wishlist</h2>
            <button onClick={clear} className="text-blue-600" type="button">
              Clear Wishlist
            </button>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-lg border border-neutral-200 p-10 text-center text-neutral-600">
              Wishlist is empty.
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-neutral-200">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 border-b border-neutral-200 p-5 last:border-b-0">
                  <Link
                    to={`/shop-details?id=${item.id}`}
                    className="flex min-w-0 flex-1 items-center gap-4 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <img
                      src={item.imgs.thumbnails[0]}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-md bg-neutral-50 object-contain"
                    />
                    <div className="min-w-0 text-left">
                      <p className="font-medium text-neutral-900 hover:text-blue-600">{item.title}</p>
                      <p className="text-sm text-neutral-600">${item.discountedPrice}</p>
                    </div>
                  </Link>
                  <button onClick={() => removeItem(item.id)} className="text-red-600" type="button">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

