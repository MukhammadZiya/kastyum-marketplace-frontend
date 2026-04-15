import type { ProductWithRelations } from "./product";

export type HomeShowcaseSlotConfig = {
  productId: string;
  customImage: string | null;
};

export type HomeShowcaseAdminConfig = {
  newArrivals: HomeShowcaseSlotConfig[];
  mostPurchased: HomeShowcaseSlotConfig[];
};

export type HomeShowcaseSlotPublic = {
  product: ProductWithRelations;
  customImage: string | null;
};

export type HomeShowcasePublicResponse = {
  newArrivals: HomeShowcaseSlotPublic[];
  mostPurchased: HomeShowcaseSlotPublic[];
};

export type HomeShowcaseUpdateBody = {
  newArrivals: HomeShowcaseSlotConfig[];
  mostPurchased: HomeShowcaseSlotConfig[];
};
