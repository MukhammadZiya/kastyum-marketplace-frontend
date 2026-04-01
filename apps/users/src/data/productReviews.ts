import type { ProductReview } from "../types/review";

/** Dummy reviews per product — replace with API response when backend exists. */
export const reviewsByProductId: Record<number, ProductReview[]> = {
  1: [
    {
      id: "1a",
      author: "Marcus T.",
      rating: 5,
      date: "2026-02-14",
      title: "Solid for the price",
      body: "Comfortable grip, works great on PC. No driver hassle. Would buy again.",
      verifiedPurchase: true,
    },
    {
      id: "1b",
      author: "Alex R.",
      rating: 4,
      date: "2026-01-22",
      body: "Good build. Triggers are a bit soft but fine for casual gaming.",
      verifiedPurchase: true,
    },
  ],
  2: [
    {
      id: "2a",
      author: "Sam K.",
      rating: 5,
      date: "2026-03-01",
      title: "Battery life is excellent",
      body: "Camera upgrade is noticeable vs my old phone. Shipping was fast.",
      verifiedPurchase: true,
    },
    {
      id: "2b",
      author: "Jordan P.",
      rating: 4,
      date: "2026-02-18",
      body: "Happy overall. Box had a small dent but phone was fine.",
      verifiedPurchase: true,
    },
    {
      id: "2c",
      author: "Riley M.",
      rating: 5,
      date: "2026-01-05",
      title: "Worth it",
      body: "Display is gorgeous. Face ID is quick.",
      verifiedPurchase: false,
    },
  ],
  3: [
    {
      id: "3a",
      author: "Casey D.",
      rating: 5,
      date: "2025-12-10",
      title: "Perfect for home office",
      body: "Quiet, fast, screen is stunning. Speakers are better than expected.",
      verifiedPurchase: true,
    },
    {
      id: "3b",
      author: "Taylor B.",
      rating: 4,
      date: "2025-11-28",
      body: "Love the design. Wish the stand had more tilt range.",
      verifiedPurchase: true,
    },
  ],
  4: [
    {
      id: "4a",
      author: "Morgan L.",
      rating: 5,
      date: "2026-02-02",
      title: "Best laptop I’ve owned",
      body: "Fan rarely spins for my workflow. Keyboard is great.",
      verifiedPurchase: true,
    },
    {
      id: "4b",
      author: "Jamie C.",
      rating: 5,
      date: "2026-01-12",
      body: "Lightweight and battery lasts all day at uni.",
      verifiedPurchase: true,
    },
  ],
  5: [
    {
      id: "5a",
      author: "Chris W.",
      rating: 4,
      date: "2026-03-08",
      title: "Rugged and clear",
      body: "Display is easy to read outdoors. Bands are pricey though.",
      verifiedPurchase: true,
    },
    {
      id: "5b",
      author: "Pat N.",
      rating: 5,
      date: "2026-02-20",
      body: "Action button is handy. Fitness tracking matches my gym tracker.",
      verifiedPurchase: true,
    },
  ],
  6: [
    {
      id: "6a",
      author: "Drew H.",
      rating: 5,
      date: "2026-01-30",
      title: "Ergonomics are unmatched",
      body: "Scroll wheel and side buttons changed how I work. Worth every dollar.",
      verifiedPurchase: true,
    },
    {
      id: "6b",
      author: "Quinn F.",
      rating: 4,
      date: "2025-12-15",
      body: "Heavy but comfortable. Software lets you remap everything.",
      verifiedPurchase: true,
    },
  ],
  7: [
    {
      id: "7a",
      author: "Avery S.",
      rating: 5,
      date: "2026-02-25",
      title: "Great for reading and notes",
      body: "Apple Pencil latency is low. Screen is bright enough for patio use.",
      verifiedPurchase: true,
    },
    {
      id: "7b",
      author: "Reese G.",
      rating: 4,
      date: "2026-01-08",
      body: "Solid tablet. iPadOS does the job for my workflow.",
      verifiedPurchase: false,
    },
  ],
  8: [
    {
      id: "8a",
      author: "Blake O.",
      rating: 4,
      date: "2026-02-11",
      title: "Stable Wi‑Fi",
      body: "Easy setup. Coverage improved in our flat immediately.",
      verifiedPurchase: true,
    },
    {
      id: "8b",
      author: "Skyler V.",
      rating: 5,
      date: "2025-11-02",
      body: "No drops during video calls. Firmware update was one-click.",
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
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
