import { useMemo, useState, type FormEvent } from "react";
import { getAuthToken } from "@repo/api";
import type { ProductReview as ApiProductReview, ProductReviewStats } from "@repo/types";
import { StarRating } from "../Common/StarRating";
import { useCreateProductReview } from "../../hooks/products/useCreateProductReview";
import { useProductReviewEligibility } from "../../hooks/products/useProductReviewEligibility";
import { useProductReviews } from "../../hooks/products/useProductReviews";
import {
  formatReviewDate,
  getReviewStats,
  getReviewsForProduct,
} from "../../data/productReviews";
import { useI18nState, useT } from "../../i18n";
import type { ProductReview as DemoProductReview } from "../../types/review";

type Props = {
  productId: number;
  productMongoId?: string;
};

type NormalizedReview = {
  id: string;
  author: string;
  title?: string;
  body: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  verifiedPurchase: boolean;
};

function statsFromApi(reviews: ApiProductReview[], stats?: ProductReviewStats): ProductReviewStats {
  if (stats) return stats;
  const distribution: ProductReviewStats["distribution"] = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  for (const review of reviews) {
    distribution[review.rating] += 1;
  }
  const count = reviews.length;
  const average =
    count === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / count;
  return { average, count, distribution };
}

function authorName(review: ApiProductReview): string {
  if (typeof review.memberId === "object" && review.memberId?.nick) {
    return review.memberId.nick;
  }
  return "iBerry customer";
}

