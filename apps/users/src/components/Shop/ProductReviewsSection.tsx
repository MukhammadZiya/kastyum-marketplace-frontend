import { StarRating } from "../Common/StarRating";
import {
  formatReviewDate,
  getReviewStats,
  getReviewsForProduct,
} from "../../data/productReviews";

type Props = {
  productId: number;
};

export function ProductReviewsSection({ productId }: Props) {
  const reviews = getReviewsForProduct(productId);
  const stats = getReviewStats(productId);

  if (reviews.length === 0) {
    return (
      <section className="mt-14 border-t border-neutral-200 pt-10" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="text-xl font-semibold text-neutral-900">
          Customer reviews
        </h2>
        <p className="mt-3 text-sm text-neutral-600">
          No written reviews yet. Be the first to share your experience once purchases are live.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-14 border-t border-neutral-200 pt-10" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-xl font-semibold text-neutral-900">
        Customer reviews
      </h2>

      <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="lg:w-52 shrink-0">
          <p className="text-4xl font-semibold tabular-nums text-neutral-900">
            {stats.average.toFixed(1)}
          </p>
          <StarRating value={stats.average} size="md" className="mt-2" />
          <p className="mt-2 text-sm text-neutral-600">
            Based on {stats.count} review{stats.count === 1 ? "" : "s"}
          </p>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {([5, 4, 3, 2, 1] as const).map((star) => {
            const n = stats.distribution[star];
            const pct =
              stats.count === 0 ? 0 : Math.round((n / stats.count) * 100);
            return (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="w-8 tabular-nums text-neutral-600">{star}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-[width]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 tabular-nums text-neutral-500">{n}</span>
              </div>
            );
          })}
        </div>
      </div>

      <ul className="mt-12 space-y-8">
        {reviews.map((r) => (
          <li
            key={r.id}
            className="border-b border-neutral-100 pb-8 last:border-0 last:pb-0"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-neutral-900">{r.author}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <StarRating value={r.rating} size="sm" />
                  <span className="text-xs text-neutral-500">
                    {formatReviewDate(r.date)}
                  </span>
                  {r.verifiedPurchase ? (
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                      Verified purchase
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            {r.title ? (
              <p className="mt-3 font-medium text-neutral-900">{r.title}</p>
            ) : null}
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{r.body}</p>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs text-neutral-500">
        Reviews are sample data for the storefront demo. Connect your API to load real buyer feedback.
      </p>
    </section>
  );
}
