import type { ProductReview } from "../types/review";

const LOCALE_TO_BCP47: Record<string, string> = {
  en: "en-US",
  ru: "ru-RU",
  uz: "uz-UZ",
};

/** Dummy reviews per product — replace with API response when backend exists. */
export const reviewsByProductId: Record<number, ProductReview[]> = {
  1: [
    {
      id: "1a",
      authorKey: "demoRev1aAuthor",
      titleKey: "demoRev1aTitle",
      bodyKey: "demoRev1aBody",
      rating: 5,
      date: "2026-02-14",
      verifiedPurchase: true,
    },
    {
      id: "1b",
      authorKey: "demoRev1bAuthor",
      bodyKey: "demoRev1bBody",
      rating: 4,
      date: "2026-01-22",
      verifiedPurchase: true,
    },
  ],
  2: [
    {
      id: "2a",
      authorKey: "demoRev2aAuthor",
      titleKey: "demoRev2aTitle",
      bodyKey: "demoRev2aBody",
      rating: 5,
      date: "2026-03-01",
      verifiedPurchase: true,
    },
    {
      id: "2b",
      authorKey: "demoRev2bAuthor",
      bodyKey: "demoRev2bBody",
      rating: 4,
      date: "2026-02-18",
      verifiedPurchase: true,
    },
    {
      id: "2c",
      authorKey: "demoRev2cAuthor",
      titleKey: "demoRev2cTitle",
      bodyKey: "demoRev2cBody",
      rating: 5,
      date: "2026-01-05",
      verifiedPurchase: false,
    },
  ],
  3: [
    {
      id: "3a",
      authorKey: "demoRev3aAuthor",
      titleKey: "demoRev3aTitle",
      bodyKey: "demoRev3aBody",
      rating: 5,
      date: "2025-12-10",
      verifiedPurchase: true,
    },
    {
      id: "3b",
      authorKey: "demoRev3bAuthor",
      bodyKey: "demoRev3bBody",
      rating: 4,
      date: "2025-11-28",
      verifiedPurchase: true,
    },
  ],
  4: [
    {
      id: "4a",
      authorKey: "demoRev4aAuthor",
      titleKey: "demoRev4aTitle",
      bodyKey: "demoRev4aBody",
      rating: 5,
      date: "2026-02-02",
      verifiedPurchase: true,
    },
    {
      id: "4b",
      authorKey: "demoRev4bAuthor",
      bodyKey: "demoRev4bBody",
      rating: 5,
      date: "2026-01-12",
      verifiedPurchase: true,
    },
  ],
  5: [
    {
      id: "5a",
      authorKey: "demoRev5aAuthor",
      titleKey: "demoRev5aTitle",
      bodyKey: "demoRev5aBody",
      rating: 4,
      date: "2026-03-08",
      verifiedPurchase: true,
    },
    {
      id: "5b",
      authorKey: "demoRev5bAuthor",
      bodyKey: "demoRev5bBody",
      rating: 5,
      date: "2026-02-20",
      verifiedPurchase: true,
    },
  ],
  6: [
    {
      id: "6a",
      authorKey: "demoRev6aAuthor",
      titleKey: "demoRev6aTitle",
      bodyKey: "demoRev6aBody",
      rating: 5,
      date: "2026-01-30",
      verifiedPurchase: true,
    },
    {
      id: "6b",
      authorKey: "demoRev6bAuthor",
      bodyKey: "demoRev6bBody",
      rating: 4,
      date: "2025-12-15",
      verifiedPurchase: true,
    },
  ],
  7: [
    {
      id: "7a",
      authorKey: "demoRev7aAuthor",
      titleKey: "demoRev7aTitle",
      bodyKey: "demoRev7aBody",
      rating: 5,
      date: "2026-02-25",
      verifiedPurchase: true,
    },
    {
      id: "7b",
      authorKey: "demoRev7bAuthor",
      bodyKey: "demoRev7bBody",
      rating: 4,
      date: "2026-01-08",
      verifiedPurchase: false,
    },
  ],
  8: [
    {
      id: "8a",
      authorKey: "demoRev8aAuthor",
      titleKey: "demoRev8aTitle",
      bodyKey: "demoRev8aBody",
      rating: 4,
      date: "2026-02-11",
      verifiedPurchase: true,
    },
    {
      id: "8b",
      authorKey: "demoRev8bAuthor",
      bodyKey: "demoRev8bBody",
      rating: 5,
      date: "2025-11-02",
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

export function formatReviewDate(iso: string, locale: string): string {
  const tag = LOCALE_TO_BCP47[locale] ?? "en-US";
  try {
    return new Intl.DateTimeFormat(tag, {
      dateStyle: "medium",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
