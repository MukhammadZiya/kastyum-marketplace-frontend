export type ProductReview = {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** ISO date string */
  date: string;
  title?: string;
  body: string;
  verifiedPurchase?: boolean;
};