export function ProductReviewsSection({ productId, productMongoId }: Props) {
  const t = useT();
  const { locale } = useI18nState();
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const hasToken = !!getAuthToken();
  const apiReviews = useProductReviews(productMongoId);
  const eligibility = useProductReviewEligibility(productMongoId);
  const createReview = useCreateProductReview(productMongoId);

  const demoReviews = getReviewsForProduct(productId);
  const useApiReviews = !!productMongoId && !!apiReviews.data;

  const reviews = useMemo<NormalizedReview[]>(() => {
    if (useApiReviews) {
      return (apiReviews.data?.list ?? []).map((review) => ({
        id: review._id,
        author: authorName(review),
        title: review.title,
        body: review.body,
        rating: review.rating,
        date: review.createdAt ?? review.updatedAt ?? "",
        verifiedPurchase: review.verifiedPurchase,
      }));
    }

    return demoReviews.map((review: DemoProductReview) => ({
      id: review.id,
      author: t(review.authorKey),
      title: review.titleKey ? t(review.titleKey) : undefined,
      body: t(review.bodyKey),
      rating: review.rating,
      date: review.date,
      verifiedPurchase: !!review.verifiedPurchase,
    }));
  }, [apiReviews.data?.list, demoReviews, t, useApiReviews]);

  const stats = useMemo<ProductReviewStats>(() => {
    if (useApiReviews) {
      return statsFromApi(apiReviews.data?.list ?? [], apiReviews.data?.stats);
    }
    return getReviewStats(productId);
  }, [apiReviews.data?.list, apiReviews.data?.stats, productId, useApiReviews]);

  const basedOnText =
    stats.count === 1 ?
      t("productReviewsBasedOnOne")
    : t("productReviewsBasedOnMany").replace("{n}", String(stats.count));

  const canReview = !!eligibility.data?.canReview;
  const hasReviewed = !!eligibility.data?.hasReviewed;
  const hasPurchased = !!eligibility.data?.hasPurchased;

  const submitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = body.trim();
    if (!text) return;
    await createReview.mutateAsync({
      rating,
      title: title.trim() || undefined,
      body: text,
    });
    setTitle("");
    setBody("");
    setRating(5);
  };

  const helperText =
    !productMongoId ? null
    : !hasToken ? t("productReviewsSignInToReview")
    : hasReviewed ? t("productReviewsAlreadyReviewed")
    : !hasPurchased ? t("productReviewsPurchaseRequired")
    : null;

  return (
    <section className="mt-14 border-t border-neutral-200 pt-10" aria-labelledby="reviews-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D6334C]">
            {t("productReviewsEyebrow")}
          </p>
          <h2 id="reviews-heading" className="mt-2 text-2xl font-black text-neutral-950">
            {t("productReviewsHeading")}
          </h2>
        </div>
        <p className="text-sm font-medium text-neutral-500">{basedOnText}</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_24px_80px_-60px_rgba(15,23,42,0.45)]">
          <p className="text-4xl font-semibold tabular-nums text-neutral-900">
            {stats.average.toFixed(1)}
          </p>
          <StarRating value={stats.average} size="md" className="mt-2" />
          <p className="mt-2 text-sm text-neutral-600">
            {basedOnText}
          </p>

          <div className="mt-6 space-y-2">
            {([5, 4, 3, 2, 1] as const).map((star) => {
              const n = stats.distribution[star];
              const pct =
                stats.count === 0 ? 0 : Math.round((n / stats.count) * 100);
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-8 tabular-nums text-neutral-600">{star}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-[#D6334C] transition-[width]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 tabular-nums text-neutral-500">{n}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_24px_80px_-60px_rgba(15,23,42,0.45)]">
          <h3 className="text-lg font-black text-neutral-950">
            {t("productReviewsWriteTitle")}
          </h3>
          {canReview ?
            <form className="mt-5 space-y-4" onSubmit={submitReview}>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t("rating")}>
                {([1, 2, 3, 4, 5] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className={`h-10 w-10 rounded-2xl border text-sm font-black transition ${
                      rating === value ?
                        "border-[#D6334C] bg-[#D6334C] text-white shadow-sm"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-[#D6334C]/50"
                    }`}
                    aria-pressed={rating === value}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={120}
                placeholder={t("productReviewsTitlePlaceholder")}
                className="h-12 w-full rounded-2xl border border-neutral-200 px-4 text-sm font-medium outline-none transition focus:border-[#D6334C] focus:ring-4 focus:ring-[#D6334C]/10"
              />
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                maxLength={1200}
                placeholder={t("productReviewsBodyPlaceholder")}
                className="min-h-28 w-full resize-y rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#D6334C] focus:ring-4 focus:ring-[#D6334C]/10"
                required
              />
              {createReview.isError ?
                <p className="text-sm font-semibold text-[#D6334C]">
                  {createReview.error instanceof Error ?
                    createReview.error.message
                  : t("productReviewsSubmitError")}
                </p>
              : null}
              <button
                type="submit"
                disabled={createReview.isPending || !body.trim()}
                className="rounded-2xl bg-[#D6334C] px-6 py-3 text-sm font-black text-white shadow-[0_18px_38px_-24px_rgba(214,51,76,1)] transition hover:bg-[#B9253B] disabled:cursor-not-allowed disabled:bg-[#E993A0]"
              >
                {createReview.isPending ?
                  t("productReviewsSubmitting")
                : t("productReviewsSubmit")}
              </button>
            </form>
          : <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              {helperText ?? t("productReviewsEligibilityLoading")}
            </p>
          }
        </div>
      </div>

      {apiReviews.isPending && productMongoId ?
        <p className="mt-10 text-sm text-neutral-500">{t("loading")}</p>
      : reviews.length === 0 ?
        <p className="mt-10 text-sm text-neutral-600">
          {t("productReviewsEmpty")}
        </p>
      : <ul className="mt-10 grid gap-4 lg:grid-cols-2">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_20px_60px_-52px_rgba(15,23,42,0.45)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-neutral-950">{r.author}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <StarRating value={r.rating} size="sm" />
                    {r.date ?
                      <span className="text-xs text-neutral-500">
                        {formatReviewDate(r.date, locale)}
                      </span>
                    : null}
                    {r.verifiedPurchase ?
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-800">
                        {t("productVerifiedPurchase")}
                      </span>
                    : null}
                  </div>
                </div>
              </div>
              {r.title ?
                <p className="mt-4 font-bold text-neutral-950">{r.title}</p>
              : null}
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {r.body}
              </p>
            </li>
          ))}
        </ul>
      }
    </section>
  );
}
