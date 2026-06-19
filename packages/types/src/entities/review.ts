import type { Member } from "./member";

export type ProductReview = {
  _id: string;
  productId: string;
  memberId: Pick<Member, "_id" | "nick" | "image"> | string;
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  body: string;
  verifiedPurchase: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductReviewStats = {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export type ProductReviewListResponse = {
  list: ProductReview[];
  stats: ProductReviewStats;
};

export type ProductReviewEligibility = {
  canReview: boolean;
  hasReviewed: boolean;
  hasPurchased: boolean;
};
