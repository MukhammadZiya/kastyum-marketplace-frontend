import type { ProductReview } from "../types/review";

/** Dummy reviews per product — replace with API response when backend exists. */
export const reviewsByProductId: Record<number, ProductReview[]> = {
  1: [
    {
      id: "1a",
      author: "Marcus T.",
      rating: 5,
      date: "2026-02-14",
      title: "Sharp navy suit",
      body: "Shoulders sit perfectly and the wool has a nice drape. Wore it to a client dinner and got compliments.",
      verifiedPurchase: true,
    },
    {
      id: "1b",
      author: "Alex R.",
      rating: 4,
      date: "2026-01-22",
      body: "Great value. Needed a quick hem on the trousers—otherwise ready to wear.",
      verifiedPurchase: true,
    },
  ],
  2: [
    {
      id: "2a",
      author: "Sam K.",
      rating: 5,
      date: "2026-03-01",
      title: "Slim but not tight",
      body: "Charcoal reads well in photos and in person. Fabric breathes on warmer days.",
      verifiedPurchase: true,
    },
    {
      id: "2b",
      author: "Jordan P.",
      rating: 4,
      date: "2026-02-18",
      body: "Happy with the fit. Jacket sleeves were spot-on for my arm length.",
      verifiedPurchase: true,
    },
    {
      id: "2c",
      author: "Riley M.",
      rating: 5,
      date: "2026-01-05",
      title: "Office staple",
      body: "Looks expensive without feeling stiff. Wears well with brown or black shoes.",
      verifiedPurchase: false,
    },
  ],
  3: [
    {
      id: "3a",
      author: "Casey D.",
      rating: 5,
      date: "2025-12-10",
      title: "Versatile beige",
      body: "Works for daytime events and dressed-down with a knit. Color is true to the site.",
      verifiedPurchase: true,
    },
    {
      id: "3b",
      author: "Taylor B.",
      rating: 4,
      date: "2025-11-28",
      body: "Classic cut. I’d size up if you prefer a roomier jacket.",
      verifiedPurchase: true,
    },
  ],
  4: [
    {
      id: "4a",
      author: "Morgan L.",
      rating: 5,
      date: "2026-02-02",
      title: "Wedding-ready",
      body: "Peak lapels and satin trim look formal without feeling costume-y. Packed well for travel.",
      verifiedPurchase: true,
    },
    {
      id: "4b",
      author: "Jamie C.",
      rating: 5,
      date: "2026-01-12",
      body: "Black is deep and even under indoor lighting. Waist suppression is flattering.",
      verifiedPurchase: true,
    },
  ],
  5: [
    {
      id: "5a",
      author: "Chris W.",
      rating: 4,
      date: "2026-03-08",
      title: "Bold but wearable",
      body: "Texture hides wrinkles better than plain cloth. Turned heads at a spring gala.",
      verifiedPurchase: true,
    },
    {
      id: "5b",
      author: "Pat N.",
      rating: 5,
      date: "2026-02-20",
      body: "Emerald is richer than my monitor showed—in a good way. Lining feels smooth.",
      verifiedPurchase: true,
    },
  ],
  6: [
    {
      id: "6a",
      author: "Drew H.",
      rating: 5,
      date: "2026-01-30",
      title: "Summer events solved",
      body: "Ivory reads elegant, not stark. Lightweight enough for outdoor photos.",
      verifiedPurchase: true,
    },
    {
      id: "6b",
      author: "Quinn F.",
      rating: 4,
      date: "2025-12-15",
      body: "Blazer and trousers match perfectly. Dry clean only as expected.",
      verifiedPurchase: true,
    },
  ],
  7: [
    {
      id: "7a",
      author: "Avery S.",
      rating: 5,
      date: "2026-02-25",
      title: "Three-piece done right",
      body: "Waistcoat adds structure. Brown tone pairs with burgundy tie and oxfords.",
      verifiedPurchase: true,
    },
    {
      id: "7b",
      author: "Reese G.",
      rating: 4,
      date: "2026-01-08",
      body: "Solid construction. Vest buttons align cleanly with the jacket.",
      verifiedPurchase: false,
    },
  ],
  8: [
    {
      id: "8a",
      author: "Blake O.",
      rating: 4,
      date: "2026-02-11",
      title: "Evening blue",
      body: "Midnight reads almost black in dim light—perfect for cocktail dress codes.",
      verifiedPurchase: true,
    },
    {
      id: "8b",
      author: "Skyler V.",
      rating: 5,
      date: "2025-11-02",
      body: "Silhouette is trim but I could still move comfortably on the dance floor.",
      verifiedPurchase: true,
    },
  ],
};

export function getReviewsForProduct(productId: number): ProductReview[] {
  return reviewsByProductId[productId] ?? [];
}

export type ReviewStats = {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export function getReviewStats(productId: number): ReviewStats {
  const list = getReviewsForProduct(productId);
  const distribution: ReviewStats["distribution"] = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  for (const r of list) {
    distribution[r.rating] += 1;
  }
  const count = list.length;
  const average =
    count === 0
      ? 0
      : list.reduce((s, r) => s + r.rating, 0) / count;
  return { average, count, distribution };
}

export function formatReviewDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
