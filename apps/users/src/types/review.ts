export type ProductReview = {
  id: string;
  /** i18n key in productDemo.strings / merged messages */
  authorKey: string;
  titleKey?: string;
  bodyKey: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** ISO date string */
  date: string;
  verifiedPurchase?: boolean;
};
